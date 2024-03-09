# Microservice Boilerplate

Boilerplate to setup a microservice based app

## Build Steps

1. Build Docker base image `npm run docker:build:base`
2. Build and spin up containers `npm run docker:up`

## Deployment Steps

1. Generate ssh keys
2. Install and configure terraform and ansible
3. Run terraform steps
   1. Initalize terraform `terraform init`
   2. Source env variables `source ../scripts/load_env.sh`
   3. Terraform plan and apply `terraform <CMD> -var-file="staging.tfvars"`
4. Run ansible steps
   1. Generate inventory `python3 generate_inventory.py`
   2. Run playbook `ansible-playbook setup-k8s.yml`
5. Log into vm
   1. Run `./scripts/load_ssh`
   2. Run `ssh root@<IP>`
