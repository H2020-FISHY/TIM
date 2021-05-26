# Security Monitoring

This project is meant for quickly setting up Wazuh instance using Ansible scripts
on top infrastructure provisioned using Vagrant.

## Requirements

 * Vagrant 2.2.14
 * Ansible 2.9.16
 * (optional / integrations) `npm` / `npx` in order to run the simple HTTP server for the integrations
 
## Setting up the demo

First, checkout Wazuh's tag `v4.1.5` into the current directory:

```
$ git clone https://github.com/wazuh/wazuh-ansible.git
$ git checkout tags/v4.1.5
```

1. Provision Wazuh server and Wazuh agents:

```
$ cd security-monitoring-ansible
$ make create provision
```

2. Check the running instances:

Navigate browser to: `https://192.168.33.10:5601`, login with default credentials `admin:changeme`. Navigate to `wazuh` section on the left hand-side.

You should see 2 agents registered and running with Wazuh. 

3. Run HTTP Simple server using `npx` 

```
$ PORT=8088 npx http-echo-server
```
## Potential issues
 
### Vagrant issue:

```
The following SSH command responded with a non-zero exit status.
Vagrant assumes that this means the command failed!

umount /mnt
Stdout from the command:

Stderr from the command:
umount: /mnt: not mounted.

```
Solved:
```
$ vagrant plugin uninstall vagrant-vbguest
```
 
### Ansible failing due to ssh issues.

This is important for `manager` and `agents` - VMs need to be running already.

```
[sre maj 12][10:33:33][ales@~/workspace/PIACERE/security-monitoring/wazuh-ansible]
$ ssh vagrant@192.168.33.10 -i ../inventory-server/.vagrant/machines/default/virtualbox/private_key
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:tq9iDMmDjQP9igfVLfIO/R7hKfyzbzfXT/F+KkTcn54.
Please contact your system administrator.
Add correct host key in /home/ales/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /home/ales/.ssh/known_hosts:336
  remove with:
  ssh-keygen -f "/home/ales/.ssh/known_hosts" -R "192.168.33.10"
ECDSA host key for 192.168.33.10 has changed and you have requested strict checking.
Host key verification failed.
[sre maj 12][10:35:34][ales@~/workspace/PIACERE/security-monitoring/wazuh-ansible]
```

Solution:
```
ssh-keygen -f "/home/ales/.ssh/known_hosts" -R "192.168.33.10"
ssh-keygen -f "/home/ales/.ssh/known_hosts" -R "192.168.33.11"
ssh-keygen -f "/home/ales/.ssh/known_hosts" -R "192.168.33.12"
ssh-keyscan -H 192.168.33.10 >> /home/ales/.ssh/known_hosts
ssh-keyscan -H 192.168.33.11 >> /home/ales/.ssh/known_hosts
ssh-keyscan -H 192.168.33.12 >> /home/ales/.ssh/known_hosts
```