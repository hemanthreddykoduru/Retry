import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block font-bold text-2xl tracking-tight text-text-primary mb-6">
            RETRY
          </Link>
        </div>
        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
