FROM nginx:latest

# Configuration 파일 복사
COPY ./config/backend.conf /etc/nginx/conf.d/backend.conf
COPY ./config/frontend.conf /etc/nginx/conf.d/frontend.conf
COPY ./config/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]