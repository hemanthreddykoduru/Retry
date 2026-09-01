import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    service: "retry",
    status: "ok",
    environment: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'demo' : 'production',
    razorpayWebhookRoute: "configured"
  });
}
