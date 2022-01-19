# Appliance PoC

Deploying tasks with django frontend.

## Requirements
Deploy is verified to work with the following versions of tools:
- Vagrant: 2.2.16
- Virtualbox: 6.1.18

## Usage
1. Start vagrant virtual boxes
```bash
vagrant up
```
2. Open [192.168.55.10:8000](http://192.168.55.10:8000) and start ansible deploy

3. When deployed, open Kibana dashboard ([https://192.168.55.11:5601/](https://192.168.55.11:5601/))

username: admin
password: changeme