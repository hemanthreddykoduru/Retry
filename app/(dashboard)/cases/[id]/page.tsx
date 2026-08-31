import Link from "next/link";
import { formatCurrency, liveReceipts } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = liveReceipts.find(r => r.id === id) || liveReceipts[0];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-12">
      <Link href="/cases" className="text-sm font-mono text-text-secondary hover:text-text-primary mb-4 inline-block">
        ← BACK TO CASES
      </Link>

      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
            Case Details
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-3">
            {id.toUpperCase()}
            <StatusBadge status={receipt.state} />
          </h1>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
            Amount at risk
          </div>
          <div className="text-2xl font-mono tracking-tight text-text-primary">
            {receipt.amount > 0 ? formatCurrency(receipt.amount) : "₹1,499"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="sharp-card p-5">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            Customer Profile
          </div>
          <div className="flex flex-col gap-3 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Phone</span>
              <span>+91 98••• 1207</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Location</span>
              <span>Bengaluru, KA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Lifetime Value</span>
              <span>₹12,450 (8 orders)</span>
            </div>
          </div>
        </div>

        <div className="sharp-card p-5">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            Diagnosis
          </div>
          <div className="flex flex-col gap-3 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Root Cause</span>
              <span className="text-lost">{receipt.detail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">System Confidence</span>
              <span className="text-recovered">98.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Action Selected</span>
              <span>{receipt.event}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mt-6">Audit Timeline</h2>
      <div className="sharp-card flex flex-col">
        <div className="p-4 border-b border-border hover:bg-neutral-bg transition-colors">
          <div className="flex justify-between mb-2">
            <div className="font-mono text-xs text-text-primary">10:42:18 IST</div>
            <div className="font-mono text-xs text-text-muted">payment.failed</div>
          </div>
          <div className="text-sm">Webhook received from Razorpay: Error code <code>BAD_REQUEST_ERROR</code>.</div>
        </div>
        <div className="p-4 border-b border-border bg-waiting-bg hover:bg-waiting-bg/80 transition-colors">
          <div className="flex justify-between mb-2">
            <div className="font-mono text-xs text-text-primary">10:42:19 IST</div>
            <div className="font-mono text-xs text-waiting font-bold uppercase tracking-wider">Guardrail Checked</div>
          </div>
          <div className="text-sm">Detected active downtime for issuer bank (HDFC). Action suppressed to avoid customer frustration.</div>
        </div>
        <div className="p-4 border-b border-border hover:bg-neutral-bg transition-colors">
          <div className="flex justify-between mb-2">
            <div className="font-mono text-xs text-text-primary">10:57:04 IST</div>
            <div className="font-mono text-xs text-text-muted">downtime.resolved</div>
          </div>
          <div className="text-sm">Bank downtime resolved. Scheduled smart retry for 11:05 IST based on historical success rates.</div>
        </div>
        <div className="p-4 bg-recovered-bg hover:bg-recovered-bg/80 transition-colors">
          <div className="flex justify-between mb-2">
            <div className="font-mono text-xs text-text-primary">11:06:11 IST</div>
            <div className="font-mono text-xs text-recovered font-bold uppercase tracking-wider">payment.captured</div>
          </div>
          <div className="text-sm">Payment successfully captured in the background. Revenue recovered without human contact.</div>
        </div>
      </div>
    </div>
  );
}
