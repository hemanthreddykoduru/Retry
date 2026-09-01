import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text-primary">
      <div className="bg-neutral-bg border-b border-border py-1.5 px-4 flex flex-wrap items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-secondary gap-4 z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-active font-bold"><span className="w-1.5 h-1.5 rounded-full bg-active animate-pulse"></span> DEMO MODE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Sarvam Mock Mode</span>
          <span className="text-border-strong">•</span>
          <span>Razorpay Test Mode</span>
          <span className="text-border-strong">•</span>
          <span>Payment Links Mock Mode</span>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
