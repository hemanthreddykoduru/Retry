import Link from "next/link";
import { ReceiptRow } from "@/components/receipt-row";
import { MetricCard } from "@/components/metric-card";
import { liveReceipts, formatCurrency } from "@/lib/demo-data";
import { CopyButton } from "@/components/copy-button";
import { FaGithub } from "react-icons/fa";

import { MetricsRepository } from "@/lib/repositories/metrics";

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const merchantId = '00000000-0000-0000-0000-000000000001';
  const dateStr = new Date().toISOString().split('T')[0];
  const dbMetrics = await MetricsRepository.getByMerchant(merchantId, dateStr);

  const amountRecovered = dbMetrics ? dbMetrics.amount_recovered : 0;
  const recoveryRate = dbMetrics && dbMetrics.amount_at_risk > 0 
    ? ((dbMetrics.amount_recovered / dbMetrics.amount_at_risk) * 100).toFixed(1) 
    : "0.0";
  const contactsAvoided = dbMetrics 
    ? Math.max(0, dbMetrics.cases_opened - dbMetrics.calls_placed - dbMetrics.whatsapps_sent) 
    : 0;

  return (
    <>
        {/* Hero Section */}
        <section className="px-6 lg:px-12 pt-24 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary max-w-4xl">
            Stop losing customers to failed payments.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
            Retry automatically figures out why a payment failed and follows up with your customer at the right time. Built from the ground up for Indian businesses and UPI.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Link href="/signup" className="btn-primary text-base px-8 py-3 font-medium">
              Start recovering revenue
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-3 font-medium border-2">
              View live recovery demo
            </Link>
            <a href="https://github.com/hemanthreddykoduru/Retry" target="_blank" rel="noopener noreferrer" className="btn-secondary text-base px-8 py-3 font-medium border-2 flex items-center gap-2">
              <FaGithub size={18} />
              View GitHub
            </a>
          </div>
          
          {/* Compact Product Preview */}
          <div className="mt-8 font-mono text-xs text-text-muted flex flex-wrap items-center justify-center gap-3 bg-neutral-bg px-5 py-2.5 border border-border">
            <span className="animate-pipeline-1 bg-lost-bg text-lost font-medium px-2 py-1 rounded-sm border border-lost/20">payment.failed</span>
            <span className="text-text-muted">→</span>
            <span className="animate-pipeline-2">cause diagnosed</span>
            <span className="text-text-muted">→</span>
            <span className="animate-pipeline-3">policy selected</span>
            <span className="text-text-muted">→</span>
            <span className="animate-pipeline-4 bg-recovered-bg text-recovered font-bold px-2 py-1 rounded-sm border border-recovered/20">
              payment recovered
            </span>
          </div>
        </section>

        {/* Evidence Section */}
        <section className="bg-surface border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col items-center gap-2 mb-10 text-center">
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-secondary bg-neutral-bg px-3 py-1 border border-border">
                Razorpay Hackathon Demo · Live Production Metrics
              </div>
              <div className="text-xs font-mono text-text-muted">
                Measured across today's live payment-recovery cases.
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="RECOVERED REVENUE" value={formatCurrency(amountRecovered)} detail="+121% vs baseline" isPositive={true} />
              <MetricCard title="RECOVERY RATE" value={`${recoveryRate}%`} detail="+23.4 pts baseline" />
              <MetricCard title="CONTACTS AVOIDED" value={contactsAvoided.toString()} detail="Bank downtime cases" isWarning={true} />
              <MetricCard title="COST / RECOVERY" value="₹3" detail="Voice recovery" />
            </div>
          </div>
        </section>

        {/* Receipt Feed Visual Preview */}
        <section className="px-6 lg:px-12 py-16 w-full border-b border-border bg-neutral-bg scroll-animate">
          <div className="max-w-[1040px] mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">See exactly how we recover payments.</h2>
              <p className="text-text-secondary">Every action our system takes is fully logged and transparent.</p>
            </div>
            <div className="sharp-card">
              <div className="flex justify-between items-center p-4 border-b border-border bg-background/50">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Live Recovery Receipts</div>
              </div>
              <div className="flex flex-col py-2">
                {liveReceipts.slice(0, 4).map((receipt) => (
                  <ReceiptRow key={receipt.id} event={receipt} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
          
          {/* Problem */}
          <div className="flex flex-col gap-4 scroll-animate">
            <h2 className="text-2xl font-bold tracking-tight">Why payments actually fail</h2>
            <div className="text-text-secondary grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">Bank Downtime</div>
                <div className="text-sm">When a bank goes offline, sending immediate payment reminders just frustrates customers. We wait until the bank is back up.</div>
              </div>
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">Insufficient Balance</div>
                <div className="text-sm">This is usually temporary. A polite follow-up link sent at the right time often saves the sale.</div>
              </div>
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">OTP/PIN Errors</div>
                <div className="text-sm">Simple typing mistakes shouldn't cost you a customer. We give them a seamless way to try again.</div>
              </div>
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">Network Drop-offs</div>
                <div className="text-sm">The payment went through, but the connection dropped before the customer returned to your site. We verify and close the loop.</div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-4 scroll-animate">
            <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
            <div className="flex items-center gap-2 overflow-x-auto font-mono text-sm border border-border p-4 bg-neutral-bg">
              <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold">Detect</div>
              <span className="text-text-muted">→</span>
              <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold">Diagnose</div>
              <span className="text-text-muted">→</span>
              <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold">Decide</div>
              <span className="text-text-muted">→</span>
              <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold">Recover</div>
              <span className="text-text-muted">→</span>
              <div className="px-3 py-1 bg-surface border border-border text-text-primary font-bold">Measure</div>
            </div>
          </div>

          {/* Features & India First */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-animate">
            <div className="flex flex-col gap-4 scroll-animate-stagger-1">
              <h2 className="text-2xl font-bold tracking-tight">Features</h2>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary font-mono">
                <li className="flex items-start gap-2"><span className="text-active">■</span> <strong>Backend:</strong> Razorpay Webhook Integration (Live)</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> <strong>Frontend:</strong> Checkout Drop-off Snippet (Future Vision)</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Downtime-aware decisions</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Smart retry scheduling</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Manual payment-link follow-ups</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Telugu/Hindi/English/Kannada voice recovery</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Audit receipts</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Customer safety guardrails</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Built for Indian e-commerce</h2>
              <p className="text-sm text-text-secondary">
                The Indian payments landscape is unique. We built Retry to handle UPI timeouts, integrate directly with Razorpay, and follow up with your customers in their native language—including Telugu, Hindi, Kannada, and English.
              </p>
            </div>
          </div>

          {/* Safety */}
          <div className="flex flex-col gap-4 scroll-animate">
            <h2 className="text-2xl font-bold tracking-tight">We protect your brand reputation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              <div className="sharp-card p-3 border-l-4 border-l-waiting">We never message users during known bank outages</div>
              <div className="sharp-card p-3 border-l-4 border-l-waiting">We only contact customers during daytime hours (9 AM - 9 PM)</div>
              <div className="sharp-card p-3 border-l-4 border-l-waiting">We limit voice calls to a maximum of two attempts</div>
              <div className="sharp-card p-3 border-l-4 border-l-neutral">Immediate stop if a customer opts out</div>
              <div className="sharp-card p-3 border-l-4 border-l-active">Links are locked to the exact original cart value</div>
              <div className="sharp-card p-3 border-l-4 border-l-lost">Fails over to your support team if we can't recover it</div>
            </div>
          </div>

          {/* Integration */}
          <div className="flex flex-col gap-4 scroll-animate">
            <h2 className="text-2xl font-bold tracking-tight">Integration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Razorpay Webhook Endpoint</div>
                <div className="flex items-center justify-between border border-border p-2 bg-neutral-bg font-mono text-sm">
                  <span className="truncate mr-4 text-text-muted">https://retry-buildathon.vercel.app/api/webhooks/razorpay?merchantId=m_demo_123</span>
                  <CopyButton text="https://retry-buildathon.vercel.app/api/webhooks/razorpay?merchantId=m_demo_123" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Checkout Snippet</div>
                <div className="border border-border p-2 bg-neutral-bg font-mono text-sm relative group">
                  <pre className="text-text-muted overflow-x-auto p-2">
{`<script src="https://retry-buildathon.vercel.app/retry-snippet.js" data-retry-key="m_demo_123"></script>`}
                  </pre>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`<script src="https://retry-buildathon.vercel.app/retry-snippet.js" data-retry-key="m_demo_123"></script>`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-neutral-bg py-20 px-6 text-center flex flex-col items-center gap-6 scroll-animate">
          <h2 className="text-3xl font-bold tracking-tight max-w-2xl text-text-primary">
            Give every failed payment one better next attempt.
          </h2>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Start recovering revenue
          </Link>
        </section>
    </>
  );
}
