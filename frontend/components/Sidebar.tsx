'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  Server, 
  AlertTriangle,
  Settings,
  LogOut 
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/monitoring', icon: Activity, label: 'Supervision' },
  { href: '/deployments', icon: Server, label: 'Déploiements' },
  { href: '/alerts', icon: AlertTriangle, label: 'Alertes' },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="text-2xl font-bold text-white mb-8">
        LinuxSupervisor
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-gray-700 mt-auto w-full"
      >
        <LogOut size={20} />
        Déconnexion
      </button>
    </aside>
  );
}