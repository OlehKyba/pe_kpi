from flask import Flask, Blueprint
from .extentions import api, migrate, db, cors
from .resources import UserResource, AccurateUserResource


def create_app(config='app.configs.DevConfig'):
    app = Flask(__name__)
    app.config.from_object(config)

    api_bp = Blueprint('api_blueprint', __name__)

    api.init_app(api_bp)
    db.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(api_bp, url_prefix=app.config['API_PREFIX'])
    return app
