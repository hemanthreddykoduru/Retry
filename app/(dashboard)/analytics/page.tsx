import { metricsData, diagnosisData, formatCurrency } from "@/lib/demo-data";
import { MetricCard } from "@/components/metric-card";
import { DiagnosisBreakdown } from "@/components/diagnosis-breakdown";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
            Insights & Metrics
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Analytics
          </h1>
        </div>
        <div className="flex gap-2 text-sm">
          <select className="bg-surface border border-border px-3 py-1.5 focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="RECOVERED REVENUE" value={formatCurrency(metricsData.amount_recovered)} detail="from ₹79,420 at risk" isPositive={true} />
        <MetricCard title="RECOVERY RATE" value={`${(metricsData.cases_recovered / metricsData.cases_opened * 100).toFixed(1)}%`} detail={`${metricsData.cases_recovered} of ${metricsData.cases_opened} cases`} />
        <MetricCard title="VOICE CALLS" value={metricsData.calls_placed.toString()} detail="Sarvam AI initiated" />
        <MetricCard title="OPTOUTS" value={metricsData.optouts.toString()} detail="Stopped by guardrails" isWarning={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="sharp-card p-6">
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
            Root Cause Diagnosis
          </h2>
          <DiagnosisBreakdown />
        </div>
        
        <div className="sharp-card p-6">
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
            Recovery Funnel
          </h2>
          <div className="flex flex-col gap-6 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-primary">Failures Detected</span>
              <span className="font-bold">{metricsData.failures_detected}</span>
            </div>
            <div className="flex justify-between items-center border-l-2 border-border pl-4">
              <span className="text-text-secondary">Valid for Intervention</span>
              <span className="font-bold">{metricsData.cases_opened}</span>
            </div>
            <div className="flex justify-between items-center border-l-2 border-border pl-4">
              <span className="text-text-secondary">Interventions Sent</span>
              <span className="font-bold">{metricsData.calls_placed + metricsData.whatsapps_sent}</span>
            </div>
            <div className="flex justify-between items-center border-l-2 border-recovered pl-4 text-recovered">
              <span className="font-bold">Successfully Recovered</span>
              <span className="font-bold">{metricsData.cases_recovered}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
