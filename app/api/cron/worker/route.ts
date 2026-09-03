import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// This endpoint is meant to be called by a Cron Job (e.g. Vercel Cron every minute)
// It finds cases that have been waiting in 'diagnosing' state longer than their Cool-off period
export async function GET(request: Request) {
  try {
    // 1. Fetch all recovery cases currently waiting in the 'diagnosing' state
    const waitingCases = await sql`
      SELECT c.id, c.created_at, m.policies
      FROM recovery_cases c
      JOIN merchants m ON c.merchant_id = m.id
      WHERE c.status = 'diagnosing'
    `;

    const now = new Date();
    let triggeredCount = 0;

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    // 2. Iterate and check cool-off times
    for (const row of waitingCases) {
      const openedAt = new Date(row.created_at);
      const diffMinutes = (now.getTime() - openedAt.getTime()) / (1000 * 60);
      
      const policies = row.policies || {};
      const delayMinutes = parseInt(policies.delayMinutes || '15', 10);

      // If the waiting time exceeds the cool-off delay, trigger the call!
      if (diffMinutes >= delayMinutes) {
        console.log(`[Cron Worker] Case ${row.id} has waited ${Math.round(diffMinutes)} mins (Policy: ${delayMinutes} mins). Triggering Voice Call...`);
        
        // Dispatch the voice call for this case
        await fetch(`${protocol}://${host}/api/recovery-cases/${row.id}/voice-call`, {
          method: 'POST',
        });
        
        triggeredCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${waitingCases.length} waiting cases. Triggered ${triggeredCount} calls.`,
    });
  } catch (error) {
    console.error('[Cron Worker] Error processing scheduled cases:', error);
    return NextResponse.json({ success: false, error: 'Failed to process background worker' }, { status: 500 });
  }
}
