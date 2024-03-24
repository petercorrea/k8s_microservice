# Microservice Boilerplate

Boilerplate to setup a microservice based app

## Status

In progress.

## Build Steps

1. Build Docker base image `npm run docker:build:base`
2. Build and spin up containers `npm run docker:up`

## Deployment Steps

1. Install and configure python, terraform and ansible
2. Generate DO tokens and add to .env:
   1. terraform
   2. k8s CSI driver
3. Generate ssh key pair w/ passphrase for DO
4. Run source script
   1. `source ./scripts/source.sh`
5. Run terraform steps
   1. cd into and initalize terraform `cd terraform && terraform init`
   2. Run terraform plan and apply
      1. `terraform plan -var-file="staging.tfvars"`
      2. `terraform apply -var-file="staging.tfvars"`
6. Run ansible steps
   1. cd into ansible and generate inventory `cd ../ansible && python generate_inventory.py`
   2. Update DNS to point to proxy
   3. Update `proxy/dynamic_conf.yaml` to point to worker nodes
   4. Update `network-policies.yaml` manifests to point to proxy
   5. Login into vms and add ssh public keys to local `known_hosts` file
   6. Run playbooks locally
      1. `ansible-playbook -i ./inventory.ini ./setup-k8s.yml`
      2. `ansible-playbook -i ./inventory.ini ./setup-proxy.yml`
      3. `ansible-playbook -i ./inventory.ini ./copy-files.yml`
7. Open Dashboards
   1. Traefik Ingress Controller dashboard
      1. `kubectl port-forward svc/traefik 9000:8080`
      2. `ssh -L 9000:localhost:9000 root@ip`
      3. `http://localhost:9000/dashboard/`
   2. Grafana dashboard
      1. `kubectl port-forward svc/grafana 3100:3000`
      2. `ssh -L 3100:localhost:3100 root@ip`
      3. `http://localhost:3100/dashboard/`
      4. Setup Loki Data Connection
         1. `http://loki:3100`
   3. Proxy Traefrik dashboard
      1. `http://<domain>:8080/dashboard/#/`
8. Login into master node and apply manifests

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
