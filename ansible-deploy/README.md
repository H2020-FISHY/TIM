# Skeleton for ansible deployment

## Requirements

Deploy is working with following tools:
- Vagrant: 1.9.8
- Virtualbox: 5.1.26
- Ansible: 2.4.1.0

### Make targets

- `create`: create  Vargant VM
- `delete`: delete Vagrant VM
- `ssh`: ssh access to Vagrant VM
- `provision`: run Ansible skrips for deployment

### Configuration


### Environments
With environments we configure, where CI will be deployed (which VM, local, open stack...), and all parameters that are specific per environment.
Currently is defined 1 environments for deployment, local Vagrant VM (default).
The environment choices are achieved by using the 'ENVIRONMENT' command variable, either by exporting or prefixing the command:

```bash
export ENVIRONMENT=vagrant #Vagrant, default Environment

# or
ENVIRONMENT=... make ...
```

For creating your custom environments you need to:
- create directory inside `environments` directory (name of this directory represent the name of your environment)
- create `inventory` file inside your environment directory
- create `Makefile` file inside your environment directory
- create `provision-config.override.yml` file inside your environment directory

```
