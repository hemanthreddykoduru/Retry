"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
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

const SidebarContent = ({ navClass }: { navClass: (path: string) => string }) => (
  <div className="flex flex-col h-full bg-surface border-r border-border">
    <div className="h-14 lg:h-16 flex items-center px-4 font-bold text-lg tracking-tight border-b border-border">
      RETRY
      <div className="ml-2 text-[10px] text-text-secondary font-normal uppercase tracking-widest">
        Revenue Recovery
      </div>
    </div>
    <div className="flex-1 py-6 flex flex-col gap-8 px-2 overflow-y-auto">
      
      {/* OPERATE */}
      <div>
        <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Operate</div>
        <div className="flex flex-col gap-1">
          <Link href="/dashboard" className={navClass("/dashboard")}>
            <LayoutDashboard size={16} /> Overview
          </Link>
          <Link href="/cases" className={navClass("/cases")}>
            <Inbox size={16} /> Recovery cases
          </Link>
          <Link href="/analytics" className={navClass("/analytics")}>
            <BarChart3 size={16} /> Analytics
          </Link>
        </div>
      </div>

      {/* DEVELOP */}
      <div>
        <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Develop</div>
        <div className="flex flex-col gap-1">
          <Link href="/demo" className={navClass("/demo")}>
            <Beaker size={16} /> Demo lab
          </Link>
          <Link href="/integration" className={navClass("/integration")}>
            <Plug size={16} /> Integration
          </Link>
        </div>
      </div>

      {/* CONTROL */}
      <div>
        <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Control</div>
        <div className="flex flex-col gap-1">
          <Link href="/settings/guardrails" className={navClass("/settings/guardrails")}>
            <ShieldAlert size={16} /> Guardrails
          </Link>
          <Link href="/settings" className={navClass("/settings")}>
            <Settings size={16} /> Settings
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-auto border-t border-border p-4 bg-background">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3">
        Demo workspace · Test mode
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold truncate">Hemanth R.</div>
        <div className="text-xs text-text-secondary truncate mb-2">NammaMart Demo Store</div>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors">
          <LogOut size={12} /> Log out
        </button>
      </div>
    </div>
  </div>
);

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    if (path === '/cases') return pathname?.startsWith('/cases');
    if (path === '/settings') return pathname === '/settings' || pathname === '/settings/team';
    return pathname === path;
  };

  const navClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-3 py-2 text-sm font-medium border-l-2 transition-colors ${
      active 
        ? 'bg-neutral-bg border-text-primary text-text-primary' 
        : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-neutral-bg/50'
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
