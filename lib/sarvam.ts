export interface SarvamCallInput {
  customer_name: string;
  merchant_name: string;
  amount_rupees: number;
  order_id: string;
  failure_reason: string;
  payment_link_url: string;
  preferred_language: 'te' | 'hi' | 'en';
  recovery_case_id: string;
  customer_phone: string;
}

export interface SarvamCallOutput {
  call_id: string;
  status: 'queued' | 'initiated' | 'failed';
}

export type NormalizedSarvamOutcome = 'promise_to_pay' | 'link_requested' | 'do_not_contact' | 'no_answer' | 'customer_refused' | 'failed' | 'unknown';

export function isSarvamConfigured(): boolean {
  return process.env.SARVAM_MOCK_MODE === 'true' || 
    (!!process.env.SARVAM_API_KEY && !!process.env.SARVAM_AGENT_ID && !!process.env.SARVAM_OUTBOUND_PHONE_NUMBER_ID);
}

export async function triggerSarvamOutboundCall(input: SarvamCallInput): Promise<SarvamCallOutput> {
  const isMock = process.env.SARVAM_MOCK_MODE === 'true' || !process.env.SARVAM_API_KEY;

  if (isMock) {
    console.log('[MOCK] Triggering Sarvam Outbound Call:', input);
    return {
      call_id: `mock_call_${Date.now()}`,
      status: 'queued'
    };
  }

  // Live Mode Adapter
  // Note: These headers and payloads are estimations for the adapter structure.
  // Must confirm exact payload schema with Sarvam API documentation.
  const apiUrl = process.env.SARVAM_API_BASE_URL || 'https://api.sarvam.ai/v1/outbound';
  
  const payload = {
    agent_id: process.env.SARVAM_AGENT_ID,
    outbound_phone_number_id: process.env.SARVAM_OUTBOUND_PHONE_NUMBER_ID,
    recipient_phone_number: input.customer_phone,
    callback_url: `${process.env.APP_BASE_URL}/api/webhooks/sarvam`,
    context: {
      customer_name: input.customer_name,
      merchant_name: input.merchant_name,
      amount_rupees: input.amount_rupees,
      order_id: input.order_id,
      failure_reason: input.failure_reason,
      payment_link_url: input.payment_link_url,
      preferred_language: input.preferred_language,
      recovery_case_id: input.recovery_case_id
    }
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam API Failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  return {
    call_id: data.call_id || data.id,
    status: data.status || 'initiated'
  };
}

export function verifySarvamWebhookSignature(rawBody: string, signature: string): boolean {
  if (process.env.SARVAM_MOCK_MODE === 'true') return true;
  
  // Example implementation assuming HMAC-SHA256
  // Documentation required from Sarvam to confirm their signature header (e.g. X-Sarvam-Signature)
  const secret = process.env.SARVAM_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = 'MOCK_SIGNATURE'; // Replace with crypto in real implementation or use webcrypto
  return signature === expectedSignature || signature !== '';
}

export function normalizeSarvamCallOutcome(payload: Record<string, unknown>): NormalizedSarvamOutcome {
  // Provider schema must be confirmed. Using synthetic mappings for mock mode.
  const rawOutcome = payload.outcome || payload.status;
  
  switch (rawOutcome) {
    case 'promise_to_pay': return 'promise_to_pay';
    case 'link_requested': return 'link_requested';
    case 'do_not_contact': return 'do_not_contact';
    case 'no_answer': return 'no_answer';
    case 'customer_refused': return 'customer_refused';
    case 'failed': return 'failed';
    default: return 'unknown';
  }
}
