import os
from .base_config import BaseConfig


class TestConfig(BaseConfig):
    SECRET_KEY = 'tests'
    REDIS_URL = os.environ.get('REDIS_URL') or "redis://127.0.0.1:6379/1"
    TESTING = True
