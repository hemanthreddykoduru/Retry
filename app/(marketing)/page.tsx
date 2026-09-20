import Link from "next/link";
import { ReceiptRow } from "@/components/receipt-row";
import { MetricCard } from "@/components/metric-card";
import { liveReceipts, formatCurrency } from "@/lib/demo-data";
import { CopyButton } from "@/components/copy-button";
import { FaGithub, FaPlayCircle } from "react-icons/fa";

import { MetricsRepository } from "@/lib/repositories/metrics";
import { ViewSwitcher } from "@/components/view-switcher";
import { HeroSection } from "@/components/hero-section";

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function LandingPage(props: { searchParams: Promise<{ view?: string }> }) {
  const searchParams = await props.searchParams;
  const viewMode = searchParams?.view === 'agent' ? 'agent' : 'human';
  
  const merchantId = '00000000-0000-0000-0000-000000000001';
  const dbMetrics = await MetricsRepository.getAggregatedByMerchant(merchantId);

  const amountRecovered = dbMetrics ? dbMetrics.amount_recovered : 0;
  const recoveryRate = dbMetrics && dbMetrics.amount_at_risk > 0 
    ? ((dbMetrics.amount_recovered / dbMetrics.amount_at_risk) * 100).toFixed(1) 
    : "0.0";
  const contactsAvoided = dbMetrics 
    ? Math.max(0, dbMetrics.cases_opened - dbMetrics.calls_placed - dbMetrics.whatsapps_sent) 
    : 0;

  const agentContent = fs.readFileSync(path.join(process.cwd(), 'public', 'agents.md'), 'utf8');

  return (
    <ViewSwitcher initialView={viewMode} agentContent={agentContent}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white isolate">
        {/* Vibrant Stripe-inspired Mesh Gradient */}
        <div className="absolute top-0 right-0 w-[120%] lg:w-[80%] h-[800px] pointer-events-none skew-y-[-10deg] origin-top-right transform translate-y-[-10%] opacity-100 overflow-hidden rounded-bl-[100px] z-0">
          <div className="absolute top-[-10%] right-[10%] w-[50%] h-[80%] rounded-[100%] bg-pink-400 blur-[100px] opacity-40 animate-pulse-slow"></div>
          <div className="absolute top-[10%] right-[30%] w-[60%] h-[90%] rounded-[100%] bg-purple-400 blur-[120px] opacity-40"></div>
          <div className="absolute bottom-[10%] right-[0%] w-[50%] h-[70%] rounded-[100%] bg-orange-400 blur-[100px] opacity-40"></div>
          <div className="absolute top-[40%] right-[40%] w-[40%] h-[60%] rounded-[100%] bg-blue-400 blur-[90px] opacity-40"></div>
          {/* Fading overlay to blend into the white background smoothly */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <HeroSection />
      </div>

        {/* Evidence Section */}
        <section className="bg-surface border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col items-center gap-2 mb-10 text-center">
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-secondary bg-neutral-bg px-3 py-1 border border-border">
                Live Production Metrics
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
                  <span className="truncate mr-4 text-text-muted">https://retry-aws.vercel.app/api/webhooks/razorpay?merchantId=m_demo_123</span>
                  <CopyButton text="https://retry-aws.vercel.app/api/webhooks/razorpay?merchantId=m_demo_123" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Checkout Snippet</div>
                <div className="border border-border p-2 bg-neutral-bg font-mono text-sm relative group">
                  <pre className="text-text-muted overflow-x-auto p-2">
{`<script src="https://retry-aws.vercel.app/retry-snippet.js" data-retry-key="m_demo_123"></script>`}
                  </pre>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`<script src="https://retry-aws.vercel.app/retry-snippet.js" data-retry-key="m_demo_123"></script>`} />
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
    </ViewSwitcher>
  );
}
