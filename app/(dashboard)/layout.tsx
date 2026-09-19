import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text-primary">
      <div className="bg-[#FFFFFF] border-b border-[#E6E8EC] py-2 px-6 flex flex-wrap items-center justify-between text-xs font-medium text-[#5B6270] gap-4 z-20">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[#1769E0] font-semibold bg-[#EDF5FF] px-2 py-0.5 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-[#1769E0] animate-pulse"></span> Demo Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Sarvam Mock Mode</span>
          <span className="text-[#D1D5DB]">•</span>
          <span className="bg-[#FFF4E5] text-[#B55D00] font-medium px-2 py-0.5 rounded-md border border-[#FDE68A]">Razorpay Test Mode</span>
          <span className="text-[#D1D5DB]">•</span>
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
