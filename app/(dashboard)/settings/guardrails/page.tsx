export default function GuardrailsPage() {
  return (
    <div className="flex flex-col h-full gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          Compliance & Safety
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Guardrails
        </h1>
      </div>

      <p className="text-sm text-text-secondary max-w-2xl">
        Guardrails are hard-coded constraints that protect your brand and your customers. 
        The AI cannot override these rules under any circumstance.
      </p>

      <div className="grid gap-4 mt-4">
        <div className="sharp-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm tracking-tight mb-1">Quiet Hours</h3>
            <p className="text-sm text-text-secondary">No voice or WhatsApp contact between 21:00 and 09:00 IST.</p>
          </div>
          <div className="px-3 py-1 bg-recovered-bg text-recovered text-[10px] font-bold uppercase tracking-widest">
            Enforced
          </div>
        </div>

        <div className="sharp-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-active">
          <div className="flex-1">
            <h3 className="font-bold text-sm tracking-tight mb-1">Voice Threshold</h3>
            <p className="text-sm text-text-secondary mb-4">Minimum cart value required to trigger an outbound Sarvam AI voice call. Lower amounts will fallback to WhatsApp.</p>
            <div className="flex items-center gap-2 max-w-xs">
              <span className="font-mono text-sm bg-neutral-bg border border-border px-3 py-2">₹</span>
              <input type="number" defaultValue="500" className="w-full font-mono text-sm bg-surface border border-border px-3 py-2 focus:outline-none" />
              <button className="btn-primary">Save</button>
            </div>
          </div>
        </div>

        <div className="sharp-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm tracking-tight mb-1">Maximum Voice Attempts</h3>
            <p className="text-sm text-text-secondary">Limit outbound calls per recovery case.</p>
          </div>
          <div className="font-mono text-sm bg-neutral-bg border border-border px-4 py-2">
            2 Calls
          </div>
        </div>

        <div className="sharp-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm tracking-tight mb-1">Strict Opt-out</h3>
            <p className="text-sm text-text-secondary">&quot;Do not contact&quot; intent instantly halts all automation.</p>
          </div>
          <div className="px-3 py-1 bg-recovered-bg text-recovered text-[10px] font-bold uppercase tracking-widest">
            Enforced
          </div>
        </div>
      </div>
    </div>
  );
}
