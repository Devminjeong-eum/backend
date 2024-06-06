FROM nginx:latest

COPY ./config/backend.conf /etc/nginx/conf.d/backend.conf
COPY ./config/frontend.conf /etc/nginx/conf.d/frontend.conf
COPY ./config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]