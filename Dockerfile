#######################
# Step 1: Base target #
#######################
FROM node:alpine as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG NPM_GIT
ARG NPM_FIX
ARG NPM_LATEST
ARG NPM_VERBOSE
ARG app_path
ARG app_name
ARG app_ver
ENV APP ${APP}
ENV APP_VERSION ${app_ver}

WORKDIR /$app_path

# update debian w/proxy & mirror then installs git in case of git dependencies
RUN if [ ! -z "${NPM_GIT}" ]; then \
      echo "$http_proxy $no_proxy"; \
      (set -x && [ -z "$MIRROR_DEBIAN" ] || sed -i.orig -e "s|http://deb.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian9|g ; s|http://security.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian9-security|g" /etc/apt/sources.list) ; \
      apt-get update; \
      buildDeps="git"; \
      apt-get install -qy --no-install-recommends $buildDeps ; \
      git config --global url."https://".insteadOf git:// ; \
   fi

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set https-proxy $https_proxy ; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "${npm_registry}" ] || npm config set registry=$npm_registry; \
   [ -z "${sass_registry}" ] || npm config set sass_binary_site=$sass_registry;

RUN [ -z "${NPM_LATEST}" ] || npm i npm@latest -g

COPY package.json ./
RUN npm --no-git-tag-version version ${APP_VERSION}
RUN if [ -z "${NPM_VERBOSE}" ]; then\
      npm install;  \
    else \
      npm install --verbose; \
    fi

RUN if [ -z "${NPM_FIX}" ]; then \
      npm audit --registry=https://registry.npmjs.org; \
    else \
      npm audit fix --registry=https://registry.npmjs.org; \
    fi

################################
# Step 2: "development" target #
################################
FROM base as development
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ENV PORT ${PORT}
ENV ES_PROXY_PATH ${ES_PATH}

VOLUME /$app_path/src
VOLUME /$app_path/public

EXPOSE ${PORT}

CMD ["npm", "run", "start"]

################################
# Step 3:   "build" target     #
################################
FROM base as build
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ENV APP ${app_name}
ENV APP_VERSION ${app_ver}

# VOLUME /$app_path/build

COPY ${APP}-${APP_VERSION}-frontend.tar.gz .

RUN  set -ex ; tar -zxvf ${APP}-${APP_VERSION}-frontend.tar.gz  && \
     npm run build 2>&1 | tee npm.log; egrep -E '(ERROR|error)' npm.log && exit 1 ; rm -f npm.log \
     rm -rf ${app_name}-${app_ver}-frontend.tar.gz

CMD ["npm", "run", "build"]

