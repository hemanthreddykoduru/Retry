import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { RecoveryServiceDB } from '@/lib/recovery-service-db';
import { PaymentEventsRepository } from '@/lib/repositories/payment-events';
import { sql } from '@/lib/db';

async function getOrCreateRecoveryCase(payload: any) {
  const notesId = payload.payload?.payment?.entity?.notes?.recovery_case_id || 
                  payload.payload?.payment_link?.entity?.notes?.recovery_case_id;
  if (notesId) return notesId;
  
  const payment = payload.payload?.payment?.entity;
  if (!payment || !payment.contact) {
     return '20000000-0000-0000-0000-000000000003';
  }
  
  const merchantId = '00000000-0000-0000-0000-000000000001';
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
  
  const insertedCase = await sql`
    INSERT INTO recovery_cases (merchant_id, customer_id, amount, trigger_source, root_cause, status)
    VALUES (${merchantId}, ${customerId}, ${payment.amount || 0}, 'payment_failed_webhook', 'insufficient_funds', 'open')
    RETURNING id
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
    const caseId = await getOrCreateRecoveryCase(payload);

    await RecoveryServiceDB.processEvent(caseId, event, { eventId });
    
    await PaymentEventsRepository.markProcessed(inserted.id);
    
    console.info(`razorpay_webhook_processed: ${event}`);
    return NextResponse.json({ ok: true, event });
  } catch (error: unknown) {
    console.error('razorpay_webhook_processing_error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
