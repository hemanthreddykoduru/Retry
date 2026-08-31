export default function HowItWorksPage() {
  return (
    <div className="flex flex-col gap-16 py-24 max-w-4xl mx-auto px-6">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">How Retry works</h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          From a dropped payment to recovered revenue in 5 minutes, without human intervention.
        </p>
      </div>

      <div className="flex flex-col gap-12 font-mono text-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="text-4xl font-bold text-neutral">01</div>
          <div className="sharp-card p-6 flex-1">
            <h3 className="font-bold tracking-tight mb-2 uppercase">Payment Fails</h3>
            <p className="text-text-secondary">
              A customer attempts to check out, but their bank is down or they run out of time. 
              Our Razorpay webhook integration instantly detects the failure.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="text-4xl font-bold text-neutral">02</div>
          <div className="sharp-card p-6 flex-1 border-l-4 border-l-waiting">
            <h3 className="font-bold tracking-tight mb-2 uppercase">Guardrail Evaluation</h3>
            <p className="text-text-secondary">
              Retry evaluates the cart size, root cause, and time of day. If the cart is ₹1,500 and it&apos;s 2 PM, 
              the AI decides a Voice Call is the best approach.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="text-4xl font-bold text-neutral">03</div>
          <div className="sharp-card p-6 flex-1 border-l-4 border-l-active">
            <h3 className="font-bold tracking-tight mb-2 uppercase">Automated Intervention</h3>
            <p className="text-text-secondary">
              Our Sarvam Voice Agent calls the customer in their native language (Telugu/Hindi). 
              The agent gently asks if they need help and sends a fresh payment link to their WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="text-4xl font-bold text-neutral">04</div>
          <div className="sharp-card p-6 flex-1 border-l-4 border-l-recovered bg-recovered-bg">
            <h3 className="font-bold tracking-tight mb-2 uppercase text-recovered">Revenue Recovered</h3>
            <p className="text-text-primary">
              The customer clicks the WhatsApp link, completes the UPI payment, and the case is closed automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
