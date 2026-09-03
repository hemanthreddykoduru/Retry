import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side: Visuals/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-text-primary flex-col justify-between p-12 text-surface">
        <div>
          <Link href="/" className="font-bold text-3xl tracking-tight hover:opacity-80 transition-opacity">
            RETRY
          </Link>
          <div className="mt-20">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">Recover lost revenue<br />effortlessly.</h1>
            <p className="text-neutral-bg/80 text-lg max-w-md">
              The smartest retry infrastructure for Indian e-commerce. Automatically rescue failed payments without lifting a finger.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-active" size={24} />
              <span className="text-neutral-bg font-medium text-lg">Bank Downtime Detection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-active" size={24} />
              <span className="text-neutral-bg font-medium text-lg">Native Razorpay Integration</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-active" size={24} />
              <span className="text-neutral-bg font-medium text-lg">Vernacular AI Voice Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-surface">
        <div className="mx-auto w-full max-w-sm lg:max-w-md relative">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="font-bold text-3xl tracking-tight text-text-primary">
              RETRY
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
