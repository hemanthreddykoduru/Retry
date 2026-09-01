"use client";

import { Copy, AlertTriangle, ShieldCheck, CheckCircle2, ServerCrash, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function IntegrationClient({ apiKey, appUrl: serverAppUrl }: { apiKey: string, appUrl: string }) {
  const [appUrl, setAppUrl] = useState(serverAppUrl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppUrl(window.location.origin);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary uppercase">
          INTEGRATION
        </h1>
        <div className="text-sm text-text-primary font-mono mt-1">
          Connect Retry to your Razorpay checkout.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {/* Merchant Connection */}
          <div className="sharp-card p-6 border-l-4 border-l-active">
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
              Merchant Account
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">NotesBay</span>
                <span className="bg-active-bg border border-active text-active px-2 py-1 text-[10px] uppercase tracking-widest font-bold">RAZORPAY TEST MODE</span>
              </div>
              <div className="bg-neutral-bg border border-border p-3 text-sm text-text-secondary font-mono">
                Production merchant onboarding: Razorpay authorization; secrets are never requested or displayed.
              </div>
              <div className="bg-waiting-bg border border-waiting p-3 text-sm text-waiting font-mono flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0" />
                Retry never asks merchants to share a Razorpay Key Secret.
              </div>
              <button disabled className="btn-primary opacity-50 cursor-not-allowed uppercase tracking-widest text-xs mt-2">
                Connect Razorpay — Coming Soon
              </button>
            </div>
          </div>

          {/* Razorpay Webhooks */}
          <div className="sharp-card p-6">
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
              1. Razorpay Webhooks
            </h2>
            <div className="flex flex-col gap-6">
              <div>
                <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">Endpoint URL</div>
                <div className="flex items-center">
                  <div className="bg-neutral-bg border border-border p-3 font-mono text-sm flex-1 truncate">
                    {appUrl}/api/webhooks/razorpay
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`${appUrl}/api/webhooks/razorpay`)}
                    className="p-3 border border-l-0 border-border bg-surface hover:bg-neutral-bg transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
              
              <div>
                <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">Subscribed Events</div>
                <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase">
                  <span className="bg-neutral-bg border border-border px-2 py-1">payment.failed</span>
                  <span className="bg-neutral-bg border border-border px-2 py-1">payment.captured</span>
                  <span className="bg-neutral-bg border border-border px-2 py-1">payment_link.paid</span>
                  <span className="bg-neutral-bg border border-border px-2 py-1">payment_link.expired</span>
                  <span className="bg-waiting-bg border border-waiting text-waiting px-2 py-1">payment.downtime.started</span>
                  <span className="bg-recovered-bg border border-recovered text-recovered px-2 py-1">payment.downtime.resolved</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4">
                <div className="flex items-center gap-2 text-recovered text-sm font-bold uppercase tracking-wider">
                  <CheckCircle2 size={16} /> Connected
                </div>
                <div className="text-xs font-mono text-text-secondary">
                  Last event: 12 seconds ago
                </div>
              </div>

              <button className="btn-secondary w-full text-xs font-mono uppercase tracking-widest" onClick={() => alert('Demo: Test Webhook Sent')}>
                Send Test Webhook
              </button>
            </div>
          </div>

          {/* Recovery Channels */}
          <div className="sharp-card p-6">
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
              3. Recovery Channels
            </h2>
            <div className="flex flex-col gap-4 font-mono text-sm">
              <div className="flex justify-between items-center p-3 border border-border">
                <span className="font-bold">Sarvam Voice Agent</span>
                <span className="bg-active-bg border border-active text-active px-2 py-1 text-[10px] uppercase tracking-widest font-bold">MOCK MODE</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-border">
                <span className="font-bold">Razorpay Payment Links</span>
                <span className="bg-active-bg border border-active text-active px-2 py-1 text-[10px] uppercase tracking-widest font-bold">TEST MODE</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-border bg-surface opacity-60">
                <span className="font-bold flex items-center gap-2">WhatsApp Business payment-link follow-up <span className="text-[10px] tracking-widest font-mono bg-neutral-bg px-1.5 py-0.5 border border-border">ROADMAP</span></span>
                <span className="text-text-secondary px-2 py-1 text-[10px] uppercase tracking-widest font-bold">COMING SOON</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Checkout Drop-off */}
          <div className="sharp-card p-6">
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2">
              2. Checkout Drop-off Detector
            </h2>
            <div className="flex flex-col gap-6">
              <div className="text-sm text-text-secondary">
                Detect customers who abandon the checkout page without triggering a Razorpay webhook. This captures silent network drop-offs.
              </div>

              <div className="bg-waiting-bg border-l-2 border-waiting p-3 text-xs text-waiting font-mono">
                Only minimal session metadata (Cart value, Language, Phone) is collected. Card numbers, PINs, OTPs, or CVVs are never captured.
              </div>
              
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(`<script src="${appUrl}/retry-snippet.js" data-retry-key="${apiKey}"></script>`)}
                    className="p-1.5 bg-surface border border-border hover:bg-neutral-bg transition-colors"
                  >
                    <Copy size={14} className="text-text-secondary" />
                  </button>
                </div>
                <pre className="bg-neutral-bg border border-border p-4 text-xs font-mono text-text-primary overflow-x-auto whitespace-pre-wrap">
                  {`<script\n  src="${appUrl}/retry-snippet.js"\n  data-retry-key="${apiKey}"\n></script>`}
                </pre>
              </div>

              <div className="flex items-center gap-2 text-recovered text-sm font-bold uppercase tracking-wider border-t border-border pt-4">
                <ShieldCheck size={16} /> Heartbeat Active (Healthy)
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="sharp-card p-6 bg-neutral-bg">
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-6 border-b border-border pb-2 flex items-center gap-2">
              <AlertTriangle size={14} /> Troubleshooting
            </h2>
            <div className="flex flex-col gap-3 font-mono text-sm">
              <div className="flex gap-3 text-text-secondary">
                <XCircle size={16} className="text-lost shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-text-primary">Invalid Webhook Signature</div>
                  <div className="text-xs">Ensure RAZORPAY_WEBHOOK_SECRET matches your Razorpay dashboard exactly.</div>
                </div>
              </div>
              <div className="flex gap-3 text-text-secondary">
                <XCircle size={16} className="text-lost shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-text-primary">Missing Heartbeats</div>
                  <div className="text-xs">Verify the snippet is placed before the closing &lt;/head&gt; tag on the checkout page.</div>
                </div>
              </div>
              <div className="flex gap-3 text-text-secondary">
                <ServerCrash size={16} className="text-waiting shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-text-primary">Sarvam Unavailable</div>
                  <div className="text-xs">If the Sarvam AI API fails, Retry automatically marks the case for manual follow-up with a Payment Link.</div>
                </div>
              </div>
              
              <div className="mt-4 border-t border-border pt-4 text-xs text-active uppercase tracking-widest font-bold">
                TEST MODE ACTIVE - No real SMS/Calls are sent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
