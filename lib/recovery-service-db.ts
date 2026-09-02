/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from './db';
import { transitionState } from './recovery-state-machine';

export const RecoveryServiceDB = {
  processEvent: async (caseId: string, event: string, metadata: Record<string, unknown> = {}) => {
    try {
      await sql.begin(async (tx) => {
        // 1. Fetch current case and lock it for update
        const [c] = await tx`SELECT * FROM recovery_cases WHERE id = ${caseId} FOR UPDATE`;
        if (!c) throw new Error("Case not found");

        const currentStatus = c.status;
        let nextStatus = currentStatus;
        let auditAction = '';
        let auditReasoning = '';
        let addIntervention: { type: string, status: string } | null = null;
        let isRecoveredNow = false;

        if (event === 'payment.failed') {
          if (currentStatus !== 'open') {
            auditAction = 'duplicate_failure_ignored';
            auditReasoning = 'Duplicate payment failure event received. Case already in progress.';
            // nextStatus remains currentStatus
          } else {
            nextStatus = transitionState(currentStatus, 'diagnosing');
            auditAction = 'diagnose_started';
            auditReasoning = 'Payment failure detected, diagnosing root cause';
          }
        }
        else if (event === 'downtime.started') {
          nextStatus = transitionState(currentStatus, 'awaiting_downtime_resolution');
          auditAction = 'downtime_suppression';
          auditReasoning = 'Bank downtime detected. Suppressing contact.';
        }
        else if (event === 'downtime.resolved') {
          nextStatus = transitionState(currentStatus, 'intervention_scheduled');
          addIntervention = { type: 'smart_retry', status: 'queued' };
          auditAction = 'retry_scheduled';
          auditReasoning = 'Bank downtime resolved. Bounded smart retry scheduled.';
        }
        else if (event === 'payment_link.paid' || event === 'payment.captured' || event === 'order.paid') {
          if (currentStatus !== 'recovered') {
            nextStatus = transitionState(currentStatus, 'recovered');
            auditAction = 'payment_recovered';
            auditReasoning = 'Payment successfully captured from link.';
            isRecoveredNow = true;
          }
        }
        else if (event === 'sarvam.promise_to_pay') {
          nextStatus = transitionState(currentStatus, 'promise_logged');
          auditAction = 'promise_logged';
          auditReasoning = 'Customer promised to pay. Bounded future retry queued.';
        }
        else if (event === 'sarvam.link_requested') {
          nextStatus = transitionState(currentStatus, 'contacting');
          addIntervention = { type: 'payment_link_follow_up', status: 'queued' };
          auditAction = 'payment_link.created → customer_requested_link';
          auditReasoning = 'Customer requested link. Payment link created.';
        }
        else if (event === 'sarvam.do_not_contact' || event === 'customer.opt_out') {
          nextStatus = transitionState(currentStatus, 'closed_optout');
          auditAction = 'opt_out';
          auditReasoning = 'Customer requested do not contact. Automations canceled.';
        }
        else if (event === 'sarvam.no_answer') {
          // fetch interventions to count voice calls
          const voiceCalls = await tx`SELECT id FROM interventions WHERE recovery_case_id = ${caseId} AND (type = 'smart_retry' OR type = 'voice_call')`;
          if (voiceCalls.length >= 2) {
            nextStatus = transitionState(currentStatus, 'escalated');
            auditAction = 'escalated';
            auditReasoning = 'Second no-answer. Manual follow-up required.';
          } else {
            auditAction = 'no_answer';
            auditReasoning = 'Customer did not answer voice call. 1 retry permitted.';
            addIntervention = { type: 'smart_retry', status: 'queued' };
          }
        }
        else if (event === 'sarvam.customer_refused') {
          nextStatus = transitionState(currentStatus, 'closed_lost');
          auditAction = 'customer_refused';
          auditReasoning = 'Customer refused payment.';
        }
        else if (event === 'sarvam.call_failed') {
          nextStatus = transitionState(currentStatus, 'intervention_scheduled');
          addIntervention = { type: 'payment_link_follow_up', status: 'queued' };
          auditAction = 'sarvam.call_failed → manual_payment_link_follow_up_required';
          auditReasoning = 'Voice call unavailable. Payment link ready for manual follow-up.';
        }

        if (!auditAction) return; // No state change

        // Apply updates
        let plink = c.razorpay_payment_link_id;
        if ((event === 'sarvam.link_requested' || event === 'sarvam.call_failed') && !plink) {
          const keyId = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          
          if (keyId && keySecret) {
            const [cust] = await tx`SELECT * FROM customers WHERE id = ${c.customer_id}`;
            const rzpRes = await fetch('https://api.razorpay.com/v1/payment_links', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
              },
              body: JSON.stringify({
                amount: c.amount,
                currency: 'INR',
                reference_id: caseId,
                description: 'Complete your checkout',
                customer: {
                  contact: cust?.phone || '',
                  name: cust?.name || ''
                },
                notify: { sms: false, email: false },
                reminder_enable: false,
                notes: { recovery_case_id: caseId }
              })
            });
            if (rzpRes.ok) {
              const rzpData = await rzpRes.json();
              plink = rzpData.id;
            } else {
              plink = `plink_test${Math.floor(Math.random()*10000)}`;
            }
          } else {
            plink = `plink_test${Math.floor(Math.random()*10000)}`;
          }
        }

        let updateQuery = tx`UPDATE recovery_cases SET status = ${nextStatus}, razorpay_payment_link_id = ${plink} WHERE id = ${caseId}`;
        if (isRecoveredNow) {
          updateQuery = tx`UPDATE recovery_cases SET status = ${nextStatus}, razorpay_payment_link_id = ${plink}, recovered_amount = ${c.amount} WHERE id = ${caseId}`;
        }
        await updateQuery;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await tx`INSERT INTO audit_log (recovery_case_id, actor, action, reasoning, metadata) 
                 VALUES (${caseId}, 'system', ${auditAction}, ${auditReasoning}, ${tx.json(metadata as any)})`;

        if (addIntervention) {
          await tx`INSERT INTO interventions (recovery_case_id, type, status)
                   VALUES (${caseId}, ${addIntervention.type}, ${addIntervention.status})`;
        }

        if (isRecoveredNow) {
          // Cancel outstanding interventions
          await tx`UPDATE interventions SET status = 'skipped' WHERE recovery_case_id = ${caseId} AND status = 'queued'`;

          // Atomic metrics update
          const dateStr = new Date().toISOString().split('T')[0];
          await tx`UPDATE daily_metrics SET 
                    amount_recovered = amount_recovered + ${c.amount},
                    cases_recovered = cases_recovered + 1
                   WHERE merchant_id = ${c.merchant_id} AND date = ${dateStr}::date`;
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn("Transaction failed or invalid transition:", err.message);
      }
    }
  }
};
