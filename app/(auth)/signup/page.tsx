import Link from "next/link";
import { FormField } from "@/components/form-field";

export default function SignupPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Start recovering revenue</h2>
        <p className="text-sm text-text-secondary mt-1">Create your Retry account.</p>
      </div>
      
      <form className="flex flex-col" action="/verify-email">
        <FormField label="Full name" id="name" required />
        <FormField label="Business/merchant name" id="business_name" required />
        <FormField label="Work email" id="email" type="email" placeholder="you@company.com" required />
        <FormField label="Password" id="password" type="password" required />
        <FormField label="Confirm password" id="confirm_password" type="password" required />
        
        <div className="flex items-start gap-2 mb-6 mt-2">
          <input type="checkbox" id="terms" required className="mt-1 rounded border-border text-active focus:ring-active" />
          <label htmlFor="terms" className="text-sm text-text-secondary leading-snug">
            I agree to the <Link href="#" className="text-active hover:underline">Terms of Service</Link> and <Link href="#" className="text-active hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <button type="submit" className="w-full bg-text-primary text-surface py-2 rounded-md font-medium text-sm hover:bg-text-primary/90 transition-colors">
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account? <Link href="/login" className="font-medium text-active hover:underline">Log in</Link>
      </p>
    </div>
  );
}
