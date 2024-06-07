FROM redis:alpine

COPY ./config/redis.conf /usr/local/conf/redis.conf

CMD ["redis-server", "/usr/local/conf/redis.conf"]