from app.storage import access_tokens_blacklist


def get_blacklist_key(public_id, jti):
    return f'{public_id}_{jti}'


def check_if_token_in_blacklist(decrypted_token):
    jti, public_id = decrypted_token['jti'], decrypted_token['identity']
    key = get_blacklist_key(public_id, jti)
    return access_tokens_blacklist.exists(key)
