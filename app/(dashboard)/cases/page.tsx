"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCurrency, RecoveryCase } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import { Search, Download, FilterX, Inbox } from "lucide-react";

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [causeFilter, setCauseFilter] = useState("all");
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshState = async () => {
    const merchantId = typeof window !== 'undefined' ? localStorage.getItem('retry_merchant_id') : null;
    const res = await fetch('/api/demo/state', {
      headers: { 'x-merchant-id': merchantId || '00000000-0000-0000-0000-000000000001' }
    });
    const data = await res.json();
    setCases(data.cases);
  };

  useEffect(() => {
    const merchantId = typeof window !== 'undefined' ? localStorage.getItem('retry_merchant_id') : null;
    const headers = { 'x-merchant-id': merchantId || '00000000-0000-0000-0000-000000000001' };

    fetch('/api/demo/state', { headers }).then(r => r.json()).then(data => {
      setCases(data.cases);
      setIsLoading(false);
    });
    const interval = setInterval(() => {
      fetch('/api/demo/state', { headers }).then(r => r.json()).then(data => {
        setCases(data.cases);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredCases = cases.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (causeFilter !== "all" && c.root_cause !== causeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.id.toLowerCase().includes(q) &&
        !c.customer?.name?.toLowerCase().includes(q) &&
        !c.customer?.phone.includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCauseFilter("all");
  };

  const maskPhone = (phone: string) => {
    if (!phone) return "—";
    const last4 = phone.slice(-4);
    return `+91 98••• ${last4}`;
  };

  const formatRootCause = (rc: string) => {
    return rc.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatTrigger = (trigger: string) => {
    if (trigger === 'payment_failed_webhook') return 'Webhook';
    if (trigger === 'snippet_timeout') return 'Snippet Timeout';
    return trigger;
  };

  const getLatestIntervention = (c: RecoveryCase) => {
    if (!c.interventions || c.interventions.length === 0) return "—";
    const last = c.interventions[c.interventions.length - 1];
    return last.type.split('_').join(' ');
  };

  const getNextAction = (c: RecoveryCase) => {
    if (c.status === "recovered" || c.status === "closed_lost" || c.status === "closed_optout") return "—";
    if (c.status === "promise_logged") return "Awaiting payment";
    if (c.status === "awaiting_downtime_resolution") return "Wait for resolution";
    return "Schedule intervention";
  };

  return (
    <div className="flex flex-col h-full gap-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary uppercase">
            RECOVERY CASES
          </h1>
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary flex items-center gap-1">
              {isLoading ? <span className="inline-block w-4 h-3 bg-neutral-bg animate-pulse rounded"></span> : filteredCases.length} CASES DETECTED · {isLoading ? <span className="inline-block w-12 h-3 bg-neutral-bg animate-pulse rounded"></span> : formatCurrency(filteredCases.reduce((sum, c) => sum + c.amount, 0))} REVENUE AT RISK
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Search ID, name, or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-border bg-surface text-sm focus:outline-none w-64 rounded-none font-mono"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-border bg-surface text-sm focus:outline-none rounded-none font-mono uppercase text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="contacting">Contacting</option>
            <option value="promise_logged">Promise Logged</option>
            <option value="recovered">Recovered</option>
          </select>
          <select 
            value={causeFilter} 
            onChange={e => setCauseFilter(e.target.value)}
            className="px-3 py-1.5 border border-border bg-surface text-sm focus:outline-none rounded-none font-mono uppercase text-xs"
          >
            <option value="all">All Root Causes</option>
            <option value="bank_downtime">Bank Downtime</option>
            <option value="network_drop">Network Drop</option>
            <option value="insufficient_funds">Insufficient Funds</option>
          </select>
          {(search || statusFilter !== "all" || causeFilter !== "all") && (
            <button onClick={clearFilters} className="p-1.5 border border-transparent hover:border-border bg-surface text-text-secondary transition-colors" title="Clear filters">
              <FilterX size={16} />
            </button>
          )}
          <button className="flex items-center gap-2 px-3 py-1.5 border border-border bg-neutral-bg hover:bg-surface text-xs font-mono uppercase tracking-widest transition-colors ml-2">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="sharp-card flex-1 overflow-auto flex flex-col min-h-[500px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background/50 text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary min-w-[1000px]">
          <div className="col-span-2">Case ID / Date</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-2">Trigger / Cause</div>
          <div className="col-span-2">Latest / Next</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        <div className="flex flex-col min-w-[1000px] flex-1">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 animate-pulse items-center">
                <div className="col-span-2">
                  <div className="h-4 bg-neutral-bg rounded w-24 mb-2"></div>
                  <div className="h-3 bg-neutral-bg rounded w-16"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-4 bg-neutral-bg rounded w-32 mb-2"></div>
                  <div className="h-3 bg-neutral-bg rounded w-24"></div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <div className="h-4 bg-neutral-bg rounded w-16"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-4 bg-neutral-bg rounded w-20 mb-2"></div>
                  <div className="h-4 bg-neutral-bg rounded w-24"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-4 bg-neutral-bg rounded w-24 mb-2"></div>
                  <div className="h-3 bg-neutral-bg rounded w-20"></div>
                </div>
                <div className="col-span-3 flex justify-end">
                  <div className="h-6 bg-neutral-bg rounded w-24"></div>
                </div>
              </div>
            ))
          ) : filteredCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-text-secondary font-mono text-sm gap-2">
              <Inbox size={32} className="text-border" />
              <div>No cases match your filters.</div>
              <button onClick={clearFilters} className="text-text-primary underline">Clear filters</button>
            </div>
          ) : (
            filteredCases.map((c) => (
              <Link 
                href={`/cases/${c.id}`} 
                key={c.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 hover:bg-neutral-bg transition-colors cursor-pointer group last:border-0 items-center"
              >
                <div className="col-span-2 font-mono text-xs text-text-primary">
                  <div className="font-bold">{c.id}</div>
                  <div className="text-text-muted mt-1 text-[10px]" suppressHydrationWarning>{new Date(c.opened_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                </div>
                <div className="col-span-2 font-mono text-xs">
                  <div className="text-text-primary">{c.customer?.name || "Unknown"}</div>
                  <div className="text-text-secondary mt-1">{maskPhone(c.customer?.phone || "")}</div>
                </div>
                <div className="col-span-1 font-mono text-xs text-text-primary text-right font-bold">
                  {formatCurrency(c.amount)}
                </div>
                <div className="col-span-2 font-mono text-[11px]">
                  <div className="text-text-secondary uppercase">{formatTrigger(c.trigger_source)}</div>
                  <div className="text-text-primary mt-1">{formatRootCause(c.root_cause)}</div>
                </div>
                <div className="col-span-2 font-mono text-[11px]">
                  <div className="text-text-primary capitalize">{getLatestIntervention(c)}</div>
                  <div className="text-text-secondary mt-1 text-[10px] uppercase tracking-wider">{getNextAction(c)}</div>
                </div>
                <div className="col-span-3 text-right flex justify-end">
                  <StatusBadge status={c.status} showDot={true} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
