"use client";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const form = e.currentTarget;
    const emailValue = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue })
      });
      
      if (res.ok) {
        setEmail(emailValue);
        setStep("code");
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to send reset code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const form = e.currentTarget;
    const code = (form.elements.namedItem('otp_verification') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      
      if (res.ok) {
        setStep("success");
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to reset password');
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
        <p className="text-sm text-text-secondary mt-1">
          {step === "email" && "Enter your email and we'll send you a reset code."}
          {step === "code" && "Enter the 6-digit code sent to your email and a new password."}
          {step === "success" && "Your password has been successfully reset."}
        </p>
      </div>
      
      {step === "success" ? (
        <div className="flex flex-col items-center">
          <div className="bg-recovered-bg border border-recovered/20 text-recovered p-4 rounded-md flex flex-col items-center gap-3 text-center mb-6 w-full">
            <CheckCircle2 size={24} />
            <p className="text-sm font-medium">Password updated successfully!</p>
          </div>
          <Link href="/login" className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors text-center mt-2">
            Return to login
          </Link>
        </div>
      ) : step === "code" ? (
        <form className="flex flex-col" onSubmit={handleUpdatePassword}>
          {/* Autofill traps - invisible to user but catches aggressive password managers */}
          <input type="email" name="fakeusernameremembered" className="hidden" aria-hidden="true" autoComplete="username" />
          <input type="password" name="fakepasswordremembered" className="hidden" aria-hidden="true" autoComplete="current-password" />
          
          {error && <p className="text-red-500 text-sm mb-4 bg-lost-bg p-3 rounded-md border border-lost/20">{error}</p>}
          <FormField label="Verification Code" id="otp_verification" type="text" placeholder="123456" autoComplete="off" required />
          <FormField label="New Password" id="newPassword" type="password" placeholder="••••••••" autoComplete="new-password" required />

          <button type="submit" disabled={loading} className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      ) : (
        <form className="flex flex-col" onSubmit={handleSendEmail}>
          {error && <p className="text-red-500 text-sm mb-4 bg-lost-bg p-3 rounded-md border border-lost/20">{error}</p>}
          <FormField label="Email" id="email" type="email" placeholder="you@company.com" autoComplete="username" required />

          <button type="submit" disabled={loading} className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Sending...' : 'Send reset code'}
          </button>
        </form>
      )}

      {step !== "success" && (
        <div className="mt-8 text-center text-sm text-text-secondary">
          Remember your password? <Link href="/login" className="font-medium text-active hover:underline">Log in</Link>
        </div>
      )}
    </div>
  );
}
