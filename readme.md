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
   2. Run playbook `ansible-playbook -i ./ansible/inventory.ini ./ansible/setup-k8s.yml`
5. Log into vm
   1. Run `./scripts/load_ssh`
   2. Run `ssh root@<IP>`

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

## Functional Features

### Stories Feature

- [ ] Enable users to watch content on the home feed.
- [ ] Allow users to upload content, including photos, videos, audio, and posts.

### Discovery Feature

- [ ] Implement a **person recommendation** system to suggest connections.

### Audio Rooms

- [ ] Develop **persistent rooms** for ongoing discussions.
- [ ] Implement **ephemeral rooms** for temporary gatherings.

### Chat Functionality

- [ ] Implement a **global chat** feature for all users.
- [ ] Create a **nearby chat** feature to connect local users.
- [ ] Develop **private chat** capabilities for one-on-one conversations.
