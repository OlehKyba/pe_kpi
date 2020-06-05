from flask_restplus import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from celery import Celery

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'default': 'Bearer '
    },
}

api = Api(security='Bearer Auth', authorizations=authorizations)
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
jwt._set_error_handler_callbacks(api)
mail = Mail()
celery = Celery()
