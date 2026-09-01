export default function PricingPage() {
  return (
    <div className="flex flex-col gap-16 py-24 max-w-5xl mx-auto px-6">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Pay for what you recover.</h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          No monthly fees. No minimums. We only make money when you do.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
        <div className="sharp-card p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Success Fee</h2>
          <p className="text-text-secondary mb-8">Perfect for fast-growing D2C brands.</p>
          
          <div className="text-4xl font-bold tracking-tighter mb-8 font-mono">
            3% <span className="text-lg text-text-secondary font-sans font-normal tracking-normal">of recovered revenue</span>
          </div>

          <ul className="flex flex-col gap-3 text-sm text-text-primary mb-8 flex-1 font-mono">
            <li className="flex items-center gap-2">✓ Unlimited Sarvam Voice Calls</li>
            <li className="flex items-center gap-2">✓ Unlimited Payment-link Follow-ups</li>
            <li className="flex items-center gap-2">✓ Full guardrail control</li>
            <li className="flex items-center gap-2">✓ Analytics & reporting</li>
          </ul>

          <button className="btn-primary w-full">Start Recovering</button>
        </div>
        
        <div className="sharp-card p-8 bg-neutral-bg flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
          <p className="text-text-secondary mb-8">For high-volume merchants processing &gt;₹5Cr/mo.</p>
          
          <div className="text-4xl font-bold tracking-tighter mb-8 font-mono">
            Custom
          </div>

          <ul className="flex flex-col gap-3 text-sm text-text-primary mb-8 flex-1 font-mono">
            <li className="flex items-center gap-2">✓ Volume discounts</li>
            <li className="flex items-center gap-2">✓ Custom ML models</li>
            <li className="flex items-center gap-2">✓ Dedicated account manager</li>
            <li className="flex items-center gap-2">✓ SLA guarantees</li>
          </ul>

          <button className="btn-secondary w-full">Contact Sales</button>
        </div>
      </div>
    </div>
  );
}
