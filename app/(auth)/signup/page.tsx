"use client";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // OTP flow state
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    password: ''
  });

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const business_name = (form.elements.namedItem('business_name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirm_password = (form.elements.namedItem('confirm_password') as HTMLInputElement).value;

    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setFormData({ name, business_name, email, password });
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, business_name, email, password })
      });
      const body = await res.json();
      
      if (res.ok) {
        if (body.requireEmailVerification) {
          setRequiresOtp(true);
        } else {
          if (body.business_name) localStorage.setItem('retry_business_name', body.business_name);
          if (body.name) localStorage.setItem('retry_user_name', body.name);
          window.location.href = '/dashboard';
        }
      } else {
        setError(body.error || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const otp = (form.elements.namedItem('otp') as HTMLInputElement).value.trim();
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp,
          name: formData.name,
          business_name: formData.business_name,
          password: formData.password
        })
      });
      const body = await res.json();
      
      if (res.ok) {
        if (body.business_name) localStorage.setItem('retry_business_name', body.business_name);
        if (body.name) localStorage.setItem('retry_user_name', body.name);
        if (body.user && body.user.id) localStorage.setItem('retry_merchant_id', body.user.id);
        if (body.user && body.user.email) localStorage.setItem('retry_user_email', body.user.email);
        window.location.href = '/dashboard';
      } else {
        setError(body.error || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (requiresOtp) {
    return (
      <div className="flex flex-col">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">Check your email</h2>
          <p className="text-sm text-text-secondary mt-1">We sent a verification code to {formData.email}</p>
        </div>
        
        <form className="flex flex-col" onSubmit={handleOtpSubmit}>
          <FormField label="Verification Code (OTP)" id="otp" type="text" required placeholder="Enter 6-digit code" />
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Start recovering revenue</h2>
        <p className="text-sm text-text-secondary mt-1">Create your Retry account.</p>
      </div>
      
      <form className="flex flex-col" onSubmit={handleSignupSubmit}>
        <FormField label="Full name" id="name" required />
        <FormField label="Business/merchant name" id="business_name" required />
        <FormField label="Work email" id="email" type="email" placeholder="you@company.com" required />
        <FormField label="Password" id="password" type="password" required />
        <FormField label="Confirm password" id="confirm_password" type="password" required />
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="flex items-start gap-2 mb-6 mt-2">
          <input type="checkbox" id="terms" required className="mt-1 rounded border-border text-active focus:ring-active" />
          <label htmlFor="terms" className="text-sm text-text-secondary leading-snug">
            I agree to the <Link href="#" className="text-active hover:underline">Terms of Service</Link> and <Link href="#" className="text-active hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors disabled:opacity-50">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account? <Link href="/login" className="font-medium text-active hover:underline">Log in</Link>
      </p>
    </div>
  );
}
