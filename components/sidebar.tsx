import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-[200px] lg:w-[220px] shrink-0 border-r border-border min-h-screen bg-surface hidden md:flex flex-col">
      <div className="h-14 lg:h-16 flex items-center px-4 font-bold text-lg tracking-tight border-b border-border">
        RETRY
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        <Link href="/" className="px-3 py-2 text-sm text-text-primary font-medium bg-neutral-bg border-l-2 border-text-primary">
          Overview
        </Link>
        <Link href="/cases" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary font-medium border-l-2 border-transparent">
          Recovery cases
        </Link>
        <Link href="/integration" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary font-medium border-l-2 border-transparent">
          Integration
        </Link>
        <Link href="/settings" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary font-medium border-l-2 border-transparent">
          Guardrails
        </Link>
      </nav>
    </aside>
  );
}
