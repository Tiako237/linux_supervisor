variable "proxmox_api_url" {
  description = "Proxmox API URL"
  type        = string
}

variable "proxmox_token_id" {
  description = "Proxmox API Token ID"
  type        = string
}

variable "proxmox_token_secret" {
  description = "Proxmox API Token Secret"
  type        = string
  sensitive   = true
}

variable "proxmox_node" {
  description = "Proxmox node name"
  type        = string
  default     = "pve"
}

variable "template_name" {
  description = "Template VM name"
  type        = string
  default     = "ubuntu-22.04-template"
}

variable "vm_name" {
  description = "VM name"
  type        = string
}

variable "vm_cpu" {
  description = "CPU cores"
  type        = number
  default     = 2
}

variable "vm_memory" {
  description = "RAM in MB"
  type        = number
  default     = 2048
}

variable "vm_disk_size" {
  description = "Disk size"
  type        = string
  default     = "20G"
}

variable "network_bridge" {
  description = "Network bridge"
  type        = string
  default     = "vmbr0"
}