"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency, CaseStatus, AuditLog, Intervention, RecoveryCase } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import { ChevronDown, ChevronRight, Beaker, ShieldCheck } from "lucide-react";

export default function CaseDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [c, setC] = useState<RecoveryCase | null>(null);

  const refreshState = async () => {
    const res = await fetch('/api/demo/state');
    const data = await res.json();
    const caseObj = data.cases.find((rc: RecoveryCase) => rc.id === id) || data.cases.find((rc: RecoveryCase) => rc.id === "rc_c931") || data.cases[0];
    setC(caseObj);
  };

  useEffect(() => {
    fetch('/api/demo/state').then(r => r.json()).then(data => {
      const caseObj = data.cases.find((rc: RecoveryCase) => rc.id === id) || data.cases.find((rc: RecoveryCase) => rc.id === "rc_c931") || data.cases[0];
      setC(caseObj);
    }).catch(() => {});
    
    const interval = setInterval(() => {
      fetch('/api/demo/state').then(r => r.json()).then(data => {
        const caseObj = data.cases.find((rc: RecoveryCase) => rc.id === id) || data.cases.find((rc: RecoveryCase) => rc.id === "rc_c931") || data.cases[0];
        setC(caseObj);
      }).catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const [webhookOpen, setWebhookOpen] = useState(false);

  if (!c) return <div className="p-8">Loading...</div>;

  const maskPhone = (phone: string) => {
    if (!phone) return "—";
    const last4 = phone.slice(-4);
    return `+91 98••• ${last4}`;
  };

  const formatRootCause = (rc: string) => {
    return rc.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatTrigger = (trigger: string) => {
    if (trigger === 'payment_failed_webhook') return 'Webhook';
    if (trigger === 'snippet_timeout') return 'Snippet Timeout';
    return trigger;
  };

  // Demo controls alert
  const simulateAction = async (action: string) => {
    try {
      const res = await fetch(`/api/demo/events/${action}`, { method: 'POST' });
      const data = await res.json();
      alert(`Demo: ${data.message || 'Action executed'}`);
    } catch(err) {
      alert('Demo error');
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('failed') || action.includes('lost') || action.includes('error')) return 'text-lost border-lost bg-lost-bg';
    if (action.includes('recovered') || action.includes('captured') || action.includes('paid')) return 'text-recovered border-recovered bg-recovered-bg';
    if (action.includes('guardrail') || action.includes('downtime')) return 'text-waiting border-waiting bg-waiting-bg';
    return 'text-active border-active bg-active-bg';
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      <Link href="/cases" className="text-sm font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-2">
        <span>←</span> RETURN TO CASES
      </Link>

      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
            Recovery Case
          </div>
          <button onClick={async () => {
                  try {
                    const res = await fetch(`/api/recovery-cases/${c.id}/voice-call`, { method: 'POST' });
                    const data = await res.json();
                    if (!res.ok) alert(`Blocked: ${data.reasons?.join(', ')}`);
                    else alert(data.message || 'Action executed');
                  } catch (e) {
                    alert('Demo error');
                  }
                }} className="btn-primary py-1.5 w-full flex items-center justify-center gap-2">
            {c.id}
            <StatusBadge status={c.status} showDot={true} />
          </button>
        </div>
        <div className="text-right flex flex-col gap-1 bg-surface border border-border p-4">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
            Revenue at risk
          </div>
          <div className="text-3xl font-mono tracking-tighter font-bold text-text-primary">
            {formatCurrency(c.amount)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto font-mono text-sm border border-border p-4 bg-neutral-bg">
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap">Payment Failed</div>
        <span className="text-text-muted">→</span>
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap">Voice Call</div>
        <span className="text-text-muted">→</span>
        <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold whitespace-nowrap">Payment Link</div>
        <span className="text-text-muted">→</span>
        <div className={`px-3 py-1 border font-bold whitespace-nowrap ${c.status === 'recovered' ? 'bg-recovered-bg border-recovered text-recovered' : 'bg-surface border-border text-text-secondary'}`}>
          Payment Confirmation
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="sharp-card p-6">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            Customer Profile
          </div>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Name</span>
              <span className="font-bold text-text-primary">{c.customer?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Phone</span>
              <span>{maskPhone(c.customer?.phone || "")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Preferred Language</span>
              <span className="uppercase">{c.customer?.preferred_language === 'te' ? 'Telugu' : c.customer?.preferred_language === 'hi' ? 'Hindi' : 'English'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">DND Status</span>
              <span className={c.customer?.do_not_contact ? 'text-lost font-bold' : 'text-recovered'}>{c.customer?.do_not_contact ? 'OPTED OUT' : 'OK TO CONTACT'}</span>
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            Diagnosis
          </div>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Trigger</span>
              <span>{formatTrigger(c.trigger_source)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Root Cause</span>
              <span className="font-bold">{formatRootCause(c.root_cause)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Error Code</span>
              <span className="text-lost">{c.failure_code || "NONE"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Payment Link</span>
              <span>{c.razorpay_payment_link_id || "PENDING"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="sharp-card p-6 border-l-4 border-l-active">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">
              Voice Recovery (Sarvam AI)
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-active bg-active-bg px-2 py-1">
              ACTIVE
            </div>
          </div>
          
          <div className="flex flex-col gap-4 font-mono text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-text-secondary">Language</span>
              <span>Telugu (te)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Attempts</span>
              <span>{c.attempt_count} / {c.max_attempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Outcome</span>
              <span className="text-active font-bold">promise_to_pay</span>
            </div>
          </div>
          
          <div className="bg-neutral-bg border border-border p-4 font-mono text-xs text-text-secondary italic">
            <div className="font-bold text-text-primary mb-2 not-italic text-[10px] uppercase tracking-widest">Transcript Preview</div>
            &quot;Avunu, nenu payment complete chesthanu. Link pampandi.&quot;<br/><br/>
            [System: intent classified as PROMISE_TO_PAY. Sent link request to Payment Link fallback.]
          </div>
        </div>

        <div className="sharp-card p-6 border-l-4 border-l-recovered flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-recovered" /> Guardrails Applied
            </div>
            <div className="flex flex-col gap-4 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Quiet hours check</span>
                <span className="text-recovered">PASS (15:11 IST)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Amount threshold</span>
                <span className="text-recovered">PASS (≥₹500)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">DND status</span>
                <span className="text-recovered">PASS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Max attempts</span>
                <span className="text-recovered">PASS (1/2)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Bank downtime check</span>
                <span className="text-recovered">PASS (Operational)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Original amount only</span>
                <span className="text-recovered">ENFORCED (₹1,999)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2 flex items-center gap-2">
            Payment Link
          </div>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Status</span>
              <span className={c.status === 'recovered' ? 'text-recovered font-bold' : 'text-active font-bold'}>
                {c.status === 'recovered' ? 'PAID' : c.razorpay_payment_link_id ? 'ACTIVE' : 'NOT CREATED'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Amount</span>
              <span>{formatCurrency(c.amount)}</span>
            </div>
            {c.razorpay_payment_link_id && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Reference ID</span>
                  <span>{c.razorpay_payment_link_id}</span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-text-secondary">Secure Link</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface border border-border p-2 text-xs truncate">
                      https://rzp.io/i/{c.razorpay_payment_link_id.replace('plink_', '')}
                    </div>
                    <button className="btn-secondary px-3 py-1.5" onClick={() => navigator.clipboard.writeText(`https://rzp.io/i/${c.razorpay_payment_link_id?.replace('plink_', '')}`)}>Copy</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sharp-card p-6 bg-neutral-bg">
        <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2 flex items-center gap-2 text-active">
          <Beaker size={14} /> DEMO CONTROLS (TEST MODE)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button className="btn-secondary text-xs p-2 h-auto text-center font-mono whitespace-normal" onClick={() => simulateAction('promise')}>Simulate Promise to Pay</button>
          <button className="btn-secondary text-xs p-2 h-auto text-center font-mono whitespace-normal" onClick={() => simulateAction('link')}>Simulate Link Request</button>
          <button className="btn-secondary text-xs p-2 h-auto text-center font-mono whitespace-normal" onClick={() => simulateAction('optout')}>Simulate Opt-out</button>
          <button className="btn-secondary text-xs p-2 h-auto text-center font-mono whitespace-normal" onClick={() => simulateAction('noanswer')}>Simulate No Answer</button>
          <button className="btn-secondary text-xs p-2 h-auto text-center font-mono whitespace-normal text-lost border-lost hover:bg-lost-bg" onClick={() => simulateAction('sarvam_fail')}>Simulate Sarvam Failure</button>
        </div>
      </div>

      <div>
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4">Audit Timeline</h2>
        <div className="sharp-card flex flex-col font-mono text-sm">
          {c.audit_logs?.map((log, index) => (
            <div key={log.id} className={`p-4 border-b border-border transition-colors flex gap-4 ${getActionColor(log.action).replace('text-', 'bg-').replace('-bg', '-bg/30')}`}>
              <div className="w-24 shrink-0 text-text-muted text-xs">
                {new Date(log.created_at).toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${getActionColor(log.action).split(' ')[0]}`}>{log.action}</span>
                  <span className="text-[10px] bg-background border border-border px-1.5 py-0.5 text-text-muted uppercase tracking-wider">{log.actor}</span>
                </div>
                <div className="text-text-primary text-sm mt-2 font-sans">{log.reasoning}</div>
                {Object.keys(log.metadata || {}).length > 0 && (
                  <div className="mt-2 text-xs text-text-muted bg-background p-2 border border-border overflow-x-auto">
                    {JSON.stringify(log.metadata)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4">Intervention History</h2>
        <div className="sharp-card overflow-hidden">
          <div className="grid grid-cols-4 p-4 border-b border-border bg-neutral-bg text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary">
            <div>Type</div>
            <div>Scheduled For</div>
            <div>Executed At</div>
            <div>Outcome</div>
          </div>
          {c.interventions?.length ? c.interventions.map(int => (
            <div key={int.id} className="grid grid-cols-4 p-4 border-b border-border last:border-0 font-mono text-sm items-center">
              <div className="uppercase">{int.type.replace('_', ' ')}</div>
              <div>{new Date(int.scheduled_for).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              <div>{int.executed_at ? new Date(int.executed_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}</div>
              <div>
                <span className={`px-2 py-1 text-xs border ${int.status === 'completed' ? 'border-recovered text-recovered bg-recovered-bg' : 'border-border'}`}>
                  {int.outcome || int.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="p-4 text-center font-mono text-sm text-text-secondary">No interventions recorded.</div>
          )}
        </div>
      </div>

      <div className="sharp-card">
        <button 
          className="w-full flex justify-between items-center p-4 text-sm font-mono hover:bg-neutral-bg transition-colors"
          onClick={() => setWebhookOpen(!webhookOpen)}
        >
          <span className="font-bold text-text-secondary uppercase">Raw Webhook Payload</span>
          {webhookOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {webhookOpen && (
          <div className="p-4 border-t border-border bg-background">
            <pre className="text-xs font-mono text-text-muted overflow-x-auto">
{JSON.stringify({
  "entity": "event",
  "account_id": "acc_123456",
  "event": "payment.failed",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_123456",
        "amount": c.amount,
        "currency": "INR",
        "status": "failed",
        "error_code": c.failure_code,
        "error_description": c.failure_reason
      }
    }
  },
  "created_at": Math.floor(new Date(c.opened_at).getTime() / 1000)
}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
