from uuid import uuid4
from datetime import datetime

from app.extentions import db
from utils.sa_guid import GUID


class Standard(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(GUID, default=uuid4, unique=True, nullable=False)
    type = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
