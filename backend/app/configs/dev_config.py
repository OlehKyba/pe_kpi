import os
from .base_config import BaseConfig


class DevConfig(BaseConfig):
    SECRET_KEY = 'tests'
    MAIL_USERNAME = 'physical.education.kpi@gmail.com'
    MAIL_PASSWORD = 'fiot_the_best'
    MAIL_DEFAULT_SENDER = 'physical.education.kpi@gmail.com'
    FRONTEND_DOMAIN = 'http://localhost:3000'
