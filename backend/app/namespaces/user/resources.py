from flask_restplus import Resource
from flask_jwt_extended import jwt_required, get_current_user
from sqlalchemy.exc import StatementError

from app.extentions import db
from app.models import User

from . import user_api
from .models import user_model, user_password_model


@user_api.route('/<string:public_id>')
class AccurateUserResource(Resource):
    MESSAGE_404 = 'User not found!'
    MESSAGE_204 = 'User deleted.'

    @user_api.response(404, MESSAGE_404)
    @user_api.marshal_with(user_model, code=200, description='User found!')
    def get(self, public_id):
        """Get an user with required public_id in an endpoint"""
        return User.query.filter_by(public_id=public_id).first_or_404(
            description='User not found!')

    @user_api.response(404, MESSAGE_404)
    @user_api.response(204, MESSAGE_204)
    def delete(self, public_id):
        """Delete an user with required public_id in an endpoint"""
        try:
            user = User.query.filter_by(public_id=public_id).first_or_404(description=self.MESSAGE_404)
        except StatementError:
            return {'message': self.MESSAGE_404}, 404
        else:
            db.session.delete(user)
            db.session.commit()
            return {}, 204


@user_api.route('/')
class UserResource(Resource):

    @user_api.expect(user_password_model)
    def post(self):
        new_user = user_api.payload
        user = User(**new_user)
        db.session.add(user)
        db.session.commit()

        return {'message': 'User successfully created.', 'public_id': str(user.public_id)}, 201

    @user_api.marshal_with(user_model)
    @jwt_required
    def get(self):
        return get_current_user()
