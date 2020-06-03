

class RedisHash:

    def __init__(self, hash_name=None, redis_client=None, ttl=None):
        self.name = hash_name
        self._name_template = self.name + '_{}'
        self.init_app(redis_client, ttl)

    def init_app(self, redis_client, ttl):
        self._redis_client = redis_client
        self.ttl = ttl

    def get(self, key):
        name = self._name_template.format(key)
        return self._redis_client.get(name)

    def set(self, key, value, ttl=None):
        ttl = ttl or self.ttl
        name = self._name_template.format(key)
        return self._redis_client.set(name, value, ex=ttl)

    def delete(self, key):
        name = self._name_template.format(key)
        return self._redis_client.delete(name)

