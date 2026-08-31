export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-16 py-24 max-w-5xl mx-auto px-6">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Everything you need to recover lost revenue.</h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          Automated voice concierges, WhatsApp nudges, and intelligent guardrails designed specifically for the Indian payments ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="sharp-card p-8">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            Sarvam AI Voice Concierge
          </div>
          <p className="text-text-primary mb-4">
            Deploy human-like voice agents that speak Telugu, Hindi, and English fluently to recover high-value carts.
          </p>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-2">
            <li>Zero latency conversational AI</li>
            <li>Automatic intent classification</li>
            <li>No hard-selling or collection tactics</li>
          </ul>
        </div>
        
        <div className="sharp-card p-8">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            WhatsApp Payment Nudges
          </div>
          <p className="text-text-primary mb-4">
            Fallback seamlessly to verified WhatsApp business messages with fresh Razorpay payment links.
          </p>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-2">
            <li>Dynamic payment link generation</li>
            <li>One-click UPI flows</li>
            <li>Silent drop-off recovery</li>
          </ul>
        </div>

        <div className="sharp-card p-8 md:col-span-2">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            Strict Guardrails
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-sm mb-2">Quiet Hours</h3>
              <p className="text-xs text-text-secondary">Strictly enforced 9AM-9PM IST windows. The system will never wake your customers up.</p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">Thresholds</h3>
              <p className="text-xs text-text-secondary">Only deploy expensive voice calls on high-intent, high-value orders.</p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">Opt-Outs</h3>
              <p className="text-xs text-text-secondary">Instant global DO_NOT_CONTACT enforcement across all channels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
