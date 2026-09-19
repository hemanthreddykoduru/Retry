import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side: Visuals/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden isolate flex-col justify-between p-12 text-[#17191F]">
        {/* Vibrant Stripe-inspired Mesh Gradient */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-80">
          <div className="absolute top-[-10%] right-[10%] w-[70%] h-[60%] rounded-[100%] bg-pink-400 blur-[100px] opacity-40"></div>
          <div className="absolute top-[20%] left-[10%] w-[60%] h-[70%] rounded-[100%] bg-purple-400 blur-[120px] opacity-40"></div>
          <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] rounded-[100%] bg-orange-400 blur-[100px] opacity-40"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[60%] rounded-[100%] bg-blue-400 blur-[90px] opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent"></div>
        </div>

        <div>
          <Link href="/" className="font-bold text-3xl tracking-tight text-[#17191F] hover:opacity-80 transition-opacity">
            Retry
          </Link>
          <div className="mt-20">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6 leading-[1.05] text-[#17191F]">
              Recover lost revenue<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">effortlessly.</span>
            </h1>
            <p className="text-[#5B6270] text-[19px] font-medium max-w-md leading-relaxed">
              The smartest retry infrastructure for Indian e-commerce. Automatically rescue failed payments without lifting a finger.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-indigo-500" size={26} />
              <span className="text-[#17191F] font-medium text-lg">Bank Downtime Detection</span>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-purple-500" size={26} />
              <span className="text-[#17191F] font-medium text-lg">Native Razorpay Integration</span>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-pink-400" size={26} />
              <span className="text-[#17191F] font-medium text-lg">Vernacular AI Voice Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-[#F7F8FA]">
        <div className="mx-auto w-full max-w-sm lg:max-w-md relative bg-white p-8 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-[#E6E8EC]">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="font-bold text-3xl tracking-tight text-[#17191F]">
              Retry
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
