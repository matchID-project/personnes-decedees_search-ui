#######################
# Step 1: Base target #
#######################
FROM nginx:latest as base
ARG app_name
ARG app_ver

WORKDIR /home/nginx

COPY run.sh run.sh
COPY nginx.template /etc/nginx/nginx.template

RUN  [ -f "run.sh" ] && chmod +x run.sh

EXPOSE 80
################################
# Step 2: "development" target #
################################
FROM base as development
ARG app_name
ARG app_ver

COPY nginx-dev.template /etc/nginx/conf.d/default.template

CMD ["/home/nginx/run.sh"]
################################
# Step 2: "production" target #
################################
FROM base as production
ARG app_name
ARG app_ver
ARG NGINX_SERVER_TEMPLATE

VOLUME /var/log/nginx

COPY nginx-run.template /etc/nginx/conf.d/default.template
COPY gzip.conf /etc/nginx/gzip.conf
COPY nginx.template /etc/nginx/nginx.template
COPY dist/ /usr/share/nginx/html/

CMD ["/home/nginx/run.sh"]
