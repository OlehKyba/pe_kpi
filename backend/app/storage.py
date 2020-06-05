from utils import RedisHash

refresh_tokens = RedisHash('refresh_tokens_storage')
email_confirm_tokens = RedisHash('email_confirm_tokens_storage')
change_password_tokens = RedisHash('change_password_tokens_storage')
access_tokens_blacklist = RedisHash('access_tokens_blacklist')
