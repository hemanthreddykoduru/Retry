"use client";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to send reset link');
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
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Reset password</h2>
        <p className="text-sm text-text-secondary mt-1">Enter your email and we'll send you a reset link.</p>
      </div>
      
      {submitted ? (
        <div className="bg-recovered-bg border border-recovered/20 text-recovered p-4 rounded-md flex flex-col items-center gap-3 text-center mb-6">
          <CheckCircle2 size={24} />
          <p className="text-sm font-medium">Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
        </div>
      ) : (
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4 bg-lost-bg p-3 rounded-md border border-lost/20">{error}</p>}
          <FormField label="Email" id="email" type="email" placeholder="you@company.com" required />

          <button type="submit" disabled={loading} className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}

      <div className="mt-8 text-center text-sm text-text-secondary">
        Remember your password? <Link href="/login" className="font-medium text-active hover:underline">Log in</Link>
      </div>
    </div>
  );
}
