from flask_restplus import Resource

from app.extentions import api, db
from app.models import User

from .user_model import user_model, user_password_model


@api.route('/users/<string:email>')
class AccurateUserResource(Resource):

    @api.marshal_with(user_model)
    def get(self, email):
        return User.query.filter_by(email=email).first_or_404(
            description=f'User with email address:"{email}", was not found.')


@api.route('/users/')
class UserResource(Resource):

    @api.expect(user_password_model)
    def post(self):
        new_user = api.payload
        user = User(**new_user)
        db.session.add(user)
        db.session.commit()

        return {'status': 'success'}, 201

    @api.marshal_with(user_model, envelope='data')
    def get(self):
        return User.query.all()
