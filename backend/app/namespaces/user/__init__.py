from flask_restplus import Namespace

user_api = Namespace('users', description='User CRUD operations.')

from .resources import UserResource
