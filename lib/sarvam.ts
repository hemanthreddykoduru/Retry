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
    (!!process.env.SARVAM_API_KEY && !!process.env.SARVAM_ORG_ID && !!process.env.SARVAM_WORKSPACE_ID && !!process.env.SARVAM_APP_ID);
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
  const baseUrl = process.env.SARVAM_API_BASE_URL || 'https://apps.sarvam.ai/api';
  const orgId = process.env.SARVAM_ORG_ID;
  const workspaceId = process.env.SARVAM_WORKSPACE_ID;
  
  if (!orgId || !workspaceId) {
    throw new Error('Sarvam configuration missing orgId or workspaceId');
  }

  const apiUrl = `${baseUrl}/outbounds/v1/orgs/${orgId}/workspaces/${workspaceId}/outbounds`;
  
  const payload = {
    app_config: {
      app_id: process.env.SARVAM_APP_ID,
      app_version: parseInt(process.env.SARVAM_APP_VERSION || '1', 10),
      connection_config: {
        connection_id: process.env.SARVAM_CONNECTION_ID,
        agent_phone_number: process.env.SARVAM_AGENT_PHONE_NUMBER
      },
      webhook_config: {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://retry-buildathon.vercel.app'}/api/webhooks/sarvam`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SARVAM_WEBHOOK_SECRET}`
        }
      }
    },
    user_config: {
      user_phone_number: input.customer_phone,
      variables: {
        customer_name: input.customer_name,
        merchant_name: input.merchant_name,
        amount: input.amount_rupees.toString(),
        reason: input.failure_reason,
        payment_link: input.payment_link_url,
        language: input.preferred_language,
        case_id: input.recovery_case_id
      }
    }
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.SARVAM_API_KEY || ''
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam API Failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  return {
    call_id: data.attempt_id || data.id || `mock_call_${Date.now()}`,
    status: 'queued'
  };
}

import { timingSafeEqual } from 'crypto';

export function verifySarvamWebhookAuth(authHeader: string | null): boolean {
  if (process.env.SARVAM_MOCK_MODE === 'true') return true;
  
  const secret = process.env.SARVAM_WEBHOOK_SECRET;
  if (!secret || !authHeader) return false;

  const expectedHeader = `Bearer ${secret}`;
  
  // Timing-safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(authHeader);
    const b = Buffer.from(expectedHeader);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
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
