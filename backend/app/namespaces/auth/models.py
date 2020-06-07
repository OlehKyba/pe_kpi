from flask_restplus.fields import String

from . import auth_api

confirm_req = auth_api.model('ConfirmRequest', {
    'token': String(required=True),
})

retry_confirm_email_req = auth_api.model('RetrySendEmailRequest', {
    'email': String(pattern=r'\S+@\S+\.\S+', example='templates@domain.com', required=True),
})

sign_req = auth_api.model('SingRequest', {
    'email': String(pattern=r'\S+@\S+\.\S+', example='templates@domain.com', required=True),
    'password': String(required=True),
})

sign_in_res = auth_api.model('SignInResponse', {
    'accessToken': String(reqired=True, attribute='access_token'),
    'refreshToken': String(reqired=True, attribute='refresh_token'),
})

default_res = auth_api.model('DefaultResponse', {
    'msg': String(required=True),
})

sign_up_res = auth_api.inherit('SignUpResponse', default_res, {
    'id': String(attribute='public_id'),
})

forgot_password_req = auth_api.model('ForgotPasswordRequest', {
    'email': String(pattern=r'\S+@\S+\.\S+', example='templates@domain.com', required=True),
})

refresh_req = auth_api.model('RefreshRequest', {
    'refreshToken': String(attribute='refresh_token', required=True)
})

reset_password_req = auth_api.model('ResetPasswordRequest', {
    'password': String(required=True),
    'accessToken': String(attribute='access_token'),
})
