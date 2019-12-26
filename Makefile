##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

SHELL=/bin/bash
#search-ui
export PORT=8082

#matchID base paths
export APP = matchid
export APP_PATH := $(shell pwd)
export FRONTEND := ${APP_PATH}
export NGINX = ${APP_PATH}/nginx

export DC_DIR=${APP_PATH}
export DC_FILE=${DC_DIR}/docker-compose
export DC_PREFIX := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC_NETWORK := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC := /usr/local/bin/docker-compose
export GIT_ORIGIN=origin
export GIT_BRANCH=dev

# elasticsearch defaut configuration
export ES_PATH = /${APP}/api/v0
export ES_INDEX = deces

dummy		    := $(shell touch artifacts)
include ./artifacts

commit              := $(shell git rev-parse HEAD | cut -c1-8)
lastcommit          := $(shell touch .lastcommit && cat .lastcommit)
commit-frontend     := $(shell (cd ${FRONTEND} 2> /dev/null) && git rev-parse HEAD | cut -c1-8)
lastcommit-frontend := $(shell (cat ${FRONTEND}/.lastcommit 2>&1) )
date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

APP_VERSION := commit

include /etc/os-release

install-prerequisites:
ifeq ("$(wildcard /usr/bin/envsubst)","")
	sudo apt-get update; true
	sudo apt install -y gettext; true
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
	sudo rm -rf ${FRONTEND}/dist

network-stop:
	docker network rm ${DC_NETWORK}

network: install-prerequisites
	@docker network create ${DC_NETWORK_OPT} ${DC_NETWORK} 2> /dev/null; true

frontend-update:
	@cd ${FRONTEND}; git pull ${GIT_ORIGIN} ${GIT_BRANCH}

update: frontend-update

frontend-dev:
ifneq "$(commit-frontend)" "$(lastcommit-frontend)"
	@echo docker-compose up ${APP} search-ui frontend for dev after new commit
	env
	${DC} -f ${DC_FILE}-dev-frontend.yml up --build -d
	@echo "${commit-frontend}" > ${FRONTEND}/.lastcommit
else
	@echo docker-compose up matchID frontend for dev
	${DC} -f  ${DC_FILE}-dev-frontend.yml up -d
endif

frontend-dev-stop:
	${DC} -f ${DC_FILE}-dev-frontend.yml down

dev: network frontend-stop frontend-dev

dev-stop: frontend-dev-stop newtork-stop

frontend-build: network frontend-download
ifneq "$(commit-frontend)" "$(lastcommit-frontend)"
	@echo building ${APP} search-ui frontend after new commit
	@make clean
	@sudo mkdir -p ${FRONTEND}/dist
	${DC} -f ${DC_FILE}-build-frontend.yml up --build
	@echo "${commit-frontend}" > ${FRONTEND}/.lastcommit
endif

frontend-stop:
	${DC} -f ${DC_FILE}.yml down

frontend: frontend-build
	@echo docker-compose up matchID frontend
	${DC} -f ${DC_FILE}.yml up -d

stop: frontend-stop
	@echo all components stopped

start: frontend-build frontend-stop frontend
	@sleep 2 && docker-compose logs

up: start

down: stop

restart: down up

