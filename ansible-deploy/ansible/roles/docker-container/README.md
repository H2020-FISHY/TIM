# Ansible role for deploying docker containers
This role will pull and run your docker images.


## Including into your repository
This role you can use in your project as subtree:
`git subtree add --prefix=ansible/roles/docker-container ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/docker-container.git master --squash`

And later you can update it to latest version with following command:
`git subtree pull --prefix=ansible/roles/docker-container ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/docker-container.git master --squash`


## Usage
Docker service you can run as:
- `docker`: docker container
- `swarm`: swarm service
- `service`: systemd service


### Playbook
In your playbook you define play for `docker-container` role:

```yaml
- hosts: nexus
  become: yes
  pre_tasks:
    - import_tasks: "{{ ansible_dir }}/globals/vars.yml"
  roles:
    - role: docker-container
      service_name: proxy
      service_type: 'docker'
      service_configs:
        - path: /config.cfg
      service_ports:
        - "80:80"
        - "443:443"
        - "8888:8888"
      service_image: "{{ images.proxy }}:{{ versions.proxy }}"
```

In above example we import pre task for setting optional variables:
- `main_dns`
- `network`

#### Service configs
Service configs objects can have following parameters:
- `path`
- `src_path`
- `dst_path`
- `mount_mode`: In case of containers you can specify mounting mode, default: `ro`
- `permissions`: Permissions under which files are copied on host, default: `0644`
- `type`: In case of k8s deployment can specify if you want transfer files as `scerte` or `configmap`

As goes for paths they are a little bit more complicated. For deploying configs there are three different locations used.
0. Location of file on provisioning machine
0. Location of file on host machine before is mounted to the container or generated secret
0. Location of file inside the container

For each location, actual path of the file depends on the user configuration.
Therefore we have multiple possibilities among which is used first one that match.
##### 1. Location of file on provisioning machine
 - {{ ansible_dir }}/../config/{{ config.src_path }}
 - {{ ansible_dir }}/../config/{{ service_name + config.path }}
##### 2. Location of file on host machine before is mounted to the container or generated secret
- {{ service_config_dir }}/{{ service_name_altered }}/{{ config.dst_path  }}"
- {{ service_config_dir }}/{{ service_name_altered }}/{{ config.path }}
#####  3. Location of file inside the container
- {{ config.dst_path  }}"
- {{ config.path }}
