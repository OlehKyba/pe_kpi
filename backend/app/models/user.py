from enum import Enum
from uuid import uuid4
from app.extentions import db
from utils.sa_guid import GUID


class UserStatus(Enum):

    active = 'active'
    email_is_not_verified = 'email_is_not_verified'


class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(GUID, default=uuid4, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    status = db.Column(db.Enum(UserStatus), nullable=False, default=UserStatus.email_is_not_verified)
