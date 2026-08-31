"use client";

import { MetricCard } from "@/components/metric-card";
import { ReceiptRow } from "@/components/receipt-row";
import { DiagnosisBreakdown } from "@/components/diagnosis-breakdown";
import { useState, useEffect } from "react";
import { formatCurrency, metricsData, RecoveryCase, mockCases, ReceiptEvent } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(metricsData);
  const [feed, setFeed] = useState<RecoveryCase[]>([]);

  const refreshState = async () => {
    try {
      const res = await fetch('/api/demo/state');
      const data = await res.json();
      setMetrics(data.metrics);
      setFeed(data.cases.filter((c: RecoveryCase) => c.status === "recovered").slice(0, 5));
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    fetch('/api/demo/state').then(r => r.json()).then(data => {
      setMetrics(data.metrics);
      setFeed(data.cases.filter((c: RecoveryCase) => c.status === "recovered").slice(0, 5));
    }).catch(() => {});
    const interval = setInterval(() => {
      fetch('/api/demo/state').then(r => r.json()).then(data => {
        setMetrics(data.metrics);
        setFeed(data.cases.filter((c: RecoveryCase) => c.status === "recovered").slice(0, 5));
      }).catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const liveFeed = feed.length > 0 ? feed : mockCases.filter(c => c.status === "recovered").slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      {/* Page Heading */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">
          Overview
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
          Revenue recovery, measured and attributable.
        </h1>
        <div className="text-sm text-text-secondary font-mono mt-1 uppercase tracking-widest text-[10px]">
          Demo workspace · Razorpay test-mode sample
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="RECOVERED REVENUE"
          value={`₹${formatCurrency(metrics.recovered_revenue_paise)}`}
          detail={`+${metrics.recovered_revenue_trend}% vs baseline`}
          isPositive={true}
        />
        <MetricCard
          title="RECOVERY RATE"
          value={`${metrics.recovery_rate}%`}
          detail={`+${metrics.recovery_rate_trend} pts baseline`}
        />
        <MetricCard
          title="CONTACTS AVOIDED"
          value={metrics.contacts_avoided.toString()}
          detail="Bank downtime cases"
          isWarning={true}
        />
        <MetricCard
          title="COST / RECOVERY"
          value={`₹${metrics.cost_per_recovery}`}
          detail="Voice + WhatsApp"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 sharp-card flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-border bg-background/50">
            <div>
              <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Live Recovery Receipts</h2>
              <div className="text-sm text-text-muted mt-1">Every decision is attributable, bounded, and auditable.</div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-active uppercase tracking-widest bg-active-bg px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-active animate-pulse"></span>
              Live
            </div>
          </div>
          
          <div className="flex flex-col">
            {liveFeed.map((receipt, idx) => {
              const mapped = {
                id: receipt.id,
                time: "Just now",
                event: receipt.status === 'recovered' ? 'Recovered via Smart Retry' : 'Case updated',
                amount: receipt.amount,
                customer: receipt.customer_id,
                detail: receipt.failure_reason,
                state: receipt.status
              };
              return <ReceiptRow key={receipt.id + idx} event={mapped as unknown as ReceiptEvent} />;
            })}
          </div>
          
          <div className="p-4 bg-neutral-bg border-t border-border flex justify-between items-center text-xs font-mono uppercase tracking-widest text-text-secondary">
            <span>Showing latest {liveFeed.length} recoveries</span>
            <button className="hover:text-text-primary transition-colors flex items-center gap-1">View all <ArrowRight size={14}/></button>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-8">
          <DiagnosisBreakdown />
          
          <div className="sharp-card p-5 bg-waiting-bg border-waiting flex flex-col gap-3">
            <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-waiting flex items-center gap-2">
              <StatusBadge status="awaiting_downtime_resolution" showDot={true} />
              Policy Impact
            </h3>
            <p className="text-sm text-text-primary">
              <span className="font-bold">{metrics.contacts_avoided} customers</span> are currently suppressed from automated recovery workflows due to active issuer-bank downtime.
            </p>
            <p className="text-xs text-text-secondary">
              Bounded smart retries will queue automatically when APIs stabilize.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
