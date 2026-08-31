import Link from "next/link";
import { formatCurrency, ReceiptEvent } from "@/lib/demo-data";
import { StatusBadge } from "./status-badge";

export function ReceiptRow({ event }: { event: ReceiptEvent }) {
  return (
    <Link href={`/cases/${event.id}`} className="flex flex-col sm:flex-row sm:items-center py-3 px-4 hover:bg-neutral-bg transition-colors cursor-pointer border-b border-border/50 last:border-0 group block">
      <div className="w-[80px] font-mono text-xs text-text-muted shrink-0">
        {event.time.replace(' IST', '')}
      </div>
      <div className="w-[180px] font-mono text-xs font-bold text-text-primary truncate shrink-0">
        {event.event}
      </div>
      <div className="w-[80px] font-mono text-xs text-text-primary text-right shrink-0">
        {event.amount > 0 ? formatCurrency(event.amount) : ''}
      </div>
      <div className="flex-1 font-mono text-xs text-text-secondary sm:ml-6 truncate group-hover:text-text-primary transition-colors">
        {event.detail}
      </div>
      <div className="mt-1 sm:mt-0 shrink-0 min-w-[120px] text-right">
        <StatusBadge status={event.state} showDot={true} />
      </div>
    </Link>
  );
}
