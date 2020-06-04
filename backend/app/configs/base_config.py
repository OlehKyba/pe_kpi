import os


class BaseConfig:
    API_PREFIX = '/api'
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or 'postgresql+psycopg2://kpi_user:fiot_the_best@localhost/pe_kpi'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_TOKEN_LOCATION = ['headers', 'query_string']
    JWT_QUERY_STRING_NAME = 'token'
    JWT_BLACKLIST_ENABLED = True

    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIl_USE_TLS = False
    MAIL_USE_SSL = True
    BROKER_URL = os.environ.get('CELERY_BROKER_URL') or 'redis://localhost:6379/0'
