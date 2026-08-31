import Link from "next/link";
import { FormField } from "@/components/form-field";

export default function LoginPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Welcome back</h2>
        <p className="text-sm text-text-secondary mt-1">Sign in to your account to continue.</p>
      </div>
      
      <form className="flex flex-col" action="/dashboard">
        <FormField label="Email" id="email" type="email" placeholder="you@company.com" required />
        <FormField label="Password" id="password" type="password" required />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded border-border text-active focus:ring-active" />
            <label htmlFor="remember" className="text-sm text-text-secondary">Remember me</label>
          </div>
          <Link href="/forgot-password" className="text-sm font-medium text-active hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors">
          Log in
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
