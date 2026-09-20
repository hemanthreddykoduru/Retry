"use client";

import { MetricCard } from "@/components/metric-card";
import { useState, useEffect } from "react";
import { RecoveryCase, Customer, formatCurrency } from "@/lib/demo-data";
import Link from "next/link";

export default function CustomersPage() {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/demo/state', { headers: { 'x-merchant-id': '00000000-0000-0000-0000-000000000001' } })
      .then(r => r.json())
      .then(data => {
        if (data && data.cases) setCases(data.cases);
        if (data && data.customers) setCustomers(data.customers);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Aggregate customer stats
  const customerStats = customers.map(cust => {
    const custCases = cases.filter(c => c.customer_id === cust.id);
    const openCases = custCases.filter(c => c.status !== 'recovered' && !c.status.startsWith('closed_'));
    const recoveredCases = custCases.filter(c => c.status === 'recovered');
    const recoveredValue = recoveredCases.reduce((sum, c) => sum + c.amount, 0);
    
    // Get latest activity date
    let lastActivity = cust.created_at;
    custCases.forEach(c => {
      if (new Date(c.opened_at) > new Date(lastActivity)) lastActivity = c.opened_at;
      c.interventions?.forEach(i => {
        const d = i.executed_at || i.scheduled_for;
        if (new Date(d) > new Date(lastActivity)) lastActivity = d;
      });
    });

    const isOptedOut = cust.do_not_contact || custCases.some(c => c.status === 'closed_optout');

    return {
      customer: cust,
      cases: custCases,
      openCases,
      recoveredValue,
      lastActivity,
      isOptedOut
    };
  }).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

  // Metrics
  const customersWithOpenCases = customerStats.filter(c => c.openCases.length > 0).length;
  const eligibleForRecovery = customerStats.filter(c => !c.isOptedOut && c.openCases.length > 0).length;
  const optedOut = customerStats.filter(c => c.isOptedOut).length;
  const recoveredCustomers = customerStats.filter(c => c.recoveredValue > 0).length;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[#17191F]">
            Customers
          </h1>
          <div className="text-[15px] text-[#5B6270]">
            View customers with payment-recovery activity.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">Export</button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Customers with open cases"
          value={customersWithOpenCases.toString()}
          detail="Need attention"
        />
        <MetricCard
          title="Eligible for recovery"
          value={eligibleForRecovery.toString()}
          detail="Inside contact window"
        />
        <MetricCard
          title="Opted out"
          value={optedOut.toString()}
          detail="Future outreach blocked"
          isWarning={true}
        />
        <MetricCard
          title="Recovered customers"
          value={recoveredCustomers.toString()}
          detail="Successfully captured"
          isPositive={true}
        />
      </div>

      {/* Main Table */}
      <div className="sharp-card flex-1 overflow-auto flex flex-col min-h-[500px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#E6E8EC] bg-[#F7F8FA] text-[11px] font-semibold tracking-wider uppercase text-[#5B6270] min-w-[1000px]">
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Contact status</div>
          <div className="col-span-2 text-center">Open cases</div>
          <div className="col-span-2 text-right">Recovered value</div>
          <div className="col-span-3 text-right">Last activity</div>
        </div>

        <div className="flex flex-col min-w-[1000px] flex-1">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
               <div className="animate-pulse">Loading customers...</div>
             </div>
          ) : customerStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="text-[#17191F] font-semibold text-base mb-1">No customers with recovery activity</div>
              <div className="text-[#5B6270] text-sm max-w-md mb-6">
                Customers appear here after Retry receives a verified Razorpay payment event and creates a recovery case.
              </div>
              <Link href="/cases" className="btn-primary">View recovery cases</Link>
            </div>
          ) : (
            customerStats.map((stat, i) => (
              <Link 
                href={stat.cases.length > 0 ? `/cases/${stat.cases[0].id}` : '#'}
                key={`${stat.customer.id}-${i}`}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 hover:bg-neutral-bg transition-colors cursor-pointer group last:border-0 items-center"
              >
                <div className="col-span-3 font-mono text-xs text-text-primary">
                  <div className="truncate font-bold">{stat.customer.name ? `${stat.customer.name[0]}•••• ${stat.customer.name.split(' ').pop()?.[0] || ''}••••` : "Unknown"}</div>
                  <div className="text-text-secondary mt-1 text-[10px]">{stat.customer.phone ? `+91 ••••• ${stat.customer.phone.slice(-5)}` : ""}</div>
                </div>
                <div className="col-span-2 font-mono text-xs">
                  {stat.isOptedOut ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold bg-[#FEE4E2] text-[#D92D20]">
                      Blocked by opt-out
                    </span>
                  ) : stat.openCases.length > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold bg-[#E3F5F1] text-[#0F9F6E]">
                      Eligible
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold bg-[#F2F4F7] text-[#475467]">
                      No active cases
                    </span>
                  )}
                </div>
                <div className="col-span-2 font-mono text-xs text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full ${stat.openCases.length > 0 ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-text-muted'}`}>
                    {stat.openCases.length}
                  </span>
                </div>
                <div className="col-span-2 font-mono text-xs text-text-primary text-right font-bold">
                  {formatCurrency(stat.recoveredValue)}
                </div>
                <div className="col-span-3 font-mono text-[10px] text-text-muted text-right uppercase" suppressHydrationWarning>
                  {new Date(stat.lastActivity).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
