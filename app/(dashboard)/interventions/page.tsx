"use client";

import { MetricCard } from "@/components/metric-card";
import { useState, useEffect } from "react";
import { RecoveryCase, Intervention, formatCurrency } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

export default function InterventionsPage() {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch('/api/demo/state', { headers: { 'x-merchant-id': '00000000-0000-0000-0000-000000000001' } })
      .then(r => r.json())
      .then(data => {
        if (data && data.cases) setCases(data.cases);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Flatten interventions and pair with case data
  const interventionsData = cases.flatMap(c => 
    (c.interventions || []).map(inv => ({
      intervention: inv,
      case: c
    }))
  );

  const filtered = interventionsData.filter(item => {
    if (statusFilter !== "all" && item.intervention.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.intervention.scheduled_for).getTime() - new Date(a.intervention.scheduled_for).getTime());

  // Metrics
  const scheduledCount = interventionsData.filter(i => i.intervention.status === 'queued').length;
  const inProgressCount = interventionsData.filter(i => i.intervention.status === 'sent' || i.intervention.status === 'delivered').length;
  const awaitingPayment = cases.filter(c => c.status === 'intervention_scheduled' || c.status === 'contacting').length;
  const recoveredValue = cases.filter(c => c.status === 'recovered').reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[#17191F]">
            Interventions
          </h1>
          <div className="text-[15px] text-[#5B6270]">
            Track every recovery action and its outcome.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">Export</button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Scheduled today"
          value={scheduledCount.toString()}
          detail="Require review"
        />
        <MetricCard
          title="In progress"
          value={inProgressCount.toString()}
          detail="Active right now"
        />
        <MetricCard
          title="Awaiting payment"
          value={awaitingPayment.toString()}
          detail="Active recovery cases"
        />
        <MetricCard
          title="Recovered value"
          value={formatCurrency(recoveredValue)}
          detail="Total from interventions"
          isPositive={true}
        />
      </div>
      
      <div className="flex gap-2 mb-[-16px]">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-border bg-neutral-bg text-xs font-mono uppercase tracking-widest outline-none focus:border-brand-primary"
          >
            <option value="all">ALL STATUSES</option>
            <option value="queued">QUEUED</option>
            <option value="sent">SENT</option>
            <option value="delivered">DELIVERED</option>
            <option value="completed">COMPLETED</option>
            <option value="failed">FAILED</option>
            <option value="skipped">SKIPPED</option>
          </select>
      </div>

      {/* Main Table */}
      <div className="sharp-card flex-1 overflow-auto flex flex-col min-h-[500px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#E6E8EC] bg-[#F7F8FA] text-[11px] font-semibold tracking-wider uppercase text-[#5B6270] min-w-[1000px]">
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2">Outcome</div>
          <div className="col-span-2 text-right">Scheduled / Started</div>
        </div>

        <div className="flex flex-col min-w-[1000px] flex-1">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
               <div className="animate-pulse">Loading interventions...</div>
             </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="text-[#17191F] font-semibold text-base mb-1">No interventions found</div>
              <div className="text-[#5B6270] text-sm max-w-md mb-6">
                Retry will show calls, secure payment links, callbacks, and policy decisions after a recovery case becomes eligible.
              </div>
              <Link href="/cases" className="btn-primary">View recovery cases</Link>
            </div>
          ) : (
            filtered.map((item, i) => (
              <Link 
                href={`/cases/${item.case.id}`}
                key={`${item.intervention.id}-${i}`}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 hover:bg-neutral-bg transition-colors cursor-pointer group last:border-0 items-center"
              >
                <div className="col-span-2 font-mono text-xs">
                  <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${
                    item.intervention.status === 'completed' ? 'bg-[#E3F5F1] text-[#0F9F6E]' :
                    item.intervention.status === 'failed' ? 'bg-[#FEE4E2] text-[#D92D20]' :
                    item.intervention.status === 'queued' ? 'bg-[#FEF0C7] text-[#B54708]' :
                    'bg-[#F2F4F7] text-[#475467]'
                  }`}>
                    {item.intervention.status}
                  </div>
                </div>
                <div className="col-span-2 font-mono text-xs uppercase tracking-wider text-text-primary">
                  {item.intervention.type.replace(/_/g, ' ')}
                </div>
                <div className="col-span-2 font-mono text-xs text-text-primary">
                  <div className="truncate">{item.case.customer?.name || "Unknown"}</div>
                  <div className="text-text-secondary mt-1 text-[10px]">{item.case.customer?.phone ? `+91 ••••• ${item.case.customer.phone.slice(-4)}` : ""}</div>
                </div>
                <div className="col-span-2 font-mono text-xs text-text-primary text-right font-bold">
                  {formatCurrency(item.case.amount)}
                </div>
                <div className="col-span-2 font-mono text-[11px] text-text-secondary truncate">
                  {item.intervention.outcome || "Pending"}
                </div>
                <div className="col-span-2 font-mono text-[10px] text-text-muted text-right uppercase" suppressHydrationWarning>
                  {new Date(item.intervention.executed_at || item.intervention.scheduled_for).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
