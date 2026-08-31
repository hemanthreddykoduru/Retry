"use client";

import { useState } from "react";

export default function DemoPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString('en-IN')}] ${msg}`, ...prev].slice(0, 10));
  };

  const simulateWebhook = async (type: string) => {
    addLog(`Simulating webhook: ${type}...`);
    // Mock simulation logic
    setTimeout(() => {
      addLog(`Event stored. Guardrails evaluated.`);
      if (type === 'payment.failed.downtime') addLog(`Action: Suppress contact (Bank downtime)`);
      if (type === 'payment.failed.insufficient') addLog(`Action: Queue Voice Call (₹1,999 > threshold)`);
      if (type === 'checkout.abandoned') addLog(`Action: Queue WhatsApp (Network drop)`);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          Test Harness
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Demo Controls
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="sharp-card p-6">
            <h2 className="font-bold tracking-tight mb-4 text-sm uppercase">Simulate Failure Events</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => simulateWebhook('payment.failed.downtime')} className="btn-secondary w-full text-left">
                1. Webhook: Bank Downtime (HDFC)
              </button>
              <button onClick={() => simulateWebhook('payment.failed.insufficient')} className="btn-secondary w-full text-left">
                2. Webhook: Insufficient Funds (₹1,999)
              </button>
              <button onClick={() => simulateWebhook('checkout.abandoned')} className="btn-secondary w-full text-left">
                3. Snippet: Silent Checkout Abandonment
              </button>
            </div>
          </div>

          <div className="sharp-card p-6">
            <h2 className="font-bold tracking-tight mb-4 text-sm uppercase">Simulate Customer Actions</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => simulateWebhook('payment_link.paid')} className="btn-secondary w-full text-left text-recovered border-recovered">
                Webhook: Payment Link Paid (Recovered)
              </button>
              <button onClick={() => simulateWebhook('sarvam.opt_out')} className="btn-secondary w-full text-left">
                Voice Outcome: Do Not Contact
              </button>
              <button onClick={() => simulateWebhook('sarvam.failure')} className="btn-secondary w-full text-left text-lost border-lost">
                Voice Outcome: Provider Failure
              </button>
            </div>
          </div>
        </div>

        <div className="sharp-card flex flex-col bg-text-primary text-surface h-[500px]">
          <div className="p-4 border-b border-text-secondary text-[11px] uppercase tracking-widest font-bold">
            Execution Logs
          </div>
          <div className="p-4 font-mono text-xs flex flex-col gap-2 overflow-auto">
            {logs.length === 0 ? (
              <div className="text-text-secondary">Waiting for simulation events...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`${i === 0 ? 'text-surface' : 'text-text-secondary'}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
