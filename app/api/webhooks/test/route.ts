import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { merchantId, secret, appUrl } = await request.json();
    
    const payload = {
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: `pay_test_${Math.random().toString(36).substring(7)}`,
            amount: 50000,
            currency: "INR",
            status: "failed",
            order_id: `order_test_${Math.random().toString(36).substring(7)}`,
            error_code: "BAD_REQUEST_ERROR",
            error_description: "Payment failed due to bank downtime",
            error_source: "bank",
            error_reason: "bank_downtime",
            contact: "+919876543210",
            email: "test@example.com"
          }
        }
      }
    };

    const body = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    const response = await fetch(`${appUrl}/api/webhooks/razorpay?merchantId=${merchantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': signature
      },
      body
    });

    if (!response.ok) {
      console.error("Test webhook failed:", await response.text());
      return NextResponse.json({ error: 'Failed to send test webhook' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
