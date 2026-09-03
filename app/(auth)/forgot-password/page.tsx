"use client";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
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
