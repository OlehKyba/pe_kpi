from flask_restplus import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail


api = Api()
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
mail = Mail()
