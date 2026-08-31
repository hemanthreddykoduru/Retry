import { diagnosisData, formatCurrency } from "@/lib/demo-data";

export function DiagnosisBreakdown() {
  const maxAmount = Math.max(...diagnosisData.map(d => d.amount));

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Failure Diagnosis</h2>
          <div className="text-sm text-text-muted mt-1 font-mono">100 cases · ₹83,600 at risk</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {diagnosisData.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm items-center">
              <span className="text-text-primary">{item.label}</span>
              <div className="flex gap-4 font-mono text-xs">
                <span className="text-text-muted w-6 text-right">{item.cases}</span>
                <span className="text-text-primary w-16 text-right">{formatCurrency(item.amount)}</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-neutral-bg rounded-full overflow-hidden flex">
              <div 
                className={`h-full ${item.label === 'Bank downtime' ? 'bg-waiting' : item.label.includes('network') || item.label.includes('PIN') ? 'bg-active' : 'bg-neutral'}`}
                style={{ width: `${(item.amount / maxAmount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
