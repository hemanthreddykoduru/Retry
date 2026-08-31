import { NextResponse } from 'next/server';
import { verifySarvamWebhookSignature, normalizeSarvamCallOutcome } from '@/lib/sarvam';

export async function POST(request: Request) {
  // 1. Read Raw Body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get('X-Sarvam-Signature') || '';

  if (!verifySarvamWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (_) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Idempotency check should happen here via DB (on conflict do nothing)
  const callId = payload.call_id || payload.id;
  console.log(`[DB] Storing raw provider event for call ${callId}`);

  // 2. Normalize Outcome
  const outcome = normalizeSarvamCallOutcome(payload);
  const recoveryCaseId = payload.context?.recovery_case_id;

  if (!recoveryCaseId) {
    return NextResponse.json({ error: 'Missing recovery_case_id in context' }, { status: 400 });
  }

  console.log(`[PROCESS] Received outcome '${outcome}' for case ${recoveryCaseId}`);

  // 3. Process Outcomes (Mocked DB Actions)
  switch (outcome) {
    case 'promise_to_pay':
      console.log(`[DB] Case -> promise_logged. Creating promise row. Scheduling exactly 1 bounded retry.`);
      console.log(`[AUDIT] Promise to pay logged for ${payload.promise_date || 'future date'}.`);
      break;
    case 'link_requested':
      console.log(`[DB] Queuing whatsapp_nudge intervention with payment link.`);
      console.log(`[AUDIT] Customer requested payment link via WhatsApp.`);
      break;
    case 'do_not_contact':
      console.log(`[DB] Customer -> do_not_contact=true. Case -> closed_optout. Canceling queued interventions.`);
      console.log(`[AUDIT] Customer opted out of communications.`);
      break;
    case 'no_answer':
      console.log(`[DB] Increment attempt count. If max -> escalate. Else queue permitted fallback.`);
      console.log(`[AUDIT] Call resulted in no answer.`);
      break;
    case 'customer_refused':
      console.log(`[DB] Case -> closed_lost.`);
      console.log(`[AUDIT] Customer refused to pay.`);
      break;
    case 'failed':
      console.log(`[DB] Queuing whatsapp fallback.`);
      console.log(`[AUDIT] Sarvam call failed gracefully. WhatsApp queued.`);
      break;
    case 'unknown':
    default:
      console.log(`[AUDIT] Unknown outcome received.`);
      break;
  }

  return NextResponse.json({ success: true, processed_outcome: outcome });
}
