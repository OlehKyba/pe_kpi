from flask_restplus import Namespace

user_api = Namespace('user', description='User CRUD operations.')

from .resources import UserResource, AccurateUserResource
