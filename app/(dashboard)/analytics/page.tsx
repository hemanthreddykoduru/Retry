"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCurrency, metricsData } from "@/lib/demo-data";
import { MetricCard } from "@/components/metric-card";
import { DiagnosisBreakdown } from "@/components/diagnosis-breakdown";
import { FileText } from "lucide-react";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(metricsData);

  const refreshState = async () => {
    try {
      const res = await fetch('/api/demo/state');
      const data = await res.json();
      setMetrics(data.metrics);
    } catch(e) {}
  };

  useEffect(() => {
    fetch('/api/demo/state').then(r => r.json()).then(data => {
      setMetrics(data.metrics);
    }).catch(() => {});
    const interval = setInterval(() => {
      fetch('/api/demo/state').then(r => r.json()).then(data => {
        setMetrics(data.metrics);
      }).catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full gap-8 max-w-[1400px] mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">
            Analytics
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
            Revenue recovery, measured and attributable.
          </h1>
          <div className="text-[10px] uppercase tracking-widest font-bold text-active bg-active-bg px-2 py-1 mt-2 inline-block self-start border border-active">
            Razorpay Live Webhooks
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="REVENUE AT RISK" value={`₹${formatCurrency(metrics.revenue_at_risk_paise || 0)}`} detail={`${metrics.cases_opened || 0} failed payments`} />
        <MetricCard title="RECOVERED REVENUE" value={`₹${formatCurrency(metrics.recovered_revenue_paise || 0)}`} detail="from AI interventions" isPositive={true} />
        <MetricCard title="RECOVERY RATE" value={`${metrics.recovery_rate || 0}%`} detail={`${metrics.cases_recovered || 0} of ${metrics.cases_opened || 0} cases`} />
        <MetricCard title="CONTACTS AVOIDED" value={(metrics.contacts_avoided || 0).toString()} detail="Bank downtime detected" isWarning={true} />
      </div>

      <div className="sharp-card p-6 border-l-4 border-l-active">
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
          Baseline vs Retry Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4">Blind retries baseline</th>
                <th className="py-3 px-4 text-text-primary font-bold">Retry diagnosis-first policy</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              <tr className="border-b border-border/50 hover:bg-neutral-bg transition-colors">
                <td className="py-3 px-4 text-text-secondary">Recovery rate</td>
                <td className="py-3 px-4">37.8%</td>
                <td className="py-3 px-4 font-bold text-recovered">{metrics.recovery_rate || 0}%</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-neutral-bg transition-colors">
                <td className="py-3 px-4 text-text-secondary">Recovered revenue</td>
                <td className="py-3 px-4">₹0</td>
                <td className="py-3 px-4 font-bold text-recovered">₹{formatCurrency(metrics.recovered_revenue_paise || 0)}</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-neutral-bg transition-colors">
                <td className="py-3 px-4 text-text-secondary">Customer contacts</td>
                <td className="py-3 px-4">{metrics.cases_opened || 0} (All cases)</td>
                <td className="py-3 px-4 font-bold">{(metrics.calls_placed || 0) + (metrics.whatsapps_sent || 0)} (Bounded)</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-neutral-bg transition-colors">
                <td className="py-3 px-4 text-text-secondary">Contacts avoided</td>
                <td className="py-3 px-4 text-lost">0</td>
                <td className="py-3 px-4 font-bold text-waiting">{metrics.contacts_avoided || 0} (Downtime)</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-neutral-bg transition-colors">
                <td className="py-3 px-4 text-text-secondary">Cost per recovery</td>
                <td className="py-3 px-4">₹0</td>
                <td className="py-3 px-4 font-bold">₹{metrics.cost_per_recovery || 0}</td>
              </tr>
              <tr className="hover:bg-neutral-bg transition-colors">
                <td className="py-3 px-4 text-text-secondary">Unresolved cases</td>
                <td className="py-3 px-4">{metrics.cases_opened || 0}</td>
                <td className="py-3 px-4 font-bold">{(metrics.cases_opened || 0) - (metrics.cases_recovered || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sharp-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
              Recovery Funnel
            </h2>
            <div className="flex flex-col gap-6 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-primary uppercase">Detected</span>
                <span className="font-bold">{metrics.cases_opened || 0}</span>
              </div>
              <div className="flex justify-between items-center border-l-2 border-border pl-4 ml-2">
                <span className="text-text-secondary uppercase">Diagnosed</span>
                <span className="font-bold">{metrics.cases_opened || 0}</span>
              </div>
              <div className="flex justify-between items-center border-l-2 border-border pl-4 ml-4">
                <span className="text-text-secondary uppercase">Intervention Scheduled</span>
                <span className="font-bold">{metrics.cases_opened || 0}</span>
              </div>
              <div className="flex justify-between items-center border-l-2 border-active pl-4 ml-6">
                <span className="text-active uppercase font-bold">Contacted</span>
                <span className="font-bold">{(metrics.calls_placed || 0) + (metrics.whatsapps_sent || 0)}</span>
              </div>
              <div className="flex justify-between items-center border-l-2 border-recovered pl-4 ml-8 bg-recovered-bg p-2">
                <span className="text-recovered font-bold uppercase">Recovered</span>
                <span className="font-bold text-recovered">{metrics.cases_recovered || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <DiagnosisBreakdown />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sharp-card p-6">
          <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
            Recovery By Intervention
          </h2>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-primary">Smart Retry (Background)</span>
              <span className="font-bold text-recovered">24 recovered</span>
            </div>
            <div className="w-full bg-neutral-bg h-1.5"><div className="bg-recovered h-full" style={{ width: '39%' }}></div></div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-text-primary">Payment-link follow-up</span>
              <span className="font-bold text-recovered">22 recovered</span>
            </div>
            <div className="w-full bg-neutral-bg h-1.5"><div className="bg-recovered h-full" style={{ width: '36%' }}></div></div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-text-primary">Telugu Voice Call (Sarvam)</span>
              <span className="font-bold text-recovered">11 recovered</span>
            </div>
            <div className="w-full bg-neutral-bg h-1.5"><div className="bg-recovered h-full" style={{ width: '18%' }}></div></div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-text-primary">Hindi Voice Call (Sarvam)</span>
              <span className="font-bold text-recovered">4 recovered</span>
            </div>
            <div className="w-full bg-neutral-bg h-1.5"><div className="bg-recovered h-full" style={{ width: '7%' }}></div></div>
            
            <div className="mt-4 p-3 bg-waiting-bg border-l-2 border-waiting text-waiting text-xs">
              {metrics.contacts_avoided || 0} cases were actively suppressed during downtime and recovered via Smart Retry without any customer friction.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="sharp-card p-6 flex-1">
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
              Daily Recovery
            </h2>
            <div className="flex items-end gap-2 h-32 font-mono text-xs">
              <div className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-neutral-bg relative h-full flex items-end">
                  <div className="w-full bg-recovered/40 border-t border-recovered absolute bottom-0" style={{ height: '40%' }}></div>
                </div>
                <span className="text-text-muted text-[10px]">Aug 25</span>
              </div>
              <div className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-neutral-bg relative h-full flex items-end">
                  <div className="w-full bg-recovered/40 border-t border-recovered absolute bottom-0" style={{ height: '65%' }}></div>
                </div>
                <span className="text-text-muted text-[10px]">Aug 26</span>
              </div>
              <div className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-neutral-bg relative h-full flex items-end">
                  <div className="w-full bg-recovered/40 border-t border-recovered absolute bottom-0" style={{ height: '85%' }}></div>
                </div>
                <span className="text-text-muted text-[10px]">Aug 27</span>
              </div>
              <div className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-neutral-bg relative h-full flex items-end">
                  <div className="w-full bg-recovered/40 border-t border-recovered absolute bottom-0" style={{ height: '45%' }}></div>
                </div>
                <span className="text-text-muted text-[10px]">Aug 28</span>
              </div>
              <div className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-neutral-bg relative h-full flex items-end">
                  <div className="w-full bg-recovered/40 border-t border-recovered absolute bottom-0" style={{ height: '70%' }}></div>
                </div>
                <span className="text-text-muted text-[10px]">Aug 29</span>
              </div>
              <div className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-neutral-bg relative h-full flex items-end">
                  <div className="w-full bg-recovered/40 border-t border-recovered absolute bottom-0" style={{ height: '100%' }}></div>
                </div>
                <span className="text-text-muted text-[10px] font-bold text-text-primary">Aug 30</span>
              </div>
            </div>
          </div>
          
          <Link href="/docs/evaluation-methodology" className="sharp-card p-4 hover:bg-neutral-bg transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <FileText className="text-text-secondary group-hover:text-text-primary transition-colors" />
              <div>
                <div className="font-bold text-sm uppercase tracking-wider">Evaluation Methodology</div>
                <div className="text-xs text-text-secondary font-mono mt-1">Read how synthetic results are generated</div>
              </div>
            </div>
            <span className="text-text-muted">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
