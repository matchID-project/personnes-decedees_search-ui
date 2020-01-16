##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

SHELL=/bin/bash

export USE_TTY := $(shell test -t 1 && USE_TTY="-t")

#search-ui
export PORT=8082

#base paths
export APP = personnes-decedees-search-ui
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

export DOCKER_USERNAME=matchid
export DC_DIR=${APP_PATH}
export DC_FILE=${DC_DIR}/docker-compose
export DC_PREFIX := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC_NETWORK := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC_BUILD_ARGS = --pull --no-cache
export DC := /usr/local/bin/docker-compose
export GIT_ORIGIN=origin
export GIT_BRANCH=master
export GIT_DATAPREP = personnes-decedees_search
export GIT_ROOT = https://github.com/matchid-project

# backup dir
export BACKUP_DIR = ${APP_PATH}/backup

# elasticsearch defaut configuration
export ES_HOST = elasticsearch
export ES_PORT = 9200
export ES_PROXY_PATH = /${APP}/api/v0/search
export ES_INDEX = deces
export ES_DATA = ${APP_PATH}/esdata
export ES_NODES = 1
export ES_MEM = 1024m
export ES_VERSION = 7.5.0
export ES_BACKUP_BASENAME := esdata
export DATAPREP_VERSION_FILE = .dataprep.sha1
export DATA_VERSION_FILE = .data.sha1
export FILES_TO_PROCESS=deces-[0-9]{4}.txt.gz

vm_max_count            := $(shell cat /etc/sysctl.conf | egrep vm.max_map_count\s*=\s*262144 && echo true)


# s3 conf
# s3 conf has to be stored in two ways :
# classic way (.aws/config and .aws/credentials) for s3 backups
# to use within matchid backend, you have to add credential as env variables and declare configuration in a s3 connector
# 	export aws_access_key_id=XXXXXXXXXXXXXXXXX
# 	export aws_secret_access_key=XXXXXXXXXXXXXXXXXXXXXXXXXXX
export S3_BUCKET=fichier-des-personnes-decedees
export AWS=${APP_PATH}/aws

dummy		    := $(shell touch artifacts)
include ./artifacts

commit              := $(shell git describe --tags || cat VERSION )
lastcommit          := $(shell touch .lastcommit && cat .lastcommit)
date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

export APP_VERSION :=  ${commit}

export FILE_FRONTEND_APP_VERSION = $(APP)-$(APP_VERSION)-frontend.tar.gz
export FILE_FRONTEND_DIST_APP_VERSION = $(APP)-$(APP_VERSION)-frontend-dist.tar.gz
export FILE_FRONTEND_DIST_LATEST_VERSION = $(APP)-latest-frontend-dist.tar.gz

export DC_BUILD_FRONTEND = ${DC_FILE}-build.yml
export DC_RUN_NGINX_FRONTEND = ${DC_FILE}.yml
export BUILD_DIR=${APP_PATH}/${APP}-build

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

install-aws-cli:
	@docker-pull matchid/tools

clean-frontend:
	@sudo rm -rf ${FRONTEND}/dist
	@sudo mkdir -p ${FRONTEND}/dist

clean-elasticsearch: elasticsearch-stop
	@sudo rm -rf ${ES_DATA} ${BACKUP_DIR} ${DATA_VERSION_FILE} ${DATAPREP_VERSION_FILE}

clean: clean-frontend clean-elasticsearch

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

build: frontend-build nginx-build

docker-push: docker-login
	docker push ${DOCKER_USERNAME}/${APP}:${APP_VERSION}

docker-login:
	@echo docker login for ${DOCKER_USERNAME}
	@echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

docker-pull:
	docker pull ${DOCKER_USERNAME}/${APP}:${APP_VERSION}

build-dir:
	if [ ! -d "$(BUILD_DIR)" ] ; then mkdir -p $(BUILD_DIR) ; fi

build-dir-clean:
	if [ -d "$(BUILD_DIR)" ] ; then rm -rf $(BUILD_DIR) ; fi

${FRONTEND}/$(FILE_FRONTEND_APP_VERSION):
	( cd ${FRONTEND} && tar -zcvf $(FILE_FRONTEND_APP_VERSION) --exclude ${APP}.tar.gz \
		.eslintrc.js \
        src \
        public )

frontend-check-build:
	${DC} -f $(DC_BUILD_FRONTEND) config -q

frontend-build-dist: ${FRONTEND}/$(FILE_FRONTEND_APP_VERSION) frontend-check-build
	@echo building ${APP} frontend in ${FRONTEND}
	${DC} -f $(DC_BUILD_FRONTEND) build $(DC_BUILD_ARGS)

$(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION): build-dir
	${DC} -f $(DC_BUILD_FRONTEND) run -T --rm frontend-build tar czf - $$(basename /$(APP)/build) -C $$(dirname /$(APP)/build) > $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION)
	  cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION)
	if [ -f $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ; fi
	if [ -f $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) ; fi

frontend-build: network frontend-build-dist $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION)

frontend-clean-dist:
	@rm -rf $(FILE_FRONTEND_APP_VERSION)

frontend-clean-dist-archive:
	@rm -rf $(FILE_FRONTEND_DIST_APP_VERSION)

nginx-check-build:
	${DC} -f $(DC_RUN_NGINX_FRONTEND) config -q

nginx-build: $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx-check-build
	@echo building ${APP} nginx
	cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx/
	${DC} -f $(DC_RUN_NGINX_FRONTEND) build $(DC_BUILD_ARGS)

frontend-stop:
	${DC} -f ${DC_FILE}.yml down

frontend:
	@echo docker-compose up ${APP} frontend
	${DC} -f ${DC_RUN_NGINX_FRONTEND} up -d

stop: frontend-stop
	@echo all components stopped

start: frontend
	@sleep 2 && docker-compose logs

backup-dir:
	@if [ ! -d "$(BACKUP_DIR)" ] ; then mkdir -p $(BACKUP_DIR) ; fi

elasticsearch-s3-pull: backup-dir ${DATAPREP_VERSION_FILE} ${DATA_VERSION_FILE}
	@\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	ESBACKUPFILE=${ES_BACKUP_BASENAME}_$${DATAPREP_VERSION}_$${DATA_VERSION}.tar;\
	if [ ! -f "${BACKUP_DIR}/$$ESBACKUPFILE" ];then\
		echo pulling s3://${S3_BUCKET}/$$ESBACKUPFILE;\
		${AWS} s3 cp s3://${S3_BUCKET}/$$ESBACKUPFILE ${BACKUP_DIR}/$$ESBACKUPFILE;\
	fi

elasticsearch-stop:
	@echo docker-compose down matchID elasticsearch
	@if [ -f "${DC_FILE}-elasticsearch-huge.yml" ]; then ${DC} -f ${DC_FILE}-elasticsearch-huge.yml down;fi

elasticsearch-restore: elasticsearch-stop elasticsearch-s3-pull
	@if [ -d "$(ES_DATA)" ] ; then (echo purging ${ES_DATA} && sudo rm -rf ${ES_DATA} && echo purge done) ; fi
	@\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	ESBACKUPFILE=${ES_BACKUP_BASENAME}_$${DATAPREP_VERSION}_$${DATA_VERSION}.tar;\
	if [ ! -f "${BACKUP_DIR}/$$ESBACKUPFILE" ];then\
		(echo no such archive "${BACKUP_DIR}/$$ESBACKUPFILE" && exit 1);\
	else\
		echo restoring from ${BACKUP_DIR}/$$ESBACKUPFILE to ${ES_DATA} && \
		sudo tar xf ${BACKUP_DIR}/$$ESBACKUPFILE -C $$(dirname ${ES_DATA}) && \
		echo backup restored;\
	fi;

vm_max:
ifeq ("$(vm_max_count)", "")
	@echo updating vm.max_map_count $(vm_max_count) to 262144
	sudo sysctl -w vm.max_map_count=262144
endif

elasticsearch: network vm_max
	@echo docker-compose up elasticsearch with ${ES_NODES} nodes
	@cat ${DC_FILE}-elasticsearch.yml | sed "s/%M/${ES_MEM}/g" > ${DC_FILE}-elasticsearch-huge.yml
	@(if [ ! -d ${ES_DATA}/node1 ]; then sudo mkdir -p ${ES_DATA}/node1 ; sudo chmod g+rw ${ES_DATA}/node1/.; sudo chgrp 1000 ${ES_DATA}/node1/.; fi)
	@(i=$(ES_NODES); while [ $${i} -gt 1 ]; \
		do \
			if [ ! -d ${ES_DATA}/node$$i ]; then (echo ${ES_DATA}/node$$i && sudo mkdir -p ${ES_DATA}/node$$i && sudo chmod g+rw ${ES_DATA}/node$$i/. && sudo chgrp 1000 ${ES_DATA}/node$$i/.); fi; \
		cat ${DC_FILE}-elasticsearch-node.yml | sed "s/%N/$$i/g;s/%MM/${ES_MEM}/g;s/%M/${ES_MEM}/g" >> ${DC_FILE}-elasticsearch-huge.yml; \
		i=`expr $$i - 1`; \
	done;\
	true)
	${DC} -f ${DC_FILE}-elasticsearch-huge.yml up -d


up: start

down: stop

restart: down up

${GIT_DATAPREP}:
	@git clone ${GIT_ROOT}/${GIT_DATAPREP}

${DATAPREP_VERSION_FILE}: ${GIT_DATAPREP}
	@cat \
		${GIT_DATAPREP}/projects/personnes-decedees_search/recipes/dataprep_personnes-dedecees_search.yml\
		${GIT_DATAPREP}/projects/personnes-decedees_search/datasets/personnes-decedees_index.yml\
	| sha1sum | awk '{print $1}' | cut -c-8 > ${DATAPREP_VERSION_FILE}

${DATA_VERSION_FILE}:
	@${AWS} s3 ls ${S3_BUCKET} | egrep '${FILES_TO_PROCESS}' |\
		awk '{print $$NF}' | sort | sha1sum | awk '{print $1}' |\
		cut -c-8 > ${DATA_VERSION_FILE}

deploy-local: elasticsearch-s3-pull elasticsearch-restore elasticsearch docker-pull up

deploy-remote:
	@if [ -z "${REMOTE_HOST}" -o -z "${aws_access_key_id}" -o -z "${aws_access_key_id}" ];\
		then echo you have to specify REMOTE_HOST aws_access_key_id and aws_access_key_id;fi
	@ssh ${REMOTE_HOST} 'if [ -d "$$(basename ${APP_PATH})" ]; then \
		echo cleaning previsous install;\
		sudo rm -rf $$(basename ${APP_PATH});fi'
	@echo remote cloning Github repo
	@ssh ${REMOTE_HOST} git clone https://github.com/matchid-project/personnes-decedees_search-ui
	@echo terraforming
	@ssh ${REMOTE_HOST} make -C $$(basename ${APP_PATH}) install-prerequisites install-aws-cli
	@echo copy s3 configuration
	@ssh ${REMOTE_HOST} mkdir -p .aws
	@scp aws_config ${REMOTE_HOST}:.aws/
	@echo -e "[default]\naws_access_key_id=${aws_access_key_id}\naws_secret_access_key=${aws_secret_access_key}\n" | ssh ${REMOTE_HOST} 'cat > .aws/credentials'
	@echo deploying
	@ssh ${REMOTE_HOST} make -C $$(basename ${APP_PATH}) deploy-local
	@echo cleaning secrets
	@ssh ${REMOTE_HOST} rm .aws/credentials
	@echo testing remote services
	@ssh ${REMOTE_HOST} '(curl -s --fail -XGET "http://localhost:${PORT}/" > /dev/null)' && echo frontend ok
	@ssh ${REMOTE_HOST} '(curl -s --fail -XPOST "http://localhost:${PORT}${ES_PROXY_PATH}/?q=*" -H "Content-Type: application/json" > /dev/null)' && echo elasticsearch ok