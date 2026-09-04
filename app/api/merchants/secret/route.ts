import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get('merchantId');
  
  if (!merchantId) return NextResponse.json({ error: 'Missing merchantId' }, { status: 400 });

  try {
    const result = await sql`SELECT razorpay_webhook_secret FROM merchants WHERE id = ${merchantId}`;
    if (result.length > 0) {
      return NextResponse.json({ secret: result[0].razorpay_webhook_secret });
    }
    return NextResponse.json({ secret: null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { merchantId, secret } = await request.json();
    if (!merchantId || !secret) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await sql`
      UPDATE merchants 
      SET razorpay_webhook_secret = ${secret}
      WHERE id = ${merchantId}
    `;
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
