from functools import wraps
from flask_jwt_extended import verify_fresh_jwt_in_request, verify_jwt_in_request, get_raw_jwt, get_jwt_identity

from app.models import User, UserStatus


def default_user_factory(public_id):
    return User.query.filter_by(public_id=public_id).first()


def jwt_in_storage_required(storage, error_code=401, error_message='Invalid token!',
                            jwt_verify_strategy=verify_fresh_jwt_in_request):
    def outer_wrapper(handler):
        @wraps(handler)
        def verify_wrapper(*args, **kwargs):
            jwt_verify_strategy()
            jwt_token = get_raw_jwt()
            jti, key = jwt_token['jti'], jwt_token['identity']

            expected_jti = storage.get(key)

            if expected_jti != jti:
                return {'msg': error_message}, error_code

            return handler(*args, **kwargs)
        return verify_wrapper
    return outer_wrapper


def active_user_required(error_code=403, error_message='User mast be active!', user_factory=default_user_factory,
                         jwt_verify_strategy=verify_jwt_in_request, inactive_callback=None, callback_args=[]):
    def outer_wrapper(handler):
        @wraps(handler)
        def verify_active_user(*args, **kwargs):
            jwt_verify_strategy()
            public_id = get_jwt_identity()
            user = user_factory(public_id)

            if user.status == UserStatus.active:
                return handler(*args, **kwargs)

            if inactive_callback:
                args = [user.email] + callback_args
                inactive_callback(*args)

            return {'msg': error_message}, error_code
        return verify_active_user
    return outer_wrapper
