export default function ContactPage() {
  return (
    <div className="flex flex-col gap-16 py-24 max-w-2xl mx-auto px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Get in touch.</h1>
        <p className="text-lg text-text-secondary">
          Whether you have questions about integration, pricing, or the Sarvam AI voice models, our team is here to help.
        </p>
      </div>

      <form className="sharp-card p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Name</label>
          <input type="text" className="bg-surface border border-border px-4 py-3 font-mono text-sm focus:outline-none" placeholder="Jane Doe" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Email</label>
          <input type="email" className="bg-surface border border-border px-4 py-3 font-mono text-sm focus:outline-none" placeholder="jane@company.com" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Message</label>
          <textarea className="bg-surface border border-border px-4 py-3 font-mono text-sm min-h-[150px] focus:outline-none" placeholder="How can we help?"></textarea>
        </div>

        <button className="btn-primary mt-2">Send Message</button>
      </form>
    </div>
  );
}
