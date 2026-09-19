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
    <div className="bg-[#FFFFFF] border border-[#E6E8EC] p-5 rounded-xl flex flex-col gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="text-xs font-semibold tracking-wide uppercase text-[#5B6270]">
        {title}
      </div>
      <div className="text-3xl lg:text-4xl font-semibold tracking-tight text-[#17191F] mt-1">
        {value}
      </div>
      <div className={`text-sm font-medium ${isPositive ? 'text-[#0F9F6E]' : isWarning ? 'text-[#B55D00]' : 'text-[#858B98]'}`}>
        {detail}
      </div>
    </div>
  );
}
