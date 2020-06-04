from flask_restplus.fields import String

from . import auth_api


sing_model = auth_api.model('SingModel', {
    'email': String(pattern=r'\S+@\S+\.\S+', example='templates@domain.com', required=True),
    'password': String(required=True),
})

sign_in_model = auth_api.model('SignInResponse', {
    'access_token': String(reqired=True),
    'refresh_token': String(reqired=True),
})

forgot_password_model = auth_api.model('ForgotPasswordModel', {
    'email': String(pattern=r'\S+@\S+\.\S+', example='templates@domain.com', required=True),
})

reset_password_dict = {
    'password': {'required': True},
    'access_token': {},
}

reset_password_model = auth_api.model('ResetPasswordModel', {
    'password': String(required=True),
    'access_token': String,
})
