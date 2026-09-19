"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Beaker, 
  Plug, 
  ShieldAlert, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const SidebarContent = ({ navClass }: { navClass: (path: string) => string }) => {
  const [userName, setUserName] = useState('');
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('retry_user_name');
      const storedBusiness = localStorage.getItem('retry_business_name');
      if (storedName) setUserName(storedName);
      if (storedBusiness) setBusinessName(storedBusiness);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] border-r border-[#E6E8EC]">
      <div className="h-16 flex items-center px-6 font-bold text-lg tracking-tight border-b border-[#E6E8EC] text-[#17191F]">
        Retry
      </div>
      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        
        <Link href="/dashboard" className={navClass("/dashboard")} prefetch={true}>
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link href="/cases" className={navClass("/cases")} prefetch={true}>
          <Inbox size={18} /> Recovery cases
        </Link>
        <Link href="/interventions" className={navClass("/interventions")} prefetch={true}>
          <ShieldAlert size={18} /> Interventions
        </Link>
        <Link href="/customers" className={navClass("/customers")} prefetch={true}>
          <Beaker size={18} /> Customers
        </Link>
        <Link href="/analytics" className={navClass("/analytics")} prefetch={true}>
          <BarChart3 size={18} /> Analytics
        </Link>
        <Link href="/integration" className={navClass("/integration")} prefetch={true}>
          <Plug size={18} /> Integrations
        </Link>
        <Link href="/settings" className={navClass("/settings")} prefetch={true}>
          <Settings size={18} /> Settings
        </Link>

      </div>

      <div className="mt-auto border-t border-[#E6E8EC] p-4 bg-[#FFFFFF]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#EEEFFF] text-[#635BFF] flex items-center justify-center font-bold text-sm">
            {businessName ? businessName.charAt(0) : 'W'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="text-sm font-medium text-[#17191F] truncate">{businessName || 'Workspace'}</div>
            <div className="text-xs text-[#5B6270] truncate">{userName || 'Merchant'}</div>
          </div>
        </div>
        <button onClick={async () => {
          localStorage.removeItem('retry_business_name');
          localStorage.removeItem('retry_user_name');
          localStorage.removeItem('retry_user_email');
          localStorage.removeItem('retry_merchant_id');
          const { insforge } = await import('@/lib/insforge');
          await insforge.auth.signOut();
          window.location.href = '/login';
        }} className="mt-4 flex w-full items-center gap-2 text-xs font-medium text-[#5B6270] hover:text-[#17191F] transition-colors px-2 py-1.5 rounded-md hover:bg-[#F2F4F7]">
          <LogOut size={14} /> Log out
        </button>
      </div>
    </div>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    if (path === '/cases') return pathname?.startsWith('/cases');
    if (path === '/interventions') return pathname?.startsWith('/interventions');
    if (path === '/customers') return pathname?.startsWith('/customers');
    if (path === '/integration') return pathname?.startsWith('/integration');
    if (path === '/settings') return pathname?.startsWith('/settings');
    return pathname === path;
  };

  const navClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
      active 
        ? 'bg-[#EEEFFF] text-[#635BFF]' 
        : 'text-[#5B6270] hover:text-[#17191F] hover:bg-[#F2F4F7]'
    }`;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-text-primary text-surface rounded-full shadow-lg border border-border"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={toggleSidebar}>
          <div className="w-[240px] h-full" onClick={(e) => e.stopPropagation()}>
            <SidebarContent navClass={navClass} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-[220px] shrink-0 h-full hidden md:flex flex-col">
        <SidebarContent navClass={navClass} />
      </aside>
    </>
  );
}
