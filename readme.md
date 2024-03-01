# Production Node.js Server

Boilerplate to setup a micro-service based app

## Architecture Road Map

List of things to implement along the way

Infra

- digital ocean droplets
- terraform
- ansible
- kubernetes
  - calico
  - auto scaling
  - traefik ingress
    - ssl termination
    - Automate the management and issuance of TLS certificates

Services

- nodejs
  - fastify
  - typescript
  - nodemon
  - RBAC
  - OAuth, JWT, refresh tokens, cors
  - husky
- postgres + prisma
- redis
- infisical for secrets mgmt
- cms
- i18z

Communication

- rabbitmq

CI/CD

- containerizer with docker
- container registry
- github actions
- blue green deploymens
- staging and prod environments

Testing

- supertest
- jest
- benchmarking w/ locust

Observability & Monitoring

- traefik dashboard
- rabbitmq dashboard
- ELK + Prometheus and Grafana

Documentation

- swagger

## Implementation Schedule

### Phase 1: Infrastructure Setup

#### Objectives

- Set up the foundational cloud infrastructure on DigitalOcean using Terraform.
- Configure Kubernetes cluster with Ansible for automation.

#### Tasks

1. **Terraform**: Write Terraform scripts to provision DigitalOcean droplets, network configurations, and any other initial infrastructure components needed.
2. **Ansible**: Create Ansible playbooks to install Docker, Kubernetes, and set up the Kubernetes cluster on provisioned droplets.
3. **Cluster Networking**: Deploy Calico for Kubernetes networking.

### Phase 2: Application Development Setup

#### Objectives

- Scaffold the Fastify application.
- Set up local development environments and repositories.

#### Tasks

1. **Fastify Application**: Initialize a new Node.js project with Fastify for the API server.
2. **Supabase Integration**: Configure Prisma for interacting with Supabase/PostgreSQL.
3. **Authentication**: Implement JWT and OAuth mechanisms in Fastify for secure authentication.
4. **Redis Setup**: Integrate Redis for caching within the application.

### Phase 3: Microservices and Communication

#### Objectives

- Design and implement microservices architecture.
- Set up RabbitMQ for inter-service communication.

#### Tasks

1. **RabbitMQ**: Deploy RabbitMQ on Kubernetes for asynchronous messaging between services.
2. **Service Design**: Identify and define the boundaries of your microservices, focusing on separation of concerns.

### Phase 4: CI/CD Pipeline and Deployment

#### Objectives

- Establish CI/CD workflows with GitHub Actions.
- Implement blue-green deployment strategy.

#### Tasks

1. **Dockerization**: Containerize the Fastify application and any other microservices for deployment.
2. **Version Control**
3. **Container Registry**
4. **GitHub Actions**: Create workflows for automated testing, building, and deploying the application.
5. **Blue-Green Deployments**: Configure Kubernetes deployments and services to support blue-green deployments for minimal downtime.
6. **Kubernetes Config**: ConfigMaps and Secrets, and Ingress

### Phase 5: Observability, Monitoring, and Testing

#### Objectives

- Set up monitoring and logging tools.
- Integrate Locust for load testing.

#### Tasks

1. **Traefik Ingress**: Deploy Traefik as the Ingress controller with SSL termination.
2. **Monitoring and Logging**: Integrate ELK stack with Prometheus and Grafana for comprehensive monitoring and logging.
3. **Performance Testing**: Write Locust scripts to test the application under load, focusing on key functionalities.

### Phase 6: Iteration and Optimization

#### Objectives

- Analyze performance testing results.
- Optimize application performance based on insights.

#### Tasks

1. **Performance Analysis**: Review Locust test results to identify bottlenecks.
2. **Application Optimization**: Refine application code, database queries, and infrastructure setup to address any performance issues.
3. **Security and RBAC**: Ensure that the application's security measures are robust, including implementing Role-Based Access Control (RBAC) as planned.

### Phase 7: Final Testing and Deployment

#### Objectives

- Conduct final tests in the staging environment.
- Deploy the application to production.

#### Tasks

1. **Staging Tests**: Run comprehensive tests in the staging environment, including performance and security assessments.
2. **Production Deployment**: Use the blue-green strategy to deploy the optimized application to production.
3. **User Acceptance Testing (UAT)**: Perform UAT to ensure the application meets all requirements and expectations.

#### Future Optimizations

Configure the anisble control agent to be internal to the network, and update the dynamic inventory script.

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
