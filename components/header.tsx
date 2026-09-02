"use client";
import { useState, useEffect } from 'react';

export function Header() {
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('retry_business_name');
      if (name) {
        setBusinessName(name);
      }
    }
  }, []);

  return (
    <header className="h-14 lg:h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="font-bold tracking-tight md:hidden">RETRY</span>
        <span className="text-xs font-mono text-text-muted hidden md:inline-block">/ Revenue Recovery</span>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="font-medium text-text-primary">{businessName}</div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-recovered"></span>
          <span>All systems operational</span>
        </div>
      </div>
    </header>
  );
}
