import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let merchantId = searchParams.get('merchantId');
  
  if (!merchantId) return NextResponse.json({ error: 'Missing merchantId' }, { status: 400 });

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(merchantId)) {
    merchantId = '00000000-0000-0000-0000-000000000001';
  }

  try {
    const result = await sql`SELECT webhook_secret FROM merchants WHERE id = ${merchantId}`;
    if (result.length > 0) {
      return NextResponse.json({ secret: result[0].webhook_secret });
    }
    return NextResponse.json({ secret: null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { merchantId, secret } = body;
    if (!merchantId || !secret) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(merchantId)) {
      merchantId = '00000000-0000-0000-0000-000000000001';
    }

    await sql`
      UPDATE merchants 
      SET webhook_secret = ${secret}
      WHERE id = ${merchantId}
    `;
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
