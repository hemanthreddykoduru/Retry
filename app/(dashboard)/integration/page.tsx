import { CopyButton } from "@/components/copy-button";

export default function IntegrationPage() {
  return (
    <div className="flex flex-col h-full gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          Developer Tools
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Integration
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        <div className="sharp-card p-6">
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            API Keys (Test Mode)
          </h2>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div>
              <div className="text-text-secondary mb-1">Retry API Key</div>
              <div className="flex justify-between items-center bg-neutral-bg border border-border p-2">
                <span>rk_test_51Nx...8a9B</span>
                <CopyButton text="rk_test_51Nx...8a9B" />
              </div>
            </div>
            <div>
              <div className="text-text-secondary mb-1">Razorpay Webhook Secret</div>
              <div className="flex justify-between items-center bg-neutral-bg border border-border p-2">
                <span>whsec_test_razorpay_mock</span>
                <CopyButton text="whsec_test_razorpay_mock" />
              </div>
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            1. Razorpay Webhook Configuration
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Point your Razorpay test-mode webhooks to this endpoint to allow Retry to listen for failures.
            Subscribe to `payment.failed`, `payment.captured`, and `payment_link.paid`.
          </p>
          <div className="flex justify-between items-center bg-neutral-bg border border-border p-2 font-mono text-sm">
            <span>https://api.retry.inc/v1/razorpay/webhook</span>
            <CopyButton text="https://api.retry.inc/v1/razorpay/webhook" />
          </div>
        </div>

        <div className="sharp-card p-6">
          <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary mb-4 border-b border-border pb-2">
            2. Frontend Abandonment Snippet
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Drop this snippet on your checkout page to track silent network drop-offs where the user never triggers a webhook.
          </p>
          <div className="relative group bg-neutral-bg border border-border p-4 font-mono text-sm">
            <pre className="overflow-x-auto text-text-muted">
{`<script src="https://js.retry.inc/v1/retry.js"></script>
<script>
  Retry.init({ 
    merchant_id: "rk_test_51Nx...8a9B",
    session_timeout: 600 // 10 minutes
  });
</script>`}
            </pre>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={`<script src="https://js.retry.inc/v1/retry.js"></script>\n<script>\n  Retry.init({ merchant_id: "rk_test_51Nx...8a9B" });\n</script>`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
