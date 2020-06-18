from flask_restplus import Resource
from flask_jwt_extended import jwt_required, get_current_user

from . import user_api
from .models import user_model
from .parsers import update_user_parser

from app.extentions import db


update_parser = update_user_parser()


@user_api.route('/')
class UserResource(Resource):

    MESSAGE_404 = 'User not found'

    @user_api.response(200, 'OK')
    @user_api.response(404, MESSAGE_404)
    @user_api.marshal_with(user_model)
    @jwt_required
    def get(self):
        """Get user information"""
        return get_current_user()

    @user_api.expect(update_parser)
    @user_api.response(404, MESSAGE_404)
    @user_api.response(204, 'User update successfully')
    @jwt_required
    def put(self):
        """Update user information"""
        current_user = get_current_user()
        user_data = update_parser.parse_args()

        for key in user_data:
            value = user_data[key]
            if value:
                setattr(current_user, key, value)

        db.session.commit()
        return {}, 204

    @user_api.response(404, MESSAGE_404)
    @user_api.response(204, 'User delete successfully')
    @jwt_required
    def delete(self):
        """Delete user"""
        user = get_current_user()
        db.session.delete(user)
        db.session.commit()
        return {}, 204
