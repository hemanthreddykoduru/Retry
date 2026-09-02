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
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Welcome back</h2>
        <p className="text-sm text-text-secondary mt-1">Sign in to your account to continue.</p>
      </div>
      
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <FormField label="Email" id="email" type="email" placeholder="you@company.com" required />
        <FormField label="Password" id="password" type="password" required />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded border-border text-active focus:ring-active" />
            <label htmlFor="remember" className="text-sm text-text-secondary">Remember me</label>
          </div>
          <Link href="/forgot-password" className="text-sm font-medium text-active hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-text-muted">Or continue with</span>
          </div>
        </div>

        <Link href="/api/auth/google" className="w-full border border-border bg-surface text-text-primary py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-neutral-bg transition-colors"><FaGoogle size={16} className="mr-2"/> Sign in with Google</Link>
        <Link href="/api/auth/github" className="w-full border border-border bg-surface text-text-primary py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-neutral-bg transition-colors mt-2"><FaGithub size={16} className="mr-2"/> Sign in with GitHub</Link>
        
        {/* TODO: Add actual OAuth handler */}
        <Link href="/dashboard" className="w-full border border-border bg-surface text-text-primary py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-neutral-bg transition-colors">
          Demo workspace (Test data)
        </Link>

        <p className="text-center text-sm text-text-secondary mt-2">
          Don&apos;t have an account? <Link href="/signup" className="font-medium text-active hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
