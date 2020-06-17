from flask_restplus import Namespace

standards_api = Namespace('standards', description='Standards CRUD operations')

from .resources import StandardsResource
