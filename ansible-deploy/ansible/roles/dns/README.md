# Ansible role dns
With this role you can configure dns-server and dns-agent on your host machine.


## Including into your repository
This role you can use in your project as subtree:
`git subtree add --prefix=ansible/roles/dns ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/dns.git master --squash`

And later you can update it to latest version with following command:
`git subtree pull --prefix=ansible/roles/dns ssh://git@gitlab.xlab.si:13022/x-collection/deployment/ansible-roles/dns.git master --squash`


## Usage



### Playbook
In your playbook you define play for `dns` role:

```yaml
- hosts: dns-server
  become: yes
  pre_tasks:
    - import_tasks: "{{ ansible_dir }}/globals/vars.yml"
  roles:
    - role: dns
      consul_server: True
  post_tasks:
    - name: wait for consul server to start up
      shell: docker logs consul-server
      register: result
      until: result.stdout.find("Consul agent running!") != -1
      retries: 20
      delay: 5

- hosts: dns-agent
  become: yes
  pre_tasks:
    - import_tasks: "{{ ansible_dir }}/globals/vars.yml"
  roles:
    - role: dns
      consul_agent: True
```


