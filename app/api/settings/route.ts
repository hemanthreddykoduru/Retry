import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const merchantId = request.headers.get('x-merchant-id') || '00000000-0000-0000-0000-000000000001';
    const res = await sql`SELECT voice_call_threshold, policies FROM merchants WHERE id = ${merchantId}`;
    if (!res.length) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }
    const policies = res[0].policies || {};
    return NextResponse.json({
      threshold: (res[0].voice_call_threshold / 100).toString(),
      maxAttempts: policies.maxAttempts || "2",
      startTime: policies.startTime || "09:00",
      endTime: policies.endTime || "21:00",
      delayMinutes: policies.delayMinutes || "5",
      enforceDND: policies.enforceDND !== undefined ? policies.enforceDND : true,
      suppressDowntime: policies.suppressDowntime !== undefined ? policies.suppressDowntime : true,
      exactAmountOnly: policies.exactAmountOnly !== undefined ? policies.exactAmountOnly : true,
      escalateFailures: policies.escalateFailures !== undefined ? policies.escalateFailures : true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const merchantId = request.headers.get('x-merchant-id') || '00000000-0000-0000-0000-000000000001';
    const data = await request.json();
    const thresholdPaise = parseInt(data.threshold || '500') * 100;
    
    const policies = {
      maxAttempts: data.maxAttempts,
      startTime: data.startTime,
      endTime: data.endTime,
      delayMinutes: data.delayMinutes,
      enforceDND: data.enforceDND,
      suppressDowntime: data.suppressDowntime,
      exactAmountOnly: data.exactAmountOnly,
      escalateFailures: data.escalateFailures
    };

    await sql`
      UPDATE merchants 
      SET voice_call_threshold = ${thresholdPaise}, policies = ${sql.json(policies as any)}
      WHERE id = ${merchantId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
