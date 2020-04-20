from flask_restplus import fields

from app.extentions import api


user_model = api.model('UserModel', {
    'name': fields.String,
    'surname': fields.String,
    'patronymic': fields.String,
    'email': fields.String,
})

user_password_model = api.inherit('UserWithPassword', user_model, {
    'password': fields.String
})
