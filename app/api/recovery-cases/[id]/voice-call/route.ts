import { NextResponse } from 'next/server';
import { checkVoiceGuardrails } from '@/lib/guardrails';
import { triggerSarvamOutboundCall } from '@/lib/sarvam';
import { sql } from '@/lib/db';
import { RecoveryCase, Customer } from '@/lib/demo-data';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Real DB LOAD
  const cases = await sql`SELECT * FROM recovery_cases WHERE id = ${id}`;
  if (cases.length === 0) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  const recoveryCase = cases[0] as unknown as RecoveryCase;

  const customers = await sql`SELECT * FROM customers WHERE id = ${recoveryCase.customer_id}`;
  if (customers.length === 0) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  const customer = customers[0] as unknown as Customer;

  // Count current voice calls
  const interventions = await sql`SELECT * FROM interventions WHERE recovery_case_id = ${id}`;
  const voiceCallInterventions = interventions.filter(i => i.type === 'voice_call');
  const currentInterventionCount = voiceCallInterventions.length;

  // 1. Guardrails Check
  const decision = checkVoiceGuardrails(recoveryCase, customer, 50000, currentInterventionCount);
  
  if (!decision.allowed) {
    // Audit log should be written here in a real db
    console.log(`[AUDIT] Voice call blocked by guardrails: ${decision.reasons.join(', ')}`);
    return NextResponse.json({ 
      error: 'Blocked by guardrails', 
      reasons: decision.reasons 
    }, { status: 409 });
  }

  // 2. Queue Intervention
  console.log(`[DB] Queuing voice_call intervention for case ${id}`);
  
  await sql`
    INSERT INTO interventions (recovery_case_id, type, status, scheduled_for)
    VALUES (${id}, 'voice_call', 'pending', ${new Date().toISOString()})
  `;

  // 3. Trigger Sarvam
  try {
    const sarvamResult = await triggerSarvamOutboundCall({
      customer_name: customer.name || 'Valued Customer',
      merchant_name: 'Retry Demo Merchant',
      amount_rupees: recoveryCase.amount / 100,
      order_id: recoveryCase.checkout_session_id || 'ORD_UNKNOWN',
      failure_reason: recoveryCase.failure_reason || 'Unknown issue',
      payment_link_url: 'https://rzp.io/i/demo123',
      preferred_language: customer.preferred_language,
      recovery_case_id: recoveryCase.id,
      customer_phone: customer.phone
    });

    console.log(`[AUDIT] Voice call initiated via Sarvam. Call ID: ${sarvamResult.call_id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Voice call initiated safely.',
      call_status: sarvamResult.status,
      demo_mode: process.env.SARVAM_MOCK_MODE === 'true'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[AUDIT] sarvam.call_failed -> manual_payment_link_follow_up_required. Error: ${errorMessage}`);
    
    await sql`
      INSERT INTO interventions (recovery_case_id, type, status, scheduled_for, metadata)
      VALUES (
        ${id}, 
        'payment_link_follow_up', 
        'pending', 
        ${new Date().toISOString()}, 
        ${sql.json({ reason: 'sarvam.call_failed', fallback_triggered: 'payment_link_follow_up' })}
      )
    `;
    
    return NextResponse.json({
      success: false,
      error: 'Provider failure',
      fallback_triggered: 'payment_link_follow_up'
    }, { status: 502 });
  }
}
