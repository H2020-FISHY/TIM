# Ansible role for deploying docker engine
This role will install and configure docker engine into your host.

## Including into your repository
This role you can use in your project as subtree:
`git subtree add --prefix=ansible/roles/docker-engine ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/docker-engine.git master --squash`

And later you can update it to latest version with following command:
`git subtree pull --prefix=ansible/roles/docker-engine ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/docker-engine.git master --squash`


## Usage

### Prerequisite
Because `docker-engine` role preform `docker login` you must provide credentials to gitlab registry.
Role is expecting following variables:
- `docker_registry`
- `docker_registry_user`
- `docker_registry_password`


### Playbook
In your playbook you define play for `docekr_engine` role:

```yaml
- hosts: nexus
  become: yes
  pre_tasks:
    - import_tasks: "{{ ansible_dir }}/globals/vars.yml"
  roles:
    - role: docker-engine

```

In above example we import pre task for setting required variables for docker login.