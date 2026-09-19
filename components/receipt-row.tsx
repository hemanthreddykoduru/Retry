import Link from "next/link";
import { formatCurrency, ReceiptEvent } from "@/lib/demo-data";
import { StatusBadge } from "./status-badge";

export function ReceiptRow({ event }: { event: ReceiptEvent }) {
  return (
    <Link href={`/cases/${event.id}`} className="flex flex-col sm:flex-row sm:items-center py-3.5 px-5 hover:bg-[#F7F8FA] transition-colors cursor-pointer border-b border-[#E6E8EC] last:border-0 group block">
      <div className="w-[80px] text-xs text-[#858B98] shrink-0 font-medium">
        {event.time.replace(' IST', '')}
      </div>
      <div className="w-[180px] text-sm font-semibold text-[#17191F] truncate shrink-0">
        {event.event}
      </div>
      <div className="w-[80px] text-sm font-medium text-[#17191F] text-right shrink-0">
        {event.amount > 0 ? formatCurrency(event.amount) : ''}
      </div>
      <div className="flex-1 text-sm text-[#5B6270] sm:ml-6 truncate group-hover:text-[#17191F] transition-colors">
        {event.detail}
      </div>
      <div className="mt-2 sm:mt-0 shrink-0 min-w-[120px] text-right">
        <StatusBadge status={event.state} showDot={true} />
      </div>
    </Link>
  );
}
