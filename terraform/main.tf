# make sure to source env vars first 
# source load_env.sh
# terraform apply -var-file="staging.tfvars"

terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "2.34.1"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_ssh_key" "terraform_key" {
  name       = "terraform SSH Key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "digitalocean_droplet" "k8s_master" {
  image  = "ubuntu-23-10-x64"
  name   = "k8s-master"
  size   = "s-2vcpu-2gb"
  region = "nyc1"
  ssh_keys = [digitalocean_ssh_key.terraform_key.fingerprint]
}

resource "digitalocean_droplet" "k8s_worker" {
  count = 2
  image  = "ubuntu-23-10-x64"
  name = format("k8s-worker-%02d", count.index + 1)
  size   = "s-1vcpu-2gb"
  region = "nyc1"
  ssh_keys = [digitalocean_ssh_key.terraform_key.fingerprint]
}

# resource "digitalocean_droplet" "traefik" {
#   image  = "ubuntu-23-10-x64"
#   name   = "traefik"
#   size   = "s-1vcpu-2gb"
#   region = "nyc1"
#   ssh_keys = [digitalocean_ssh_key.terraform_key.fingerprint]
# }

output "master_ip" {
  value = digitalocean_droplet.k8s_master.ipv4_address
}

output "worker_ips" {
  value = digitalocean_droplet.k8s_worker.*.ipv4_address
}
