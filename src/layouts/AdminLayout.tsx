import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Activity, 
  DollarSign, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { logOut } from '../firebase';

export default function AdminLayout() {
  const location = useLocation();
  const { settings } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manajemen Armada', href: '/admin/armada', icon: Car },
    { name: 'Harga Rute', href: '/admin/rute', icon: MapPin },
    { name: 'Operasional', href: '/admin/operasional', icon: Activity },
    { name: 'Keuangan', href: '/admin/keuangan', icon: DollarSign },
    { name: 'CMS Konten', href: '/admin/cms', icon: FileText },
    { name: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
  ];

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-950">
          <span className="text-xl font-bold text-indigo-400">Admin Panel</span>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  `}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 space-y-2">
          <Link to="/" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
            <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
            Ke Web Publik
          </Link>
          <button onClick={handleLogout} className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-300 hover:bg-red-900 hover:text-white transition-colors">
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-400 group-hover:text-red-300" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm md:hidden">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">{settings.siteName} Admin</span>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
