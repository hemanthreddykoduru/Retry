import Link from "next/link";
import { liveReceipts, formatCurrency } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";

export default function CasesPage() {
  return (
    <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
            Directory
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Recovery Cases
          </h1>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search cases..." 
            className="px-3 py-1.5 border border-border bg-surface text-sm focus:outline-none w-64 rounded-none"
          />
          <button className="btn-secondary">Filter</button>
        </div>
      </div>

      <div className="sharp-card flex-1 overflow-auto flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background/50 text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          <div className="col-span-2">Time</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2 text-right">At Risk</div>
          <div className="col-span-3">Latest Event</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="flex flex-col">
          {liveReceipts.map((receipt, i) => (
            <Link 
              href={`/cases/${receipt.id}`} 
              key={receipt.id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 hover:bg-neutral-bg transition-colors cursor-pointer group last:border-0"
            >
              <div className="col-span-2 font-mono text-xs text-text-muted group-hover:text-text-primary transition-colors">
                {receipt.time}
              </div>
              <div className="col-span-3 font-mono text-xs text-text-primary">
                +91 98••• {1000 + i * 27}
              </div>
              <div className="col-span-2 font-mono text-xs text-text-primary text-right">
                {receipt.amount > 0 ? formatCurrency(receipt.amount) : "—"}
              </div>
              <div className="col-span-3 font-mono text-xs text-text-secondary truncate group-hover:text-text-primary transition-colors">
                {receipt.event}
              </div>
              <div className="col-span-2 text-right flex justify-end">
                <StatusBadge status={receipt.state} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
