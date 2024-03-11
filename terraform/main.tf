# make sure to source env vars first 
# source ../scripts/load_env.sh
# terraform <CMD> -var-file="staging.tfvars"

# if using bash alias, make use ips are updated

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
  name       = "terraform_key"
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

resource "digitalocean_droplet" "proxy" {
  image  = "ubuntu-23-10-x64"
  name   = "proxy"
  size   = "s-1vcpu-2gb"
  region = "nyc1"
  ssh_keys = [digitalocean_ssh_key.terraform_key.fingerprint]
}

output "proxy_ips" {
  value = digitalocean_droplet.proxy.ipv4_address
}

output "master_ip" {
  value = digitalocean_droplet.k8s_master.ipv4_address
}

output "worker_ips" {
  value = digitalocean_droplet.k8s_worker.*.ipv4_address
}
