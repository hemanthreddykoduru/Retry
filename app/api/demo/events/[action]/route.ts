import { NextResponse } from 'next/server';
import { RecoveryService } from '@/lib/recovery-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  try {
    let message = '';
    
    // Use the fixed demo case IDs for specific scenarios
    switch (action) {
      case 'payment-failed':
        // rc_8f21: Ananya R. issuer-bank downtime
        RecoveryService.processEvent('rc_8f21', 'payment.failed', { synthetic: true });
        RecoveryService.processEvent('rc_8f21', 'downtime.started', { synthetic: true });
        message = 'Triggered payment.failed and downtime.started for Ananya R. (rc_8f21)';
        break;
      case 'downtime-resolved':
        RecoveryService.processEvent('rc_8f21', 'downtime.resolved', { synthetic: true });
        message = 'Triggered downtime.resolved for Ananya R. (rc_8f21)';
        break;
      case 'checkout-abandoned':
        // rc_b182: Ravi K. silent network drop-off
        RecoveryService.processEvent('rc_b182', 'payment.failed', { synthetic: true });
        message = 'Triggered checkout abandoned / payment.failed for Ravi K. (rc_b182)';
        break;
      case 'payment-link-paid':
        // rc_c931: Srilatha P.
        RecoveryService.processEvent('rc_c931', 'payment_link.paid', { synthetic: true });
        message = 'Triggered payment_link.paid for Srilatha P. (rc_c931)';
        break;
      case 'customer-opt-out':
        // rc_a744: Kiran M.
        RecoveryService.processEvent('rc_a744', 'customer.opt_out', { synthetic: true });
        message = 'Triggered customer opt-out for Kiran M. (rc_a744)';
        break;
      case 'sarvam-failed':
        // rc_6e02: Nikhil S.
        RecoveryService.processEvent('rc_6e02', 'sarvam.call_failed', { synthetic: true });
        message = 'Triggered sarvam.call_failed for Nikhil S. (rc_6e02)';
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
