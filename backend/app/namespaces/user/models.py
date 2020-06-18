from flask_restplus.fields import String

from app.extentions import api


user_model = api.model('UserModel', {
    'id': String(attribute='public_id'),
    'email': String,
    'name': String,
    'surname': String,
    'club': String,
    'group': String,
})

