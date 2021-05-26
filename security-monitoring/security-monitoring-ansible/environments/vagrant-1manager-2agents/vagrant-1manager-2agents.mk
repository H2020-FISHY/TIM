VAGRANT_RUN = cd $(ENV_DIR) && vagrant
SSH_PRIVATE_KEY = $(HOME)/.vagrant.d/insecure_private_key
SSH_USER = vagrant

create:
	@$(VAGRANT_RUN) up

delete:
	@$(VAGRANT_RUN) destroy -f

ssh-manager:
	@$(VAGRANT_RUN) ssh manager

ssh-agent1:
	@$(VAGRANT_RUN) ssh agent1

ssh-agent2:
	@$(VAGRANT_RUN) ssh agent2