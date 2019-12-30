##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

SHELL=/bin/bash
#search-ui
export PORT=8082

#base paths
export APP = search-ui
export APP_PATH := $(shell pwd)
export FRONTEND := ${APP_PATH}
export FRONTEND_DEV_HOST = frontend-development
export FRONTEND_DEV_PORT = ${PORT}
export NGINX = ${APP_PATH}/nginx
export API_USER_LIMIT_RATE=1r/s
export API_USER_BURST=20 nodelay
export API_USER_SCOPE=http_x_forwarded_for
export API_GLOBAL_LIMIT_RATE=20r/s
export API_GLOBAL_BURST=200 nodelay

export DC_DIR=${APP_PATH}
export DC_FILE=${DC_DIR}/docker-compose
export DC_PREFIX := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC_NETWORK := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC := /usr/local/bin/docker-compose
export GIT_ORIGIN=origin
export GIT_BRANCH=dev

# elasticsearch defaut configuration
export ES_HOST = elasticsearch
export ES_PORT = 9200
export ES_PROXY_PATH = /${APP}/api/v0/search
export ES_INDEX = deces

dummy		    := $(shell touch artifacts)
include ./artifacts

commit              := $(shell git describe --tags || cat VERSION )
lastcommit          := $(shell touch .lastcommit && cat .lastcommit)
date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

export APP_VERSION :=  ${commit}

include /etc/os-release


install-prerequisites:
ifeq ("$(wildcard /usr/bin/envsubst)","")
	sudo apt-get update || true
	sudo apt install -y gettext || true
endif

ifeq ("$(wildcard /usr/bin/docker)","")
	echo install docker-ce, still to be tested
	sudo apt-get update
	sudo apt-get install \
    	apt-transport-https \
	ca-certificates \
	curl \
	software-properties-common

	curl -fsSL https://download.docker.com/linux/${ID}/gpg | sudo apt-key add -
	sudo add-apt-repository \
		"deb https://download.docker.com/linux/ubuntu \
		`lsb_release -cs` \
   		stable"
	sudo apt-get update
	sudo apt-get install -y docker-ce
endif
	@(if (id -Gn ${USER} | grep -vc docker); then sudo usermod -aG docker ${USER}; fi) > /dev/null
ifeq ("$(wildcard /usr/local/bin/docker-compose)","")
	@echo installing docker-compose
	@sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	@sudo chmod +x /usr/local/bin/docker-compose
endif

clean:
	@sudo rm -rf ${FRONTEND}/dist
	@sudo mkdir -p ${FRONTEND}/dist

network-stop:
	docker network rm ${DC_NETWORK}

network: install-prerequisites
	@docker network create ${DC_NETWORK_OPT} ${DC_NETWORK} 2> /dev/null; true

frontend-update:
	@cd ${FRONTEND}; git pull ${GIT_ORIGIN} ${GIT_BRANCH}

update: frontend-update

frontend-dev:
ifneq "$(commit)" "$(lastcommit)"
	@echo docker-compose up ${APP} frontend for dev after new commit ${APP_VERSION}
	${DC} -f ${DC_FILE}-dev.yml up --build -d
	@echo "${commit}" > ${FRONTEND}/.lastcommit
else
	@echo docker-compose up ${APP} frontend for dev
	${DC} -f  ${DC_FILE}-dev.yml up -d
endif

frontend-dev-stop:
	${DC} -f ${DC_FILE}-dev.yml down

dev: network frontend-stop frontend-dev

dev-stop: frontend-dev-stop

build: frontend-build

frontend-build: network
ifneq "$(commit)" "$(lastcommit)"
	@echo building ${APP} search-ui frontend after new commit ${APP_VERSION}
	@make clean
	@sudo mkdir -p ${NGINX}/dist
	${DC} -f ${DC_FILE}-build.yml build --no-cache
	${DC} -f ${DC_FILE}-build.yml up
	@sudo rsync -avz --delete ${FRONTEND}/dist/. ${NGINX}/dist/.
	@echo "${commit}" > ${FRONTEND}/.lastcommit
endif

frontend-stop:
	${DC} -f ${DC_FILE}.yml down

frontend: frontend-build
	@echo docker-compose up ${APP} frontend
	${DC} -f ${DC_FILE}.yml up -d

stop: frontend-stop
	@echo all components stopped

start: frontend-build frontend-stop frontend
	@sleep 2 && docker-compose logs

up: start

down: stop

restart: down up

