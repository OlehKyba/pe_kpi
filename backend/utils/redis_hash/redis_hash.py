

class RedisHash:

    def __init__(self, hash_name, redis_client):
        self.name = hash_name
        self._redis_client = redis_client

    def get(self, key):
        return self._redis_client.hget(self.name, key)

    def set(self, key, value):
        return self._redis_client.hset(self.name, key, value)

    def clean(self):
        with self._redis_client.pipeline() as pipe:
            for key in self._redis_client.scan_iter(self.name):
                pipe.hdel(key)
            pipe.execute()

