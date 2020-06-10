from flask_restplus import fields

from app.extentions import api


user_model = api.model('UserModel', {
    'public_id': fields.String,
    'email': fields.String,
})

user_password_model = api.model('UserWithPassword', {
    'templates': fields.String,
    'password': fields.String,
})
