import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { ReceiptRow } from "@/components/receipt-row";
import { DiagnosisBreakdown } from "@/components/diagnosis-breakdown";
import { liveReceipts, mockCases, formatCurrency } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
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

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="RECOVERED REVENUE"
          value="₹48,620"
          detail="+121% vs baseline"
          isPositive={true}
        />
        <MetricCard
          title="RECOVERY RATE"
          value="61.2%"
          detail="+23.4 pts baseline"
        />
        <MetricCard
          title="CONTACTS AVOIDED"
          value="37"
          detail="Bank downtime cases"
          isWarning={true}
        />
        <MetricCard
          title="COST / RECOVERY"
          value="₹79"
          detail="Voice + WhatsApp"
        />
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Hero Panel (Live Recovery Receipts) */}
        <div className="flex-1 lg:w-[65%] shrink-0 border border-border bg-surface overflow-hidden flex flex-col">
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
            {liveReceipts.map((receipt, idx) => (
              <ReceiptRow key={receipt.id + idx} event={receipt} />
            ))}
          </div>
        </div>

        {/* Right: Diagnosis Breakdown */}
        <div className="w-full lg:w-[35%] shrink-0">
          <div className="p-5 border border-border bg-surface h-full">
             <DiagnosisBreakdown />
          </div>
        </div>
      </div>

      <div className="border-l-4 border-waiting bg-waiting-bg p-5 text-sm text-text-primary">
        <div className="font-bold mb-2 tracking-[0.12em] uppercase text-[11px] text-waiting flex items-center gap-2">
          Policy Impact
        </div>
        <span className="font-mono">37 customers were not contacted because Retry identified active bank downtime.</span><br/>
        <span className="text-text-secondary mt-1 block">That is 37 unnecessary calls avoided — without sacrificing recovery.</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-end">
          <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Recent Recovery Cases</h2>
          <Link href="/cases" className="text-xs font-mono text-text-secondary hover:text-text-primary uppercase tracking-widest flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="sharp-card overflow-x-auto">
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-border bg-neutral-bg text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary min-w-[800px]">
            <div className="col-span-1">Case ID</div>
            <div className="col-span-1">Customer</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1">Root Cause</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="flex flex-col min-w-[800px]">
            {mockCases.slice(0, 3).map(c => (
              <Link 
                href={`/cases/${c.id}`} 
                key={c.id}
                className="grid grid-cols-6 gap-4 p-4 border-b border-border/50 hover:bg-neutral-bg transition-colors cursor-pointer group last:border-0 items-center"
              >
                <div className="col-span-1 font-mono text-xs font-bold text-text-primary">{c.id}</div>
                <div className="col-span-1 font-mono text-xs text-text-secondary">{c.customer?.name}</div>
                <div className="col-span-1 font-mono text-xs font-bold text-text-primary text-right">{formatCurrency(c.amount)}</div>
                <div className="col-span-1 font-mono text-[11px] text-text-secondary uppercase">{c.root_cause.replace('_', ' ')}</div>
                <div className="col-span-2 text-right flex justify-end">
                  <StatusBadge status={c.status} showDot={true} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
