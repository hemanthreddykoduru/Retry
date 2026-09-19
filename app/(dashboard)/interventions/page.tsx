"use client";

import { MetricCard } from "@/components/metric-card";
import { useState } from "react";

export default function InterventionsPage() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[#17191F]">
            Interventions
          </h1>
          <div className="text-[15px] text-[#5B6270]">
            Track every recovery action and its outcome.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">Export</button>
          <button className="btn-secondary">Filters</button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Scheduled today"
          value="0"
          detail="0 require review"
        />
        <MetricCard
          title="In progress"
          value="0"
          detail="Active right now"
        />
        <MetricCard
          title="Awaiting payment"
          value="0"
          detail="Average age: -"
        />
        <MetricCard
          title="Recovered value"
          value="₹0"
          detail="From interventions today"
          isPositive={true}
        />
      </div>

      {/* Main Table */}
      <div className="sharp-card flex-1 overflow-auto flex flex-col min-h-[500px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#E6E8EC] bg-[#F7F8FA] text-[11px] font-semibold tracking-wider uppercase text-[#5B6270] min-w-[1000px]">
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Outcome / Next Step</div>
          <div className="col-span-2 text-right">Started</div>
        </div>

        <div className="flex flex-col min-w-[1000px] flex-1">
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="text-[#17191F] font-semibold text-base mb-1">No interventions yet</div>
            <div className="text-[#5B6270] text-sm max-w-md mb-6">
              Retry will show calls, secure payment links, callbacks, and policy decisions after a recovery case becomes eligible.
            </div>
            <button className="btn-primary">View recovery cases</button>
          </div>
        </div>
      </div>
    </div>
  );
}
