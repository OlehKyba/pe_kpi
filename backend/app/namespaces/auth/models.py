from flask_restplus.fields import String

from . import auth_api


sing_model = auth_api.model('SingModel', {
    'email': String(pattern=r'\S+@\S+\.\S+', example='templates@domain.com', required=True),
    'password': String(required=True),
})

sign_in_model = auth_api.model('SignInResponse', {
    'access_token': String,
    'refresh_token': String,
})
