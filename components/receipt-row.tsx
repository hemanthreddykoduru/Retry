import { formatCurrency, ReceiptEvent } from "@/lib/demo-data";
import { StatusBadge } from "./status-badge";

export function ReceiptRow({ event }: { event: ReceiptEvent }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 px-4 hover:bg-neutral-bg/50 transition-colors cursor-pointer border-b border-border/50 last:border-0 group">
      <div className="w-[80px] font-mono text-xs text-text-muted shrink-0">
        {event.time}
      </div>
      <div className="w-[180px] font-mono text-xs text-text-primary truncate shrink-0">
        {event.event}
      </div>
      <div className="w-[80px] font-mono text-xs text-text-primary text-right shrink-0">
        {event.amount > 0 ? formatCurrency(event.amount) : ''}
      </div>
      <div className="flex-1 font-mono text-xs text-text-secondary sm:ml-6 truncate group-hover:text-text-primary transition-colors">
        {event.detail}
      </div>
      <div className="mt-1 sm:mt-0 shrink-0 min-w-[120px] text-right">
        {['recovered', 'suppress_contact', 'failed'].includes(event.state) && (
          <StatusBadge status={event.state} />
        )}
      </div>
    </div>
  );
}
