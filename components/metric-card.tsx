export function MetricCard({
  title,
  value,
  detail,
  isPositive = false,
  isWarning = false
}: {
  title: string;
  value: string;
  detail: string;
  isPositive?: boolean;
  isWarning?: boolean;
}) {
  return (
    <div className="bg-surface border border-border p-4 rounded-lg flex flex-col gap-2">
      <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
        {title}
      </div>
      <div className="text-[28px] lg:text-[36px] font-mono tabular-nums leading-none tracking-tight text-text-primary">
        {value}
      </div>
      <div className={`text-xs ${isPositive ? 'text-recovered' : isWarning ? 'text-waiting' : 'text-text-muted'}`}>
        {detail}
      </div>
    </div>
  );
}
