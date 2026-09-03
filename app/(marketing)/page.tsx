import Link from "next/link";
import { ReceiptRow } from "@/components/receipt-row";
import { MetricCard } from "@/components/metric-card";
import { liveReceipts } from "@/lib/demo-data";
import { CopyButton } from "@/components/copy-button";

export default function LandingPage() {
  return (
    <>
        {/* Hero Section */}
        <section className="px-6 lg:px-12 pt-16 pb-12 max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-text-primary max-w-4xl hero-animate">
            Recover the payments your checkout never got back.
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl hero-animate delay-100">
            Retry detects failed and abandoned payments, understands why they failed, and chooses the safest next action — wait, retry, message, or call. Built for Indian merchants and UPI-first payment flows.
          </p>
          <div className="flex items-center gap-4 mt-2 hero-animate delay-200">
            <Link href="/signup" className="btn-primary text-base px-6 py-3">
              Start recovering revenue
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-6 py-3">
              View live recovery demo
            </Link>
          </div>
          
          {/* Compact Product Preview */}
          <div className="mt-8 font-mono text-xs text-text-muted flex items-center justify-center gap-2 bg-neutral-bg px-4 py-2 border border-border hero-animate delay-300">
            <span>payment.failed</span>
            <span>→</span>
            <span>cause diagnosed</span>
            <span>→</span>
            <span>policy selected</span>
            <span>→</span>
            <span className="text-recovered font-bold">payment recovered</span>
          </div>
        </section>

        {/* Evidence Section */}
        <section className="bg-surface border-y border-border py-12 scroll-animate">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col items-center gap-1 mb-8 text-center">
              <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
                Demo workspace · Test-mode sample · Synthetic recovery batch
              </div>
              <div className="text-xs font-mono text-text-muted">
                Measured across 100 simulated payment-recovery cases.
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="RECOVERED REVENUE" value="₹48,620" detail="+121% vs baseline" isPositive={true} />
              <MetricCard title="RECOVERY RATE" value="61.2%" detail="+23.4 pts baseline" />
              <MetricCard title="CONTACTS AVOIDED" value="37" detail="Bank downtime cases" isWarning={true} />
              <MetricCard title="COST / RECOVERY" value="₹3" detail="Voice recovery" />
            </div>
          </div>
        </section>

        {/* Receipt Feed Visual Preview */}
        <section className="px-6 lg:px-12 py-16 w-full border-b border-border bg-neutral-bg scroll-animate">
          <div className="max-w-[1040px] mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Evidence, not decoration.</h2>
              <p className="text-text-secondary">Every decision is attributable, bounded, and auditable.</p>
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
            <h2 className="text-2xl font-bold tracking-tight">Payment failure is not always customer failure.</h2>
            <div className="text-text-secondary grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">Bank Downtime</div>
                <div className="text-sm">Issuer banks go offline. Pestering a customer when their bank is down only causes frustration.</div>
              </div>
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">Insufficient Balance</div>
                <div className="text-sm">Often temporary. A polite, perfectly-timed payment-link follow-up recovers the intent later.</div>
              </div>
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">OTP/PIN Errors</div>
                <div className="text-sm">Human mistakes during authentication shouldn&apos;t mean a permanently lost order.</div>
              </div>
              <div className="sharp-card p-4">
                <div className="font-bold text-text-primary mb-1 text-sm uppercase tracking-widest">Network Drop-offs</div>
                <div className="text-sm">The payment succeeded, but the customer&apos;s browser dropped before the redirect.</div>
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
                <li className="flex items-start gap-2"><span className="text-active">■</span> Razorpay webhook integration</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Silent checkout-drop detection</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Downtime-aware decisions</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Smart retry scheduling</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Manual payment-link follow-ups</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Telugu/Hindi/English voice recovery</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Audit receipts</li>
                <li className="flex items-start gap-2"><span className="text-active">■</span> Customer safety guardrails</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight">India-first recovery</h2>
              <p className="text-sm text-text-secondary">
                Retry is explicitly designed for the complexities of Indian e-commerce. From native integration with Razorpay, handling UPI-first flows, classifying unique Indian payment failures (like NPCI timeouts), and initiating vernacular voice interactions in Telugu, Hindi, and English.
              </p>
            </div>
          </div>

          {/* Safety */}
          <div className="flex flex-col gap-4 scroll-animate">
            <h2 className="text-2xl font-bold tracking-tight">Built-in safety guardrails</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              <div className="sharp-card p-3 border-l-4 border-l-waiting">No contact during bank downtime</div>
              <div className="sharp-card p-3 border-l-4 border-l-waiting">09:00–21:00 IST contact window</div>
              <div className="sharp-card p-3 border-l-4 border-l-waiting">Maximum two voice calls</div>
              <div className="sharp-card p-3 border-l-4 border-l-neutral">Customer opt-out stops automation</div>
              <div className="sharp-card p-3 border-l-4 border-l-active">Original payment amount only</div>
              <div className="sharp-card p-3 border-l-4 border-l-lost">Human escalation after failures</div>
            </div>
          </div>

          {/* Integration */}
          <div className="flex flex-col gap-4 scroll-animate">
            <h2 className="text-2xl font-bold tracking-tight">Integration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Razorpay Webhook Endpoint</div>
                <div className="flex items-center justify-between border border-border p-2 bg-neutral-bg font-mono text-sm">
                  <span className="truncate mr-4 text-text-muted">https://api.retry.inc/v1/razorpay/webhook</span>
                  <CopyButton text="https://api.retry.inc/v1/razorpay/webhook" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">Checkout Snippet</div>
                <div className="border border-border p-2 bg-neutral-bg font-mono text-sm relative group">
                  <pre className="text-text-muted overflow-x-auto p-2">
{`<script src="https://js.retry.inc/v1/retry.js"></script>
<script>
  Retry.init({ merchant_id: "m_123" });
</script>`}
                  </pre>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`<script src="https://js.retry.inc/v1/retry.js"></script>\n<script>\n  Retry.init({ merchant_id: "m_123" });\n</script>`} />
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
