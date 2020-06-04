from flask import Flask, Blueprint, has_app_context
from redis import Redis, BlockingConnectionPool
from .extentions import api, migrate, db, cors, jwt, mail, celery
from .namespaces import namespaces
from .storage import refresh_tokens, email_confirm_tokens, change_password_tokens, access_tokens_blacklist


def create_app(config='app.configs.DevConfig', redis=None):
    app = Flask(__name__)
    app.config.from_object(config)

    for i in namespaces:
        api.add_namespace(i)

    api_bp = Blueprint('api_blueprint', __name__)
    api.init_app(api_bp)
    db.init_app(app)
    cors.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    init_celery(app)

    redis = redis or Redis(connection_pool=BlockingConnectionPool.from_url(app.config['REDIS_URL'],
                                                                           decode_responses=True),)
    refresh_tokens.init_app(redis, ttl=app.config['JWT_REFRESH_TOKEN_EXPIRES'])
    email_confirm_tokens.init_app(redis, ttl=app.config['JWT_ACCESS_TOKEN_EXPIRES'])
    change_password_tokens.init_app(redis, ttl=app.config['JWT_ACCESS_TOKEN_EXPIRES'])
    access_tokens_blacklist.init_app(redis, ttl=app.config['JWT_ACCESS_TOKEN_EXPIRES'])

    app.register_blueprint(api_bp, url_prefix=app.config['API_PREFIX'])
    return app


def init_celery(app=None):
    app = app or create_app()

    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):

        def __call__(self, *args, **kwargs):
            if has_app_context():
                return TaskBase.__call__(self, *args, **kwargs)

            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery
