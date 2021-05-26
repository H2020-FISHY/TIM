ENVIRONMENT ?= vagrant-1manager-2agents
DEPLOY_DIR = $(PWD)
ENV_DIR = $(DEPLOY_DIR)/environments/$(ENVIRONMENT)
ANSIBLE_DIR = $(DEPLOY_DIR)/ansible
include $(ENV_DIR)/$(ENVIRONMENT).mk

ANSIBLE_ARGS = -i $(ENV_DIR)/inventory.txt \
							 -e ansible_dir=$(ANSIBLE_DIR) \
							 -e environment_dir=$(ENV_DIR)
							 
reprovision:
	@ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook $(ANSIBLE_ARGS)  $(ANSIBLE_DIR)/provision-reset.yml

provision-managers:
	@ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook $(ANSIBLE_ARGS) $(ANSIBLE_DIR)/provision-managers.yml

provision-agents:
	@ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook $(ANSIBLE_ARGS) $(ANSIBLE_DIR)/provision-agents.yml

provision:
	@ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook $(ANSIBLE_ARGS) $(ANSIBLE_DIR)/provision.yml