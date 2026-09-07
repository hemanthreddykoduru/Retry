"use client";

import { useState, useEffect } from "react";
import { AgentMenu } from "./agent-menu";
import { useRouter, useSearchParams } from "next/navigation";

export function ViewSwitcher({ 
  initialView, 
  agentContent, 
  children 
}: { 
  initialView: 'human' | 'agent', 
  agentContent: string, 
  children: React.ReactNode 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use client state for instant toggling
  const [view, setView] = useState<'human' | 'agent'>(
    (searchParams.get('view') as 'human' | 'agent') || initialView
  );

  const handleToggle = (newView: 'human' | 'agent') => {
    setView(newView);
    // Instantly update URL without triggering a server re-render
    window.history.pushState(null, '', `/?view=${newView}`);
  };

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#0a0a0a] border border-[#2a2a2a] p-1.5 rounded-full shadow-2xl">
        <button 
          onClick={() => handleToggle('human')}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all ${view === 'human' ? 'bg-[#00ffd1]/10 text-[#00ffd1] border border-[#00ffd1]' : 'text-[#888888] hover:text-[#cccccc] border border-transparent'}`}
        >
          Human
        </button>
        <button 
          onClick={() => handleToggle('agent')}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all ${view === 'agent' ? 'bg-[#00ffd1]/10 text-[#00ffd1] border border-[#00ffd1]' : 'text-[#888888] hover:text-[#cccccc] border border-transparent'}`}
        >
          Agent
        </button>
      </div>

      {view === 'agent' ? (
        <section className="px-6 lg:px-12 pt-32 pb-20 max-w-5xl mx-auto font-mono text-sm text-text-primary leading-relaxed bg-background min-h-screen">
          <div className="relative p-8 overflow-x-auto border border-border bg-surface rounded-lg shadow-sm">
            <div className="absolute top-8 right-8">
              <AgentMenu content={agentContent} />
            </div>
            <pre className="whitespace-pre-wrap max-w-3xl mt-12">
              {agentContent}
            </pre>
          </div>
        </section>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
