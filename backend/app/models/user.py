from enum import Enum
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from app.extentions import db
from utils.sa_guid import GUID


class UserStatus(Enum):

    active = 'active'
    email_is_not_verified = 'email_is_not_verified'


class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(GUID, default=uuid4, unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    status = db.Column(db.Enum(UserStatus), nullable=False, default=UserStatus.email_is_not_verified)
    name = db.Column(db.String(100), nullable=False, default="Anonymous")
    surname = db.Column(db.String(100), nullable=False, default="Anonymous")
    group = db.Column(db.String(100), nullable=False, default="Anonymous")
    club = db.Column(db.String(100), nullable=False, default="Anonymous")

    standards = db.relationship('Standard',
                                lazy='dynamic',
                                cascade='all,delete',
                                backref=db.backref('user', lazy='subquery'),
                                )

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def is_correct_password(self, password):
        return check_password_hash(self.password, password)
