from flask_restplus import Resource

from app.extentions import db
from app.models import User

from . import user_api
from .models import user_model, user_password_model


@user_api.route('/<string:email>')
class AccurateUserResource(Resource):

    @user_api.marshal_with(user_model)
    def get(self, email):
        return User.query.filter_by(email=email).first_or_404(
            description=f'User with email address:"{email}", was not found.')


@user_api.route('/')
class UserResource(Resource):

    @user_api.expect(user_password_model)
    def post(self):
        new_user = user_api.payload
        user = User(**new_user)
        db.session.add(user)
        db.session.commit()

        return {'status': 'success'}, 201

    @user_api.marshal_with(user_model, envelope='data')
    def get(self):
        return User.query.all()
