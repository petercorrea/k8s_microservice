# This script will dynamically generate the ansible inventory by query the DO Api

import requests
import os

# Read the DigitalOcean API token from an environment variable
api_url_base = 'https://api.digitalocean.com/v2/'
api_token = os.environ.get('TF_VAR_do_token')
if not api_token:
    raise ValueError("Please set the DIGITALOCEAN_API_TOKEN environment variable.")
headers = {'Content-Type': 'application/json',
           'Authorization': f'Bearer {api_token}'}

def get_droplets():
    api_url = f'{api_url_base}droplets'
    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        # print(response.json())
        return response.json()
    else:
        print(f"Error: Unable to fetch droplets. HTTP Status Code: {response.status_code}")
        return None

def create_inventory(droplets):
    inventory = ""
    
    # get master node
    inventory += "[masters]\n"
    for droplet in droplets['droplets']:
        droplet_name = droplet['name']
        # inventory names are obtained by looking for the terraform resource names ('k8s-master' / 'k8s-worker')
        first_10_characters = droplet_name[:10]
        # print(first_10_characters)

        # Ensure the network list is not empty before trying to access the IP
        if droplet['networks']['v4'] and first_10_characters == "k8s-master":
            # Getting public ips for easy of access
            droplet_ip = droplet['networks']['v4'][1]['ip_address']
            inventory += f"{droplet_name} ansible_host={droplet_ip} ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n"

    # get worker nodes
    inventory += "\n"
    inventory += "[workers]\n"
    for droplet in droplets['droplets']:
        droplet_name = droplet['name']
        first_10_characters = droplet_name[:10]
        # print(first_10_characters)
        
        # Ensure the network list is not empty before trying to access the IP
        if droplet['networks']['v4'] and first_10_characters == "k8s-worker":
            droplet_ip = droplet['networks']['v4'][1]['ip_address']
            inventory += f"{droplet_name} ansible_host={droplet_ip} ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n"

     # get proxy nodes
    inventory += "\n"
    inventory += "[proxies]\n"
    for droplet in droplets['droplets']:
        droplet_name = droplet['name']
        
        # Ensure the network list is not empty before trying to access the IP
        if droplet['networks']['v4'] and droplet_name == "proxy":
            droplet_ip = droplet['networks']['v4'][1]['ip_address']
            inventory += f"{droplet_name} ansible_host={droplet_ip} ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n"
    
    # set ansible interpreter
    inventory += "\n"
    inventory += f"[all:vars]\n"
    inventory += f"ansible_python_interpreter=/usr/bin/python3"

    return inventory

def save_inventory_file(inventory, filename='inventory.ini'):
    with open(filename, 'w') as f:
        f.write(inventory)

def main():
    droplets = get_droplets()

    if droplets:
        inventory = create_inventory(droplets)
        save_inventory_file(inventory)
        print(f"Inventory file 'inventory.ini' created successfully.")
    else:
        print("Failed to create inventory. No droplets were fetched.")

if __name__ == '__main__':
    main()
