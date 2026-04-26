interface VMCardProps {
  vm: {
    id: number;
    vm_name: string;
    ip_address: string;
    cpu_usage: number;
    ram_usage: number;
    disk_usage: number;
    services_status: Record<string, boolean>;
    uptime: number;
  };
}

export default function VMCard({ vm }: VMCardProps) {
  const getStatusColor = (value: number) => {
    if (value < 70) return 'bg-green-500';
    if (value < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}j ${hours}h`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{vm.vm_name}</h3>
          <p className="text-gray-400 text-sm">{vm.ip_address}</p>
        </div>
        <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-sm">
          Actif
        </div>
      </div>
      
      <div className="space-y-3">
        {/* CPU */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">CPU</span>
            <span className="text-white">{vm.cpu_usage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getStatusColor(vm.cpu_usage)}`}
              style={{ width: `${vm.cpu_usage}%` }}
            />
          </div>
        </div>
        
        {/* RAM */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">RAM</span>
            <span className="text-white">{vm.ram_usage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getStatusColor(vm.ram_usage)}`}
              style={{ width: `${vm.ram_usage}%` }}
            />
          </div>
        </div>
        
        {/* Disk */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Disque</span>
            <span className="text-white">{vm.disk_usage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getStatusColor(vm.disk_usage)}`}
              style={{ width: `${vm.disk_usage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Services */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm mb-2">Services</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(vm.services_status || {}).map(([service, active]) => (
            <div
              key={service}
              className={`px-2 py-1 rounded text-xs ${
                active
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {service}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Uptime: {formatUptime(vm.uptime)}
      </div>
    </div>
  );
}