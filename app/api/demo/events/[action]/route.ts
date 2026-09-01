import { NextResponse } from 'next/server';
import { RecoveryServiceDB } from '@/lib/recovery-service-db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  try {
    let message = '';
    
    switch (action) {
      case 'insufficient_funds':
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000003', 'payment.failed', { synthetic: true });
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000003', 'sarvam.promise_to_pay', { synthetic: true });
        message = 'Triggered payment.failed and sarvam.promise_to_pay';
        break;
      case 'bank_downtime':
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000001', 'payment.failed', { synthetic: true });
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000001', 'downtime.started', { synthetic: true });
        message = 'Triggered payment.failed and downtime.started';
        break;
      case 'no_answer':
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000002', 'payment.failed', { synthetic: true });
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000002', 'sarvam.no_answer', { synthetic: true });
        message = 'Triggered sarvam.no_answer, scheduled second attempt';
        break;
      case 'opt_out':
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000004', 'payment.failed', { synthetic: true });
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000004', 'sarvam.do_not_contact', { synthetic: true });
        message = 'Triggered sarvam.do_not_contact / customer opt-out';
        break;
      case 'sarvam_failure':
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000005', 'payment.failed', { synthetic: true });
        await RecoveryServiceDB.processEvent('20000000-0000-0000-0000-000000000005', 'sarvam.call_failed', { synthetic: true });
        message = 'Triggered sarvam.call_failed';
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
