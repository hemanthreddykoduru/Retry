import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Strip */}
      <div className="w-full bg-surface border-b border-border py-2 px-4 text-center text-xs font-mono text-text-secondary uppercase tracking-widest flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-waiting animate-pulse"></span>
        Built for <span className="bg-[#facc15] text-[#854d0e] font-bold px-1.5 py-0.5 rounded-sm">Razorpay test-mode</span> recovery workflows
      </div>

      <header className="flex justify-between items-center p-6 lg:px-12 border-b border-border bg-surface sticky top-0 z-10">
        <Link href="/" className="font-bold text-xl tracking-tight">RETRY</Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-text-secondary">
          <Link href="/features" className="hover:text-text-primary">Features</Link>
          <Link href="/how-it-works" className="hover:text-text-primary">How it works</Link>
          <Link href="/pricing" className="hover:text-text-primary">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-text-secondary hover:text-text-primary">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up</Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-surface p-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
        <div>© 2026 Retry. Smarter second attempts.</div>
        <div className="flex gap-6">
          <Link href="/features" className="hover:text-text-primary">Features</Link>
          <Link href="/how-it-works" className="hover:text-text-primary">How it works</Link>
          <Link href="/pricing" className="hover:text-text-primary">Pricing</Link>
          <Link href="/contact" className="hover:text-text-primary">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
