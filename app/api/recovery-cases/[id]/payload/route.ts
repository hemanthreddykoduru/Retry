import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find the eventId from the first audit log of this case
    const logs = await sql`
      SELECT metadata->>'eventId' as event_id 
      FROM audit_log 
      WHERE recovery_case_id = ${id} AND action = 'diagnose_started'
      LIMIT 1
    `;
    
    if (logs.length === 0 || !logs[0].event_id) {
      return NextResponse.json({ payload: null });
    }
    
    const events = await sql`
      SELECT payload 
      FROM payment_events 
      WHERE razorpay_event_id = ${logs[0].event_id}
      LIMIT 1
    `;
    
    if (events.length === 0) {
      return NextResponse.json({ payload: null });
    }
    
    return NextResponse.json({ payload: events[0].payload });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payload' }, { status: 500 });
  }
}
