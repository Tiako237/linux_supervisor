resource "proxmox_vm_qemu" "vm" {
  name        = var.vm_name
  target_node = var.proxmox_node
  
  clone = var.template_name
  
  cores   = var.vm_cpu
  sockets = 1
  memory  = var.vm_memory
  
  network {
    model  = "virtio"
    bridge = var.network_bridge
  }
  
  disk {
    size    = var.vm_disk_size
    type    = "scsi"
    storage = "local-lvm"
  }
  
  os_type = "cloud-init"
  
  ipconfig0 = "ip=dhcp"
  
  # Attendre que la VM soit prête
  agent = 1
}

output "vm_ip" {
  value = proxmox_vm_qemu.vm.default_ipv4_address
}