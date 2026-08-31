import { NextResponse } from 'next/server';
import { checkVoiceGuardrails } from '@/lib/guardrails';
import { triggerSarvamOutboundCall } from '@/lib/sarvam';
import { mockCases, mockCustomers } from '@/lib/demo-data';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // MOCK DATA LOAD
  const recoveryCase = mockCases.find(c => c.id === id);
  if (!recoveryCase) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  const customer = mockCustomers.find(c => c.id === recoveryCase.customer_id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  // Count current voice calls (mock logic)
  const voiceCallInterventions = (recoveryCase.interventions || []).filter(i => i.type === 'voice_call');
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

  // 2. Queue Intervention (Mocking DB insert)
  console.log(`[DB] Queuing voice_call intervention for case ${id}`);

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
    console.error(`[AUDIT] sarvam.call_failed -> fallback.whatsapp_queued. Error: ${errorMessage}`);
    // Queue whatsapp fallback (Mocking DB insert)
    return NextResponse.json({
      success: false,
      error: 'Provider failure',
      fallback_triggered: 'whatsapp_nudge'
    }, { status: 502 });
  }
}
