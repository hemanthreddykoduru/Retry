import { NextResponse } from 'next/server';
import { verifySarvamWebhookSignature, normalizeSarvamCallOutcome } from '@/lib/sarvam';
import { RecoveryService } from '@/lib/recovery-service';

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

  // 3. Process Outcomes
  const sarvamEventMap: Record<string, string> = {
    'promise_to_pay': 'sarvam.promise_to_pay',
    'link_requested': 'sarvam.link_requested',
    'do_not_contact': 'sarvam.do_not_contact',
    'no_answer': 'sarvam.no_answer',
    'customer_refused': 'sarvam.customer_refused',
    'failed': 'sarvam.call_failed'
  };

  const internalEvent = sarvamEventMap[outcome] || 'sarvam.unknown';
  
  try {
    RecoveryService.processEvent(recoveryCaseId, internalEvent, { callId, provider_payload: payload });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[PROCESS] Error processing Sarvam outcome: ${error.message}`);
    }
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }

  return NextResponse.json({ success: true, processed_outcome: outcome });
}
