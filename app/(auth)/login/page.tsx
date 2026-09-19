"use client";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.business_name) localStorage.setItem('retry_business_name', body.business_name);
        if (body.name) localStorage.setItem('retry_user_name', body.name);
        if (body.user && body.user.id) localStorage.setItem('retry_merchant_id', body.user.id);
        if (body.user && body.user.email) localStorage.setItem('retry_user_email', body.user.email);
        window.location.href = '/dashboard';
      } else {
        const err = await res.json();
        setError(err.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[#17191F]">Welcome back</h2>
        <p className="text-sm text-[#5B6270] mt-1">Sign in to your account to continue.</p>
      </div>
      
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <FormField label="Email" id="email" type="email" placeholder="you@company.com" required />
        <FormField label="Password" id="password" type="password" required />

        {error && <p className="text-[#C33D3D] text-sm mb-4">{error}</p>}
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded border-[#E6E8EC] text-[#635BFF] focus:ring-[#635BFF]" />
            <label htmlFor="remember" className="text-sm text-[#5B6270]">Remember me</label>
          </div>
          <Link href="/forgot-password" className="text-sm font-medium text-[#635BFF] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#635BFF] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#635BFF]/90 transition-colors shadow-sm disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E6E8EC]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[#858B98]">Or continue with</span>
          </div>
        </div>

        <Link href="/api/auth/google" className="w-full border border-[#E6E8EC] bg-white text-[#17191F] py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#F7F8FA] transition-colors shadow-sm"><FaGoogle size={16} className="text-[#5B6270]"/> Sign in with Google</Link>
        <Link href="/api/auth/github" className="w-full border border-[#E6E8EC] bg-white text-[#17191F] py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#F7F8FA] transition-colors shadow-sm mt-2"><FaGithub size={16} className="text-[#5B6270]"/> Sign in with GitHub</Link>
        
        {/* Demo workspace handler */}
        <button 
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('retry_business_name', 'Testing Business');
              localStorage.setItem('retry_user_email', 'founder@testingbusiness.com');
              localStorage.setItem('retry_merchant_id', 'm_demo_123');
              window.location.href = '/dashboard';
            }
          }} 
          className="w-full border border-[#E6E8EC] bg-white text-[#17191F] py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#F7F8FA] transition-colors shadow-sm"
        >
          Demo workspace (Test data)
        </button>

        <p className="text-center text-sm text-[#5B6270] mt-2">
          Don&apos;t have an account? <Link href="/signup" className="font-medium text-[#635BFF] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
