import { NextResponse } from 'next/server';
import { triggerSarvamOutboundCall } from '@/lib/sarvam';

export async function POST() {
  if (process.env.SARVAM_MOCK_MODE === 'true') {
    return NextResponse.json({ error: 'Cannot run live test in mock mode. Set SARVAM_MOCK_MODE=false first.' }, { status: 400 });
  }

  const recipientNumber = process.env.SARVAM_TEST_RECIPIENT_PHONE_NUMBER;
  if (!recipientNumber || !/^\+[1-9]\d{1,14}$/.test(recipientNumber)) {
    return NextResponse.json({ error: 'SARVAM_TEST_RECIPIENT_PHONE_NUMBER not configured or invalid E.164.' }, { status: 400 });
  }

  // Also validate the agent phone number is configured correctly as E.164
  const agentNumber = process.env.SARVAM_AGENT_PHONE_NUMBER;
  if (!agentNumber || !/^\+[1-9]\d{1,14}$/.test(agentNumber)) {
    return NextResponse.json({ error: 'SARVAM_AGENT_PHONE_NUMBER not configured or invalid E.164.' }, { status: 400 });
  }

  try {
    const result = await triggerSarvamOutboundCall({
      customer_name: 'Operator Test',
      merchant_name: 'Retry Sandbox',
      amount_rupees: 100,
      order_id: 'TEST_ORDER_123',
      failure_reason: 'Testing Sarvam Integration',
      payment_link_url: 'https://rzp.io/i/test1234',
      preferred_language: 'en',
      recovery_case_id: 'test_case_123',
      customer_phone: recipientNumber
    });

    return NextResponse.json({
      success: true,
      message: 'Test call initiated safely to operator number.',
      call_id: result.call_id
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[TEST CALL FAILED]', errorMessage);
    return NextResponse.json({ error: 'Test call failed', details: errorMessage }, { status: 500 });
  }
}
