import { NextResponse } from 'next/server';
import { RecoveryServiceDB } from '@/lib/recovery-service-db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  try {
    let message = '';
    
    const body = await request.json().catch(() => ({}));
    const caseId = body.caseId;
    if (!caseId) return NextResponse.json({ error: 'Missing caseId' }, { status: 400 });

    switch (action) {
      case 'promise':
        await RecoveryServiceDB.processEvent(caseId, 'sarvam.promise_to_pay', { synthetic: true });
        message = 'Simulated Sarvam promise_to_pay outcome';
        break;
      case 'link':
        await RecoveryServiceDB.processEvent(caseId, 'sarvam.link_requested', { synthetic: true });
        message = 'Simulated Sarvam link_requested outcome';
        break;
      case 'optout':
        await RecoveryServiceDB.processEvent(caseId, 'sarvam.do_not_contact', { synthetic: true });
        message = 'Simulated customer opt-out';
        break;
      case 'noanswer':
        await RecoveryServiceDB.processEvent(caseId, 'sarvam.no_answer', { synthetic: true });
        message = 'Simulated no answer';
        break;
      case 'sarvam_fail':
        await RecoveryServiceDB.processEvent(caseId, 'sarvam.call_failed', { synthetic: true });
        message = 'Simulated Sarvam call_failed';
        break;
      default:
        return NextResponse.json({ error: 'Unknown demo action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
  }
}
