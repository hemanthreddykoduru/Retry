import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const args = process.argv.slice(2);
const isInvalidSig = args.includes('--invalid-signature');
const eventIdArgIndex = args.indexOf('--event-id');
let overrideEventId = null;
if (eventIdArgIndex !== -1 && args[eventIdArgIndex + 1]) {
  overrideEventId = args[eventIdArgIndex + 1];
}

const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const webhookUrl = `${baseUrl}/api/webhooks/razorpay`;

if (!secret) {
  console.error("Missing RAZORPAY_WEBHOOK_SECRET in .env.local");
  process.exit(1);
}

const payload = {
  entity: "event",
  account_id: "acc_demo123",
  event: "payment.failed",
  contains: ["payment"],
  payload: {
    payment: {
      entity: {
        id: "pay_test_001",
        amount: 19900,
        currency: "INR",
        status: "failed",
        error_code: "BAD_REQUEST_ERROR",
        error_description: "Payment failed due to mock test",
        notes: {
          recovery_case_id: "20000000-0000-0000-0000-000000000003"
        }
      }
    }
  },
  created_at: Math.floor(Date.now() / 1000),
  id: overrideEventId || `evt_test_${Date.now()}`
};

const rawBody = JSON.stringify(payload);

let signature = crypto
  .createHmac('sha256', secret)
  .update(rawBody)
  .digest('hex');

if (isInvalidSig) {
  signature = "invalid_signature_mock";
}

async function run() {
  console.log(`Sending POST to ${webhookUrl}...`);
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature
    },
    body: rawBody
  });

  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Event: ${payload.event}`);
  
  if (res.ok) {
    const json = JSON.parse(text);
    if (json.duplicate) {
      console.log('Result: duplicate ignored');
    } else {
      console.log('Result: accepted');
    }
  } else {
    console.log(`Result: ${text}`);
  }
}

run().catch(console.error);
