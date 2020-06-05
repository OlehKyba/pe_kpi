from flask_restplus import fields

from app.extentions import api


user_model = api.model('UserModel', {
    'public_id': fields.String,
    'templates': fields.String,
})

user_password_model = api.model('UserWithPassword', {
    'templates': fields.String,
    'password': fields.String,
})
