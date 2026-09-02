import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { RecoveryServiceDB } from '@/lib/recovery-service-db';
import { PaymentEventsRepository } from '@/lib/repositories/payment-events';
import { sql } from '@/lib/db';

async function getOrCreateRecoveryCase(payload: any, merchantId: string) {
  const notesId = payload.payload?.payment?.entity?.notes?.recovery_case_id || 
                  payload.payload?.payment_link?.entity?.notes?.recovery_case_id;
  if (notesId) return notesId;
  
  const payment = payload.payload?.payment?.entity;
  if (!payment || !payment.contact) {
     return '20000000-0000-0000-0000-000000000003';
  }
  
  let phone = payment.contact;
  if (!phone.startsWith('+')) {
    phone = '+' + phone;
  }
  
  const existingCustomers = await sql`SELECT id FROM customers WHERE phone = ${phone} AND merchant_id = ${merchantId}`;
  let customerId;
  if (existingCustomers.length > 0) {
    customerId = existingCustomers[0].id;
  } else {
    const inserted = await sql`
      INSERT INTO customers (merchant_id, name, phone, preferred_language, do_not_contact)
      VALUES (${merchantId}, ${payment.email || 'Unknown User'}, ${phone}, 'en', false)
      RETURNING id
    `;
    customerId = inserted[0].id;
  }
  
  const failureCode = payment.error_code || null;
  const failureReason = payment.error_description || payment.error_reason || null;
  
  // Basic root cause mapping
  let rootCause = 'unknown';
  if (failureCode?.includes('BAD_REQUEST') || failureReason?.includes('bank')) rootCause = 'bank_downtime';
  else if (failureCode?.includes('INSUFFICIENT')) rootCause = 'insufficient_funds';
  else if (failureReason?.includes('network') || failureReason?.includes('timeout')) rootCause = 'network_drop';

  const insertedCase = await sql`
    INSERT INTO recovery_cases (merchant_id, customer_id, amount, trigger_source, failure_code, failure_reason, root_cause, status)
    VALUES (${merchantId}, ${customerId}, ${payment.amount || 0}, 'payment_failed_webhook', ${failureCode}, ${failureReason}, ${rootCause}, 'open')
    RETURNING id
  `;
  
  const date = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO daily_metrics (merchant_id, date, failures_detected, cases_opened, amount_at_risk, cases_recovered, amount_recovered, calls_placed, whatsapps_sent, optouts)
    VALUES (${merchantId}, ${date}::date, 1, 1, ${payment.amount || 0}, 0, 0, 0, 0, 0)
    ON CONFLICT (merchant_id, date)
    DO UPDATE SET 
      failures_detected = daily_metrics.failures_detected + 1,
      cases_opened = daily_metrics.cases_opened + 1,
      amount_at_risk = daily_metrics.amount_at_risk + EXCLUDED.amount_at_risk
  `;
  
  return insertedCase[0].id;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) {
      console.warn('razorpay_webhook_rejected: signature_missing');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const rawBody = await request.text();

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('razorpay_webhook_configuration_error: secret_missing');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const valid =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );

    if (!valid) {
      console.warn('razorpay_webhook_rejected: signature_invalid');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.warn('razorpay_webhook_rejected: payload_malformed');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Razorpay sends event ID in headers, or we can fallback to the payment/order ID for idempotency
    const eventId = request.headers.get('x-razorpay-event-id') || 
                   payload.payload?.payment?.entity?.id || 
                   payload.payload?.order?.entity?.id;
                   
    if (!eventId) {
      console.warn('razorpay_webhook_rejected: missing_event_id');
      return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
    }

    const event = payload.event;
    
    // Store in payment_events first for idempotency
    const inserted = await PaymentEventsRepository.insert({
      razorpay_event_id: eventId,
      event_type: event,
      payload: payload
    });

    if (!inserted) {
      console.info('razorpay_webhook_duplicate_ignored');
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Generate or fetch the case dynamically from the webhook payload
    const { searchParams } = new URL(request.url);
    let merchantId = searchParams.get('merchantId') || '00000000-0000-0000-0000-000000000001';
    
    // Validate UUID format, if invalid fallback to demo
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(merchantId)) {
      merchantId = '00000000-0000-0000-0000-000000000001';
    }

    const caseId = await getOrCreateRecoveryCase(payload, merchantId);

    await RecoveryServiceDB.processEvent(caseId, event, { eventId });
    
    await PaymentEventsRepository.markProcessed(inserted.id);
    
    console.info(`razorpay_webhook_processed: ${event}`);
    return NextResponse.json({ ok: true, event });
  } catch (error: unknown) {
    console.error('razorpay_webhook_processing_error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
