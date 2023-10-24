DOCKER_REGISTRY ?= registry-gitlab.xlab.si/fishy/appliance-poc
BUILD_ARGS = 

ifdef NPMRC_CONTENT
BUILD_ARGS := ${BUILD_ARGS} --build-arg NPMRC_CONTENT="${NPMRC_CONTENT}"
endif

SERVICE = $(shell grep SERVICE MANIFEST | cut -d '=' -f2)
VERSION = $(shell grep VERSION MANIFEST | cut -d '=' -f2)

build:
	docker build -t ${SERVICE}:${VERSION} ${BUILD_ARGS} .

push:
	docker tag ${SERVICE}:${VERSION} ${DOCKER_REGISTRY}/${SERVICE}:${VERSION}
	docker tag ${SERVICE}:${VERSION} ${DOCKER_REGISTRY}/${SERVICE}:latest
	docker push ${DOCKER_REGISTRY}/${SERVICE}:${VERSION}
	docker push ${DOCKER_REGISTRY}/${SERVICE}:latest
