# Microservice Boilerplate

Boilerplate to setup a microservice based app

## Architecture Road Map / Feature Requirements

List of things to implement along the way

### Infra

- configured to deploy on digital ocean droplets
- provisioning with terraform
- configuring with ansible
- container orchestration with kubernetes
  - calico for network policies
  - auto scaling
  - traefik ingress controller
    - rate limiting
    - ssl termination
    - automate the management and issuance of TLS certificates

### CI/CD

- containerized with docker
  - build layers
  - live reload w/ mounts
- container registry
- github actions
- blue green deployments
- staging and prod environments

### Communication

- rabbitmq

### Microservices

- nodejs runtime
  - performance
    - fastify server framework
      - json schema based serialization, runtime type validations, stream support
      - underpressure
    - http2
    - clustering
  - security
    - cors
    - rate limiting
    - OAuth
    - JWT
      - issue tokens w/ expirations
      - validate tokens
      - blacklist token/revoke token
      - refresh tokens
      - decode and validate tokens localy for non-auth services
      - httponly cookies
      - scopes
      - RBAC
  - best practices & ergonomics
    - husky, prettier, eslint
    - typescript + tsx
    - healthchecks
    - avoid NODE_ENV
    - run as non-root user
- postgres + prisma / mongo + mongoose
- redis
- infisical for secrets mgmt
  - rotate secrets without disruptions
- cms
- i18z

### Testing

- supertest
- vitest
- load benchmarking w/ autocannon & artillery

### Observability & Monitoring

- traefik dashboard
- rabbitmq dashboard
- Loki and Grafana

### Documentation

- swagger
- openAPI

## Helper Scripts & Commands

### Terraform & Ansible

```bash
./scripts/load_ssh.sh
source ./scripts/load_env.sh
cd ./terraform
terraform apply -var-file="staging.tfvars"
cd ../ansible
python3 generate_inventory.py
# will fail on pkg installs but run fine without check
ansible-playbook -i ./ansible/inventory.ini ./ansible/setup-k8s.yml --check
ansible-playbook -i ./ansible/inventory.ini ./ansible/setup-k8s.yml
```

### Self Signing Certs

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

### Installing Loki Docker Driver Plugin

```
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
```
