const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const Deployment = require('../models/Deployment');

class TerraformService {
  constructor() {
    this.terraformDir = path.join(__dirname, '../../terraform');
  }
  
  async deploy(deploymentId, config) {
    try {
      await Deployment.update(
        { status: 'running' },
        { where: { id: deploymentId } }
      );
      
      // Générer les fichiers Terraform
      await this.generateTerraformFiles(config);
      
      // Exécuter terraform init
      await this.runCommand('terraform init');
      
      // Exécuter terraform apply
      const output = await this.runCommand('terraform apply -auto-approve');
      
      await Deployment.update(
        { 
          status: 'success',
          deployment_logs: output,
          terraform_state: await fs.readFile(path.join(this.terraformDir, 'terraform.tfstate'), 'utf-8')
        },
        { where: { id: deploymentId } }
      );
    } catch (error) {
      await Deployment.update(
        { 
          status: 'failed',
          deployment_logs: error.message
        },
        { where: { id: deploymentId } }
      );
      throw error;
    }
  }
  
  async generateTerraformFiles(config) {
    const { vm_name, service_type, zone, specs } = config;
    
    const mainTf = `
terraform {
  required_providers {
    proxmox = {
      source = "telmate/proxmox"
      version = "2.9.14"
    }
  }
}

provider "proxmox" {
  pm_api_url = var.proxmox_api_url
  pm_api_token_id = var.proxmox_token_id
  pm_api_token_secret = var.proxmox_token_secret
  pm_tls_insecure = true
}

resource "proxmox_vm_qemu" "${vm_name}" {
  name = "${vm_name}"
  target_node = var.proxmox_node
  
  clone = var.template_name
  
  cores = ${specs.cpu || 2}
  memory = ${specs.ram || 2048}
  
  network {
    model = "virtio"
    bridge = "${zone === 'DMZ' ? 'vmbr1' : 'vmbr0'}"
  }
  
  disk {
    size = "${specs.disk || 20}G"
    type = "scsi"
    storage = "local-lvm"
  }
}
`;
    
    await fs.writeFile(path.join(this.terraformDir, 'main.tf'), mainTf);
  }
  
  runCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.terraformDir }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

module.exports = new TerraformService();