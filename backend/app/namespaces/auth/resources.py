from flask import current_app
from flask_restplus import Resource
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    jwt_refresh_token_required,
    fresh_jwt_required,
    create_refresh_token,
    get_raw_jwt,
    get_jti,
)

from . import auth_api
from .models import sing_model, sign_in_model, forgot_password_model, reset_password_model
from .async_tasks import send_async_email
from .blacklist_helpers import get_blacklist_key

from app.extentions import db, api
from app.storage import refresh_tokens, email_confirm_tokens, change_password_tokens, access_tokens_blacklist
from app.models import User, UserStatus


# TODO: Wrapper for getting jri from storage and it validation.


@auth_api.route('/confirm-email')
class ConfirmEmailResource(Resource):
    MESSAGE_404 = 'User not found!'
    MESSAGE_401 = 'Invalid token!'

    @fresh_jwt_required
    def get(self):
        jwt_token = get_raw_jwt()
        jti, public_id = jwt_token['jti'], jwt_token['identity']

        expected_jti = email_confirm_tokens.get(public_id)

        if expected_jti != jti:
            return {'message': self.MESSAGE_401}, 401

        current_user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)
        current_user.status = UserStatus.active
        db.session.commit()

        email_confirm_tokens.delete(public_id)

        return {'message': 'The email was successfully verified.'}, 200


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
            return {'message': self.MESSAGE_409}, 409

        user = User(**new_user)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        email_token = create_access_token(identity=user.public_id, fresh=True)
        query_key = current_app.config['JWT_QUERY_STRING_NAME']
        link = f'{api.url_for(ConfirmEmailResource, _external=True)}?{query_key}={email_token}'

        email_token_jti = get_jti(email_token)
        email_confirm_tokens.set(str(user.public_id), email_token_jti)

        send_async_email.delay(user.email,
                               link,
                               '[PE KPI] Confirm email.',
                               text_path='email_confirm.txt',
                               html_path='email_confirm.html'
                               )

        return {'message': self.MESSAGE_201, 'public_id': str(user.public_id)}, 201


@auth_api.route('/sing-in')
class SingInResource(Resource):
    MESSAGE_404 = 'User not found!'
    MESSAGE_401 = 'Incorrect password!'
    MESSAGE_200 = 'OK!'

    @auth_api.expect(sing_model, validate=True)
    @auth_api.response(404, MESSAGE_404)
    @auth_api.response(401, MESSAGE_401)
    @auth_api.response(200, MESSAGE_200, model=sign_in_model)
    def post(self):
        """User Sign in view"""
        user_data = auth_api.payload
        current_user = User.query.filter_by(email=user_data['email']).first_or_404(description=self.MESSAGE_404)

        if not current_user.is_correct_password(user_data['password']):
            return {'message': self.MESSAGE_401}, 401

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
    @auth_api.response(401, MESSAGE_401)
    @auth_api.response(404, MESSAGE_404)
    @jwt_refresh_token_required
    def post(self):
        """Endpoint for refreshing access tokens."""
        jwt_token = get_raw_jwt()
        public_id, jti = jwt_token['identity'],  jwt_token['jti']
        current_user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)

        expected_jti = refresh_tokens.get(public_id)

        if expected_jti != jti:
            return {'message': self.MESSAGE_401}, 401

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
        user_data = auth_api.payload
        user = User.query.filter_by(email=user_data['email']).first_or_404(description=self.MESSAGE_404)

        reset_password_token = create_access_token(identity=user.public_id, fresh=True)
        domain = current_app.config['FRONTEND_DOMAIN']
        link = f'{domain}/change-password/{reset_password_token}'

        jti = get_jti(reset_password_token)
        change_password_tokens.set(str(user.public_id), jti)

        send_async_email.delay(user.email,
                               link,
                               '[PE KPI] Change Password.',
                               text_path='change_password.txt',
                               html_path='change_password.html'
                               )

        return {'message': self.MESSAGE_202}, 202


@auth_api.route('/change-password')
class ResetPasswordResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_401 = 'Invalid token!'
    MESSAGE_200 = 'New password is ready to use!'

    @auth_api.expect(reset_password_model, validate=True)
    @auth_api.response(404, MESSAGE_404)
    @auth_api.response(401, MESSAGE_401)
    @auth_api.response(200, MESSAGE_200)
    @fresh_jwt_required
    def put(self):

        data = auth_api.payload
        jwt_token = get_raw_jwt()
        public_id, jti = jwt_token['identity'], jwt_token['jti']

        current_user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)

        expected_jti = change_password_tokens.get(public_id)

        if expected_jti != jti:
            return {'message': self.MESSAGE_401}, 401

        current_user.set_password(data['password'])
        db.session.add(current_user)
        db.session.commit()

        change_password_tokens.delete(public_id)
        refresh_tokens.delete(public_id)

        access_token = data.get('access_token')

        if access_token:
            key = get_blacklist_key(public_id, jti)
            access_tokens_blacklist.set(key, jti)

        return {'message': self.MESSAGE_200}, 200


@auth_api.route('/sing-out')
class SingOutResource(Resource):

    MESSAGE_404 = 'User not found!'
    MESSAGE_200 = 'Successfully logout!'

    @jwt_required
    def get(self):
        jwt_token = get_raw_jwt()
        public_id, jti = jwt_token['identity'], jwt_token['jti']
        User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)

        refresh_tokens.delete(public_id)
        blacklist_key = get_blacklist_key(public_id, jti)
        access_tokens_blacklist.set(blacklist_key, jti)

        return {'message': self.MESSAGE_200}, 200
