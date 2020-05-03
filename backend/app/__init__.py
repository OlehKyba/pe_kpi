from flask import Flask, Blueprint
from redis import Redis
from .extentions import api, migrate, db, cors, jwt, mail
from .namespaces import namespaces
from utils import RedisHash


def create_app(config='app.configs.DevConfig'):
    app = Flask(__name__)
    app.config.from_object(config)
    app.redis = Redis.from_url(app.config['REDIS_URL'], decode_responses=True)
    app.refresh_tokens_storage = RedisHash('refresh_tokens_storage', app.redis)

    for i in namespaces:
        api.add_namespace(i)

    api_bp = Blueprint('api_blueprint', __name__)
    api.init_app(api_bp)

    db.init_app(app)
    cors.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(api_bp, url_prefix=app.config['API_PREFIX'])
    return app
