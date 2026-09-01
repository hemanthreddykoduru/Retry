import { NextResponse } from 'next/server';
import { RecoveryCasesRepository } from '@/lib/repositories/recovery-cases';
import { AuditLogRepository } from '@/lib/repositories/audit-log';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const rc = await RecoveryCasesRepository.get(caseId);
    if (!rc) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (rc.razorpay_payment_link_id) {
      return NextResponse.json({ 
        message: 'Payment link already exists', 
        link_id: rc.razorpay_payment_link_id 
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let paymentLinkId = `plink_test_${Date.now()}`;
    let paymentLinkUrl = `https://rzp.io/i/${paymentLinkId.replace('plink_', '')}`;

    if (keyId && keySecret) {
      // Call actual Razorpay test mode API
      const rzpRes = await fetch('https://api.razorpay.com/v1/payment_links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
        },
        body: JSON.stringify({
          amount: rc.amount,
          currency: 'INR',
          accept_partial: false,
          reference_id: caseId,
          description: 'Complete your checkout',
          customer: {
            contact: rc.customer?.phone || '',
            name: rc.customer?.name || ''
          },
          notify: {
            sms: false,
            email: false
          },
          reminder_enable: false
        })
      });

      if (rzpRes.ok) {
        const rzpData = await rzpRes.json();
        paymentLinkId = rzpData.id;
        paymentLinkUrl = rzpData.short_url;
      } else {
        const err = await rzpRes.text();
        console.error('Razorpay API failed:', err);
        return NextResponse.json({ error: 'Failed to create Razorpay Payment Link' }, { status: 500 });
      }
    }

    // Update case in DB
    await RecoveryCasesRepository.update(caseId, {
      razorpay_payment_link_id: paymentLinkId
    });

    // Add audit log
    await AuditLogRepository.insert({
      recovery_case_id: caseId,
      actor: 'system',
      action: 'payment_link_created',
      reasoning: 'Generated Razorpay Payment Link for manual follow-up or recovery',
      metadata: { payment_link_id: paymentLinkId, url: paymentLinkUrl }
    });

    return NextResponse.json({ success: true, link_id: paymentLinkId, url: paymentLinkUrl });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
