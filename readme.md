# Microservice Boilerplate

Boilerplate to setup a microservice based app

## Status

In progress.

## Build Steps

1. Build Docker base image `npm run docker:build:base`
2. Build and spin up containers `npm run docker:up`

## Deployment Steps

1. Install and configure python, terraform and ansible
2. Generate ssh keys for DO
   1. Generate ssh keys locally
3. Run scripts from project root directory
   1. Source ssh keys and env variables `source ./scripts/load_ssh.sh && source ./scripts/load_env.sh`
4. Run terraform steps
   1. cd into terraform `cd terraform`
   2. Initalize terraform `terraform init`
   3. Terraform plan and apply
      1. `terraform plan -var-file="staging.tfvars"`
      2. `terraform apply -var-file="staging.tfvars"`
5. Run ansible steps

   1. cd into ansible `cd ../ansible`
   2. Generate inventory `python generate_inventory.py`
   3. Run playbooks
      1. `ansible-playbook -i ./inventory.ini ./setup-k8s.yml`
      2. `ansible-playbook -i ./inventory.ini ./setup-proxy.yml`

6. Log into vm
   1. Run `ssh root@<IP>`
7. Install CRD definitions
   1. `kubectl apply -f https://raw.githubusercontent.com/traefik/traefik/v2.11/docs/content/reference/dynamic-configuration/kubernetes-crd-definition-v1.yml`

## Non-Functional Features

### Infrastructure and DevOps

- [ ] **Terraform** for infrastructure as code.
- [ ] **Ansible** for configuration management.
- [ ] **Docker** and **Kubernetes** for containerization.
  - [ ] Build layers for efficiency.
  - [ ] Live reload with bind mounts for development ease.
  - [ ] DokcerHub container registry for image management.
- [ ] **Kubernetes** for container orchestration.
  - [ ] **Calico** for network policies.
  - [ ] ReplicaSets for auto-scaling, rolling updates, and automatic recovery.
  - [ ] **Traefik** ingress controller for routing, rate limiting, SSL termination, and automated TLS certificate management.
- [ ] **Rabbitmq** for service to service communication and durable messaging.
- [ ] **GitHub Actions** for CI/CD pipeline.
  - [ ] Workflows for automatic Docker builds and push.
  - [ ] GitHub secrets for CI.
- [ ] Configured for **Cross-Origin Resource Sharing (CORS)**.
- [ ] **Dependabot** for dependency scanning and management.

### Observability and Monitoring

- [ ] **Loki** and **Grafana**, for logging and health checks.
- [ ] **Prometheus** for real-time alerting.

### Persistence and Caching

- [ ] **Redis** for caching.
- [ ] **MongoDB**, **CockroachDB** for distributed databases.
- [ ] **Prisma** for ORM.

### Testing and Quality of Life

- [ ] **Supertest** for HTTP assertions.
- [ ] **Vitest** for unit and integration testing.
- [ ] **Autocannon** and **Artillery** to perform load tests.
- [ ] **TypeScript** **Prettier**, and **ESLint** for high quality code.
- [ ] **GitHub Actions** for PR enforcements.
  - [ ] Github PR templates.
  - [ ] Workflows for PR enforcement.
  - [ ] Rulesets to improve merge quality.
- [ ] High commit quality with **Husky**.
- [ ] Multi-package repository with **Lerna**.
- [ ] Feature flags with **Optimizly**

### Documentation

- [ ] API documentation with **Swagger** / **OpenAPI**.

### Frontend

- [ ] **SolidJS** and **Solid Start** framework.
- [ ] **Progressive Web App (PWA)** for offline capability and installability.
- [ ] **Strapi** CMS for easy content updates.
- [ ] **Internationalization (i18n)** to support multiple languages.
- [ ] Optimized performance through code splitting, lazy loading, and asset management.

### User Management

- [ ] **OAuth** for authentication.
- [ ] **Token Service** for managing authentication tokens.
  - [ ] Administer access tokens.
  - [ ] Administer refresh tokens.
  - [ ] Validate tokens.
  - [ ] Blacklist tokens.
  - [ ] Decode and validate tokens locally for non-auth services using HTTP-only cookies.
- [ ] **User Management** features:
  - [ ] CRUD operations for user data.
  - [ ] Block users.
  - [ ] Report users.
  - [ ] Role-Based Access Control (RBAC) / scopes.
- [ ] Good web security practices (security headers, CSP, secure cookies).
