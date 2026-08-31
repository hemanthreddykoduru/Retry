"use client";

import Link from "next/link";
import { Play, ArrowRight, ShieldCheck, PhoneOff, ServerCrash, AlertCircle, WifiOff } from "lucide-react";

const simulateDemo = async (action: string) => {
  try {
    const res = await fetch(`/api/demo/events/${action}`, { method: 'POST' });
    const data = await res.json();
    alert(`Demo: ${data.message || 'Action executed'}`);
  } catch (err) {
    alert(`Demo Error: failed to trigger action`);
  }
};

const ScenarioCard = ({ 
  title, 
  icon: Icon, 
  flow, 
  description, 
  action, 
  expected,
  caseId 
}: { 
  title: string; 
  icon: React.ElementType; 
  flow: string[]; 
  description: string; 
  action: string; 
  expected: string;
  caseId: string;
}) => (
  <div className="sharp-card p-6 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-text-secondary" />
          <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
        </div>
      </div>
      <p className="text-sm text-text-secondary mb-6">{description}</p>
      
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-secondary mb-8">
        {flow.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className={`px-2 py-1 border ${idx === flow.length - 1 ? 'border-recovered text-recovered bg-recovered-bg font-bold' : 'border-border bg-neutral-bg'}`}>
              {step}
            </span>
            {idx < flow.length - 1 && <span>→</span>}
          </div>
        ))}
      </div>
    </div>
    
    <div>
      <div className="text-[11px] font-mono text-text-primary mb-4 bg-background p-3 border border-border">
        <span className="text-text-secondary font-bold uppercase tracking-widest block mb-1 text-[10px]">Expected Outcome:</span>
        {expected}
      </div>
      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={() => simulateDemo(action)}
          className="btn-primary py-2 px-4 flex items-center gap-2"
        >
          <Play size={14} /> Trigger Scenario
        </button>
        <Link href={`/cases/${caseId}`} className="text-xs font-mono text-text-secondary hover:text-text-primary uppercase tracking-widest underline underline-offset-4">
          View Case
        </Link>
      </div>
    </div>
  </div>
);

export default function DemoLabPage() {

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center bg-surface border border-border p-4 mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary uppercase">
          DEMO SCENARIOS
        </h1>
        <button 
          onClick={async () => {
            await fetch('/api/demo/reset', { method: 'POST' });
            alert('Demo state reset successfully');
          }}
          className="btn-secondary py-1.5 text-xs font-mono"
        >
          Reset Demo State
        </button>
      </div>
        <div className="text-sm text-text-primary font-mono mt-1">
          Trigger a complete test-mode recovery workflow.
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto font-mono text-sm border border-border p-4 bg-neutral-bg">
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap uppercase">Detect</div>
        <span className="text-text-muted">→</span>
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap uppercase">Diagnose</div>
        <span className="text-text-muted">→</span>
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap uppercase">Decide</div>
        <span className="text-text-muted">→</span>
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap uppercase">Intervene</div>
        <span className="text-text-muted">→</span>
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap uppercase">Measure</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScenarioCard
          title="Bank Downtime"
          icon={ShieldCheck}
          description="A payment fails due to issuer bank downtime. The agent identifies this and suppresses all customer contact to avoid frustration."
          flow={['payment.failed', 'downtime matched', 'suppressed', 'resolved', 'retry', 'recovered']}
          expected="Case opens but no call/message is sent. Background retry succeeds after downtime."
          action="bank_downtime"
          caseId="rc_1a2b3c"
        />

        <ScenarioCard
          title="Insufficient Funds (Voice Call)"
          icon={PhoneOff}
          description="A high-value cart (₹1,999) fails. The agent calls in Telugu via Sarvam AI, secures a promise, and sends a WhatsApp link."
          flow={['failed', 'Telugu Call', 'promise', 'payment link', 'recovered']}
          expected="Agent calls customer, records promise, queues WhatsApp link, and tracks payment."
          action="insufficient_funds"
          caseId="rc_c931"
        />

        <ScenarioCard
          title="Silent Network Drop"
          icon={WifiOff}
          description="Customer closes the checkout tab or loses network. Heartbeat times out before reaching Razorpay."
          flow={['heartbeat timeout', 'WhatsApp link', 'recovered']}
          expected="Snippet timeout creates a case. WhatsApp nudge is sent since no Razorpay event fired."
          action="network_drop"
          caseId="rc_2d3e4f"
        />

        <ScenarioCard
          title="OTP/PIN Problem"
          icon={AlertCircle}
          description="Customer enters the wrong PIN. The agent sends a gentle WhatsApp message with a fresh link."
          flow={['failed', 'WhatsApp message', 'payment link', 'recovered']}
          expected="Immediate WhatsApp nudge sent with a fresh UPI link."
          action="otp_error"
          caseId="rc_otp123"
        />

        <ScenarioCard
          title="Customer Opt-out"
          icon={ShieldCheck}
          description="During an intervention, the customer says 'Do not contact me'. Automation halts immediately."
          flow={['contact', 'DND recorded', 'blocked']}
          expected="Customer marked DND. Status set to closed_optout. All queued interventions cancelled."
          action="opt_out"
          caseId="rc_optout123"
        />

        <ScenarioCard
          title="Sarvam Provider Failure"
          icon={ServerCrash}
          description="The Sarvam AI API times out or fails. The system gracefully falls back to a WhatsApp nudge."
          flow={['voice fails', 'audit error', 'WhatsApp fallback']}
          expected="Voice call marked failed. WhatsApp intervention queued immediately. Case continues."
          action="sarvam_failure"
          caseId="rc_sarvamfail"
        />
      </div>
    </div>
  );
}
