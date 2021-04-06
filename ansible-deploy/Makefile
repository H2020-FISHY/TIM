-include ../../../../x-collection/tools/release-scripts/src/MakefileQA
-include ../release-scripts/src/MakefileQA

ENVIRONMENT ?= vagrant
DEPLOY_DIR = $(PWD)
ENV_DIR = $(DEPLOY_DIR)/environments/$(ENVIRONMENT)
INVENTORY_FILE= $(ENV_DIR)/inventory
ANSIBLE_DIR = $(DEPLOY_DIR)/ansible
ANSIBLE_ENV = ANSIBLE_ROLES_PATH=$(ANSIBLE_DIR)/roles

include $(ENV_DIR)/Makefile

ANSIBLE_ARGS_PART_1 = -i $(INVENTORY_FILE) \
							 --private-key=$(SSH_PRIVATE_KEY) \
							 -e ansible_dir=$(ANSIBLE_DIR) \
							 -e environment_dir=$(ENV_DIR) \
							 -u $(SSH_USER)

ifndef DOCKER_REGISTRY_USER
ANSIBLE_ARGS_FINAL= ${ANSIBLE_ARGS_PART_1}
else
ANSIBLE_ARGS_FINAL= ${ANSIBLE_ARGS_PART_1} \
               -e docker_registry_user=$(DOCKER_REGISTRY_USER) \
							 -e docker_registry_password=$(DOCKER_REGISTRY_PASSWORD)
endif

PROVISION_TARGETS=$(notdir $(basename $(wildcard $(ANSIBLE_DIR)/books/provision*.yml)))
$(PROVISION_TARGETS):
	@ANSIBLE_HOST_KEY_CHECKING=False $(ANSIBLE_ENV) ansible-playbook $(ANSIBLE_ARGS_FINAL) $(ANSIBLE_DIR)/books/$@.yml
