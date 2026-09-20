import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Strip removed for hackathon submission */}

      <header className="flex justify-between items-center p-6 lg:px-12 bg-transparent sticky top-0 z-10 transition-colors backdrop-blur-md bg-white/80 border-b border-[#E6E8EC]">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#17191F]">Retry</Link>
        <nav className="hidden md:flex gap-8 text-[15px] font-medium text-[#5B6270]">
          <Link href="/features" className="hover:text-[#17191F] transition-colors">Features</Link>
          <Link href="/how-it-works" className="hover:text-[#17191F] transition-colors">How it works</Link>
          <Link href="/pricing" className="hover:text-[#17191F] transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-6 text-[15px] font-medium">
          <Link href="/login" className="text-[#5B6270] hover:text-[#17191F] transition-colors">Log in</Link>
          <Link href="/signup" className="bg-[#635BFF] text-white px-4 py-2 rounded-none shadow-sm hover:bg-[#635BFF]/90 transition-colors">Sign up</Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-surface p-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
        <div>© 2026 Retry. Smarter second attempts.</div>
        <div className="flex gap-6">
          <Link href="/agents.md" className="hover:text-text-primary">Agent documentation</Link>
          <Link href="/llms.txt" className="hover:text-text-primary">LLM index</Link>
          <a href="https://retry-testing.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary">Judge demo</a>
          <a href="https://github.com/hemanthreddykoduru/Retry" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
