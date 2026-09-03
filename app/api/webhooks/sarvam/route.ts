import { NextResponse } from 'next/server';
import { verifySarvamWebhookAuth, normalizeSarvamCallOutcome } from '@/lib/sarvam';
import { RecoveryServiceDB } from '@/lib/recovery-service-db';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!verifySarvamWebhookAuth(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawBody = await request.text();

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (_) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const attemptId = payload.attempt_id || payload.call_id;
  if (!attemptId) {
    return NextResponse.json({ error: 'Missing attempt_id' }, { status: 400 });
  }

  console.log(`[Sarvam Webhook] Processing callback for attempt_id: ${attemptId}`);

  // Correlate using attempt_id
  const interventions = await sql`
    SELECT id, recovery_case_id, status 
    FROM interventions 
    WHERE metadata->>'attempt_id' = ${attemptId}
    LIMIT 1
  `;

  if (interventions.length === 0) {
    console.error(`[Sarvam Webhook] Unrecognized attempt_id: ${attemptId}`);
    return NextResponse.json({ error: 'Intervention not found' }, { status: 404 });
  }

  const intervention = interventions[0];
  const recoveryCaseId = intervention.recovery_case_id;

  // Check terminal state
  const cases = await sql`SELECT status FROM recovery_cases WHERE id = ${recoveryCaseId}`;
  if (cases.length > 0 && ['recovered', 'closed', 'opted_out', 'do_not_contact'].includes(cases[0].status)) {
    console.log(`[Sarvam Webhook] Case ${recoveryCaseId} is already terminal (${cases[0].status}). Ignoring duplicate/late callback.`);
    return NextResponse.json({ success: true, message: 'Case already terminal' });
  }

  const outcome = normalizeSarvamCallOutcome(payload);
  
  // Update intervention status and store full response
  await sql`
    UPDATE interventions 
    SET status = ${outcome === 'unknown' ? 'completed' : outcome}, 
        metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{sarvam_response}', ${JSON.stringify(payload)}::jsonb)
    WHERE id = ${intervention.id}
  `;

  const sarvamEventMap: Record<string, string> = {
    'promise_to_pay': 'sarvam.promise_to_pay',
    'link_requested': 'sarvam.link_requested',
    'do_not_contact': 'sarvam.do_not_contact',
    'opt_out': 'sarvam.do_not_contact',
    'no_answer': 'sarvam.no_answer',
    'customer_refused': 'sarvam.customer_refused',
    'failed': 'sarvam.call_failed'
  };

  const internalEvent = sarvamEventMap[outcome] || 'sarvam.unknown';
  
  try {
    await RecoveryServiceDB.processEvent(recoveryCaseId, internalEvent, { attemptId, provider_payload: payload });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[PROCESS] Error processing Sarvam outcome: ${error.message}`);
    }
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }

  return NextResponse.json({ success: true, processed_outcome: outcome, attempt_id: attemptId });
}
