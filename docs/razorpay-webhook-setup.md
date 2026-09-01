# Manual Razorpay Dashboard Setup

1. Open Razorpay Dashboard.
2. Switch to **Test Mode**.
3. Go to **Settings → Webhooks → Add New Webhook**.
4. Set URL:
   `https://retry-buildathon.vercel.app/api/webhooks/razorpay`
5. Create a dedicated strong webhook secret.
6. Save the same secret only as `RAZORPAY_WEBHOOK_SECRET` in Retry’s Vercel environment variables.
7. Redeploy Retry after environment variable changes.
8. Select:
   - `payment.failed`
   - `payment.captured`
   - `order.paid`
   - `payment_link.paid`
   - `payment_link.expired`
   - `payment.downtime.started`
   - `payment.downtime.updated`
   - `payment.downtime.resolved`
9. Use Razorpay “Test Webhook” with `payment.failed`.
10. Check Razorpay delivery response, Vercel function logs, InsForge `payment_events`, and Retry `/cases`.

**Important:**
- NotesBay’s existing webhook remains unchanged.
- Retry uses a second webhook endpoint.
- Both endpoints may receive `order.paid` independently.
- Test-mode configuration must be used with test-mode keys/events.
