# Ansible role service discovery

## Including into your repository
This role you can use in your project as subtree:
`git subtree add --prefix=ansible/roles/service-discovery ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/service-discovery.git master --squash`

And later you can update it to latest version with following command:
`git subtree pull --prefix=ansible/roles/service-discovery ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/service-discovery.git master --squash`


## Usage


### Playbook
In your playbook you define play for `service-discovery` role:

```yaml
- hosts: infrastructure
  become: yes
  pre_tasks:
    - import_tasks: "{{ ansible_dir }}/globals/vars.yml"
    - import_role:
        name: copy_images
      vars:
        copy_registrator: True
      when: no_pull
  roles:
    - role: service-discovery
```

