# Sarvam Live Setup

To transition from the mock Sarvam agent to live outbound test calls:

1. Obtain a **Sarvam API Key** from your Sarvam console.
2. Create an **Agent** configured for Outbound Sales/Recovery in Hindi, Telugu, or English.
3. Retrieve your **Agent ID**.
4. Set up an ngrok or production URL to receive the Sarvam webhook callback at `https://your-domain.com/api/webhooks/sarvam`.
5. Register this callback URL in your Sarvam agent settings.
6. Update your `.env.local` file:
   ```env
   SARVAM_MOCK_MODE=false
   SARVAM_API_KEY=your_live_key
   SARVAM_AGENT_ID=your_agent_id
   SARVAM_WEBHOOK_SECRET=your_webhook_secret
   ```
7. Restart your Next.js server. Future `voice_call` interventions will trigger live HTTP requests to the Sarvam API instead of resolving immediately through the mock store.
