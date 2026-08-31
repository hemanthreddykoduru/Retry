import { MetricCard } from "@/components/metric-card";
import { ReceiptRow } from "@/components/receipt-row";
import { DiagnosisBreakdown } from "@/components/diagnosis-breakdown";
import { liveReceipts } from "@/lib/demo-data";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
      {/* Page Heading */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          Overview
        </div>
        <h1 className="text-2xl lg:text-[28px] font-bold tracking-tight text-text-primary">
          Revenue recovery, measured and attributable.
        </h1>
        <div className="text-sm text-text-secondary font-mono mt-1">
          Aug 24–31, 2026 · Last event received 12 seconds ago
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
        <div className="flex-1 lg:w-[65%] shrink-0 border border-border bg-surface rounded-lg overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-border bg-background/50">
            <div>
              <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Live Recovery Receipts</h2>
              <div className="text-sm text-text-muted mt-1">Every decision is attributable, bounded, and auditable.</div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-active">
              <span className="w-1.5 h-1.5 rounded-full bg-active animate-pulse"></span>
              LIVE
            </div>
          </div>
          
          <div className="flex flex-col py-2">
            {liveReceipts.map((receipt, idx) => (
              <div key={receipt.id}>
                <ReceiptRow event={receipt} />
                {/* Add divider after specific logical groups based on the design mockup */}
                {(idx === 3 || idx === 7) && (
                  <div className="h-px bg-border my-2 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Diagnosis Breakdown */}
        <div className="w-full lg:w-[35%] shrink-0">
          <div className="p-4 border border-border bg-surface rounded-lg">
             <DiagnosisBreakdown />
          </div>
        </div>
      </div>

      {/* Insight Strip */}
      <div className="border-l-4 border-waiting bg-waiting-bg p-4 rounded-r-lg text-sm text-text-primary">
        <div className="font-medium mb-1 tracking-[0.12em] uppercase text-[11px] text-waiting">Policy Impact</div>
        37 customers were not contacted because Retry identified active bank downtime.<br/>
        That is 37 unnecessary calls avoided — without sacrificing recovery.
      </div>
    </div>
  );
}
