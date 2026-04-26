'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import VMCard from '@/components/VMCard';
import { monitoringAPI } from '@/lib/api';

export default function MonitoringPage() {
  const [vms, setVMs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVMs();
    const interval = setInterval(loadVMs, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadVMs = async () => {
    try {
      const { data } = await monitoringAPI.getVMs();
      setVMs(data);
    } catch (error) {
      console.error('Error loading VMs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Supervision des VMs
        </h1>
        
        {loading ? (
          <div className="text-white">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vms.map((vm: any) => (
              <VMCard key={vm.id} vm={vm} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}