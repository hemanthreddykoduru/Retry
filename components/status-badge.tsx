import { CaseStatus } from "@/lib/demo-data";

export function StatusBadge({ status, label }: { status: CaseStatus | 'suppress_contact', label?: string }) {
  let colorClass = "bg-neutral text-neutral";
  let dotClass = "bg-neutral";
  let defaultLabel = "Unknown";

  switch (status) {
    case 'recovered':
      colorClass = "text-recovered";
      dotClass = "bg-recovered";
      defaultLabel = "RECOVERED";
      break;
    case 'waiting':
      colorClass = "text-waiting";
      dotClass = "bg-waiting";
      defaultLabel = "Waiting";
      break;
    case 'suppress_contact':
      colorClass = "text-waiting";
      dotClass = "bg-waiting";
      defaultLabel = "suppress_contact";
      break;
    case 'contacting':
      colorClass = "text-active";
      dotClass = "bg-active";
      defaultLabel = "Contacting";
      break;
    case 'promise_logged':
      colorClass = "text-active";
      dotClass = "bg-active";
      defaultLabel = "Promise logged";
      break;
    case 'escalated':
    case 'failed':
      colorClass = "text-lost";
      dotClass = "bg-lost";
      defaultLabel = "FAILED";
      break;
    case 'closed_optout':
      colorClass = "text-neutral";
      dotClass = "bg-neutral";
      defaultLabel = "Closed";
      break;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${colorClass} text-xs font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      <span>{label || defaultLabel}</span>
    </div>
  );
}
