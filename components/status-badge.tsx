import { CaseStatus } from "@/lib/demo-data";

export function StatusBadge({ status, label }: { status: CaseStatus, label?: string }) {
  let colorClass = "bg-neutral text-neutral";
  let dotClass = "bg-neutral";
  let defaultLabel = "Unknown";

  switch (status) {
    case 'recovered':
      colorClass = "text-recovered";
      dotClass = "bg-recovered";
      defaultLabel = "RECOVERED";
      break;
    case 'open':
    case 'diagnosing':
    case 'awaiting_downtime_resolution':
    case 'intervention_scheduled':
      colorClass = "text-waiting";
      dotClass = "bg-waiting";
      defaultLabel = status.replace(/_/g, ' ').toUpperCase();
      break;
    case 'contacting':
    case 'promise_logged':
      colorClass = "text-active";
      dotClass = "bg-active";
      defaultLabel = status.replace(/_/g, ' ').toUpperCase();
      break;
    case 'escalated':
    case 'closed_lost':
      colorClass = "text-lost";
      dotClass = "bg-lost";
      defaultLabel = status.replace(/_/g, ' ').toUpperCase();
      break;
    case 'closed_optout':
      colorClass = "text-neutral";
      dotClass = "bg-neutral";
      defaultLabel = "CLOSED (OPTOUT)";
      break;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${colorClass} text-[10px] font-bold uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-none ${dotClass}`}></span>
      <span>{label || defaultLabel}</span>
    </div>
  );
}
