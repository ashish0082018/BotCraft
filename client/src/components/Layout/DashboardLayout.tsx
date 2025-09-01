import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, CreditCard, Settings, Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/generate', icon: Bot, label: 'Generate Bot' },
    { path: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    // Is container mein pt-16 navbar ke liye jagah banata hai
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 pt-16">
      
      {/* CHANGE 1: Is flex container ko screen ki bachi hui height di gayi hai */}
      <div className="flex h-[calc(100vh-4rem)]">
        
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar */}
        {/* CHANGE 2: Sidebar ki position aur height classes ko theek kiya gaya hai */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-md border-r border-blue-500/20 transform transition-transform duration-300 ease-in-out lg:h-full ${
          showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 h-full overflow-y-auto">
            {/* Mobile close button */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/10'
                    }`}
                    onClick={() => setShowSidebar(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {/* Mobile header with menu button */}
          <div className="lg:hidden p-4 border-b border-blue-500/20 sticky top-0 bg-gray-900/50 backdrop-blur-md z-10">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}