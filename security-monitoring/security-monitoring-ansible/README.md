# Security Monitoring

This project is meant for quickly setting up Wazuh instance using Ansible scripts
on top infrastructure provisioned using Vagrant.

## Requirements

 * Vagrant 2.2.14
 * Ansible 2.9.16
 
## Setting up the demo

First, checkout Wazuh's tag `v4.1.5` into the directory above the current one:

```
$ cd ..
$ git clone https://github.com/wazuh/wazuh-ansible.git
$ git checkout tags/v4.1.5
```

1. Provision Wazuh server and Wazuh agents:

```
[sre maj 12][10:31:32][ales@~/workspace/PIACERE/security-monitoring/security-monitoring-ansible]
$ make create provision

```

2. Check the running instances:

Navigate browser to: `https://192.168.33.10:5601`, login with default credentials `admin:changeme`. Navigate to `wazuh` section on the left hand-side.

You should see 2 agents registered and running with Wazuh. 