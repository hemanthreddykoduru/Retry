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
        
        <div className="bg-surface/10 p-6 rounded-lg backdrop-blur-sm border border-surface/20 max-w-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 text-surface/10 text-9xl font-serif">"</div>
          <p className="text-surface font-medium mb-6 relative z-10">"Retry completely changed how we handle payment drops. We recovered ₹48,620 in our first week alone with zero manual effort."</p>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-active rounded-full flex items-center justify-center font-bold text-text-primary">JD</div>
            <div>
              <div className="font-bold text-sm">John Doe</div>
              <div className="text-xs text-neutral-bg/70 uppercase tracking-wider mt-0.5">Founder, NotesBay</div>
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
