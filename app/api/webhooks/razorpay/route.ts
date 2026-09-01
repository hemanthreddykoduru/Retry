import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { RecoveryServiceDB } from '@/lib/recovery-service-db';
import { PaymentEventsRepository } from '@/lib/repositories/payment-events';

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

    // In a real system, we'd map razorpay order_id/payment_id to internal case_id.
    // For demo, we just extract it from notes or use a default test case.
    const caseId = payload.payload?.payment?.entity?.notes?.recovery_case_id || 
                   payload.payload?.payment_link?.entity?.notes?.recovery_case_id ||
                   '20000000-0000-0000-0000-000000000003'; // Fallback to main demo case (uuid instead of rc_c931)

    await RecoveryServiceDB.processEvent(caseId, event, { eventId });
    
    await PaymentEventsRepository.markProcessed(inserted.id);
    
    console.info(`razorpay_webhook_processed: ${event}`);
    return NextResponse.json({ ok: true, event });
  } catch (error: unknown) {
    console.error('razorpay_webhook_processing_error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
