# Razorpay Webhook Setup

To connect Retry to a live Razorpay test-mode account:

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Ensure you are in **Test Mode**.
3. Navigate to **Account & Settings** > **Webhooks**.
4. Click **Add New Webhook**.
5. Set the **Webhook URL** to your hosted production domain or ngrok tunnel: `https://your-domain.com/api/webhooks/razorpay`
6. Enter a strong **Secret** (e.g., `whsec_test_...`) and save it in your `.env.local` as `RAZORPAY_WEBHOOK_SECRET`.
7. **Select Events:**
   - `payment.failed`
   - `payment.authorized`
   - `payment.captured`
   - `payment_link.paid`
8. Click **Save Webhook**.

Your test-mode payment failures will now automatically stream into the Retry engine.
