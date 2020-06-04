from flask_restplus import Namespace

auth_api = Namespace('auth', description='Logic for authorization, registration.')

from .resources import (
    SingUpResource,
    SingInResource,
    ConfirmEmailResource,
    ForgotPasswordResource,
    ResetPasswordResource,
)
