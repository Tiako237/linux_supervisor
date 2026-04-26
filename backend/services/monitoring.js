const { NodeSSH } = require('node-ssh');
const Monitoring = require('../models/Monitoring');
const Alert = require('../models/Alert');

class MonitoringService {
  constructor() {
    this.ssh = new NodeSSH();
    this.checkInterval = 60000; // 1 minute
  }
  
  async startMonitoring(vmList) {
    setInterval(() => {
      vmList.forEach(vm => this.checkVM(vm));
    }, this.checkInterval);
  }
  
  async checkVM(vm) {
    try {
      await this.ssh.connect({
        host: vm.ip_address,
        username: 'root',
        privateKey: process.env.SSH_PRIVATE_KEY_PATH
      });
      
      // Récupérer CPU usage
      const cpuResult = await this.ssh.execCommand(
        "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1"
      );
      const cpuUsage = parseFloat(cpuResult.stdout);
      
      // Récupérer RAM usage
      const ramResult = await this.ssh.execCommand(
        "free | grep Mem | awk '{print ($3/$2) * 100.0}'"
      );
      const ramUsage = parseFloat(ramResult.stdout);
      
      // Récupérer Disk usage
      const diskResult = await this.ssh.execCommand(
        "df -h / | tail -1 | awk '{print $5}' | cut -d'%' -f1"
      );
      const diskUsage = parseFloat(diskResult.stdout);
      
      // Vérifier les services
      const servicesStatus = await this.checkServices(vm.service_name);
      
      // Sauvegarder les métriques
      await Monitoring.create({
        vm_id: vm.id,
        cpu_usage: cpuUsage,
        ram_usage: ramUsage,
        disk_usage: diskUsage,
        services_status: servicesStatus,
        uptime: await this.getUptime(),
        last_check: new Date()
      });
      
      // Générer des alertes si nécessaire
      await this.generateAlerts(vm.id, { cpuUsage, ramUsage, diskUsage, servicesStatus });
      
      this.ssh.dispose();
    } catch (error) {
      console.error(`Erreur monitoring VM ${vm.vm_name}:`, error);
      await Alert.create({
        vm_id: vm.id,
        severity: 'critical',
        source: 'monitoring',
        message: `Impossible de se connecter à ${vm.vm_name}: ${error.message}`
      });
    }
  }
  
  async checkServices(serviceName) {
    const services = serviceName.split(',');
    const status = {};
    
    for (const service of services) {
      const result = await this.ssh.execCommand(`systemctl is-active ${service}`);
      status[service] = result.stdout.trim() === 'active';
    }
    
    return status;
  }
  
  async getUptime() {
    const result = await this.ssh.execCommand("cat /proc/uptime | awk '{print $1}'");
    return parseInt(result.stdout);
  }
  
  async generateAlerts(vmId, metrics) {
    // Alerte CPU
    if (metrics.cpuUsage > 90) {
      await Alert.create({
        vm_id: vmId,
        severity: 'critical',
        source: 'CPU',
        message: `CPU usage critical: ${metrics.cpuUsage}%`
      });
    }
    
    // Alerte RAM
    if (metrics.ramUsage > 90) {
      await Alert.create({
        vm_id: vmId,
        severity: 'critical',
        source: 'RAM',
        message: `RAM usage critical: ${metrics.ramUsage}%`
      });
    }
    
    // Alerte services
    for (const [service, active] of Object.entries(metrics.servicesStatus)) {
      if (!active) {
        await Alert.create({
          vm_id: vmId,
          severity: 'critical',
          source: 'Service',
          message: `Service ${service} is down`
        });
      }
    }
  }
}

module.exports = new MonitoringService();