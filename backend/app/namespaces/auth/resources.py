from flask import current_app
from flask_restplus import Resource
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    create_refresh_token,
    get_raw_jwt,
    get_jti,
    get_jwt_identity,
    verify_fresh_jwt_in_request,
    verify_jwt_refresh_token_in_request,
)

from . import auth_api
from .models import sing_model, sign_in_model, forgot_password_model, reset_password_model
from .async_tasks import send_async_email
from .blacklist_helpers import get_blacklist_key
from .jwt_wrappers import jwt_in_storage_required

from app.extentions import db
from app.storage import refresh_tokens, email_confirm_tokens, change_password_tokens, access_tokens_blacklist
from app.models import User, UserStatus


def description(*messages):
    return ' | '.join(messages)


def get_activate_link(token):
    domain = current_app.config['FRONTEND_DOMAIN']
    return f'{domain}/verify-email/{token}'


def get_reset_password_link(token):
    domain = current_app.config['FRONTEND_DOMAIN']
    return f'{domain}/change-password/{token}'


def send_email_to_activate(user):
    email_token = create_access_token(identity=user.public_id, fresh=True)
    link = get_activate_link(email_token)

    email_token_jti = get_jti(email_token)
    email_confirm_tokens.set(str(user.public_id), email_token_jti)

    send_async_email.delay(user.email,
                           link,
                           '[PE KPI] Confirm email.',
                           text_path='email_confirm.txt',
                           html_path='email_confirm.html'
                           )


@auth_api.route('/confirm-email')
class ConfirmEmailResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_401 = 'Invalid token!'
    MESSAGE_200 = 'The email was successfully verified.'

    @auth_api.response(401, description(MESSAGE_401, 'Token has expired', 'Fresh token required'))
    @auth_api.response(404, MESSAGE_404)
    @jwt_in_storage_required(email_confirm_tokens, jwt_verify_strategy=verify_fresh_jwt_in_request)
    def get(self):
        """Endpoint for confirming user email."""
        public_id = get_jwt_identity()
        current_user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)
        current_user.status = UserStatus.active
        db.session.commit()

        email_confirm_tokens.delete(public_id)

        return {'msg': self.MESSAGE_200}, 200


@auth_api.route('/sing-up')
class SingUpResource(Resource):

    MESSAGE_201 = 'User successfully created.'
    MESSAGE_409 = 'User already exist!'

    @auth_api.response(201, MESSAGE_201)
    @auth_api.response(409, MESSAGE_409)
    @auth_api.expect(sing_model, validate=True)
    def post(self):
        """User Sign up view"""
        new_user = auth_api.payload
        password = new_user.pop('password')

        user = User.query.filter_by(email=new_user['email']).first()
        if user:
            # Close transaction
            db.session.commit()
            return {'msg': self.MESSAGE_409}, 409

        user = User(**new_user)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        send_email_to_activate(user)

        return {'msg': self.MESSAGE_201, 'public_id': str(user.public_id)}, 201


@auth_api.route('/sing-in')
class SingInResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_403 = 'User must be active!'
    MESSAGE_401 = 'Incorrect password!'
    MESSAGE_200 = 'OK!'

    @auth_api.expect(sing_model, validate=True)
    @auth_api.response(404, MESSAGE_404)
    @auth_api.response(403, MESSAGE_403)
    @auth_api.response(401, MESSAGE_401)
    @auth_api.response(200, MESSAGE_200, model=sign_in_model)
    def post(self):
        """User Sign in view"""
        user_data = auth_api.payload
        current_user = User.query.filter_by(email=user_data['email']).first_or_404(description=self.MESSAGE_404)

        if not current_user.is_correct_password(user_data['password']):
            return {'msg': self.MESSAGE_401}, 401

        if current_user.status != UserStatus.active:
            send_email_to_activate(current_user)
            return {'msg': self.MESSAGE_403}, 403

        access_token = create_access_token(identity=current_user.public_id)
        refresh_token = create_refresh_token(identity=current_user.public_id)
        refresh_token_jti = get_jti(refresh_token)

        refresh_tokens.set(str(current_user.public_id), refresh_token_jti)

        return {'access_token': access_token, 'refresh_token': refresh_token}, 200


@auth_api.route('/refresh')
class RefreshResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_401 = 'Invalid refresh token!'
    MESSAGE_200 = 'OK!'

    @auth_api.response(200, MESSAGE_200, model=sign_in_model)
    @auth_api.response(401, description(MESSAGE_401, 'Token has expired', 'Fresh token required'))
    @auth_api.response(404, MESSAGE_404)
    @jwt_in_storage_required(refresh_tokens, jwt_verify_strategy=verify_jwt_refresh_token_in_request)
    def post(self):
        """Endpoint for refreshing access tokens."""
        public_id = get_jwt_identity()
        current_user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)

        access_token = create_access_token(identity=current_user.public_id)
        refresh_token = create_refresh_token(identity=current_user.public_id)

        refresh_token_jti = get_jti(refresh_token)
        refresh_tokens.set(public_id, refresh_token_jti)
        return {'access_token': access_token, 'refresh_token': refresh_token}, 200


@auth_api.route('/forgot-password')
class ForgotPasswordResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_202 = 'Check your email!'

    @auth_api.expect(forgot_password_model, validate=True)
    @auth_api.response(202, MESSAGE_202)
    @auth_api.response(404, MESSAGE_404)
    def put(self):
        """Endpoint for sending change password link email."""
        user_data = auth_api.payload
        user = User.query.filter_by(email=user_data['email']).first_or_404(description=self.MESSAGE_404)

        reset_password_token = create_access_token(identity=user.public_id, fresh=True)
        link = get_reset_password_link(reset_password_token)

        jti = get_jti(reset_password_token)
        change_password_tokens.set(str(user.public_id), jti)

        send_async_email.delay(user.email,
                               link,
                               '[PE KPI] Change Password.',
                               text_path='change_password.txt',
                               html_path='change_password.html'
                               )

        return {'msg': self.MESSAGE_202}, 202


@auth_api.route('/change-password')
class ResetPasswordResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_401 = 'Invalid token!'
    MESSAGE_200 = 'New password is ready to use!'

    @auth_api.expect(reset_password_model, validate=True)
    @auth_api.response(404, MESSAGE_404)
    @auth_api.response(401, description(MESSAGE_401, 'Token has expired', 'Fresh token required'))
    @auth_api.response(200, MESSAGE_200)
    @jwt_in_storage_required(change_password_tokens, jwt_verify_strategy=verify_fresh_jwt_in_request)
    def put(self):
        """Endpoint for setting new user password."""
        data = auth_api.payload
        public_id = get_jwt_identity()
        current_user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)

        current_user.set_password(data['password'])
        db.session.add(current_user)
        db.session.commit()

        change_password_tokens.delete(public_id)
        refresh_tokens.delete(public_id)

        access_token = data.get('access_token')

        if access_token:
            jti = get_jti(access_token)
            key = get_blacklist_key(public_id, jti)
            access_tokens_blacklist.set(key, jti)

        return {'msg': self.MESSAGE_200}, 200


@auth_api.route('/sing-out')
class SingOutResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_200 = 'Successfully logout!'

    @auth_api.response(404, MESSAGE_404)
    @auth_api.response(401, 'Token has been revoked')
    @auth_api.response(200, MESSAGE_200)
    @jwt_required
    def get(self):
        """Sign out user view."""
        jwt_token = get_raw_jwt()
        public_id, jti = jwt_token['identity'], jwt_token['jti']
        User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)

        refresh_tokens.delete(public_id)
        blacklist_key = get_blacklist_key(public_id, jti)
        access_tokens_blacklist.set(blacklist_key, jti)

        return {'msg': self.MESSAGE_200}, 200
