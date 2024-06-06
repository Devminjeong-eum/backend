FROM redis:alpine

COPY ./config/redis.conf /usr/local/conf/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/conf/redis.conf"]