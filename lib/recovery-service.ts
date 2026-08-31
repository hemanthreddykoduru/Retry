import { demoStore } from './demo-store';
import { transitionState } from './recovery-state-machine';
import { CaseStatus } from './demo-data';

export const RecoveryService = {
  processEvent: (caseId: string, event: string, metadata: Record<string, unknown> = {}) => {
    const state = demoStore.getState();
    const c = state.cases.find(x => x.id === caseId);
    if (!c) throw new Error("Case not found");

    const currentStatus = c.status;

    try {
      if (event === 'payment.failed') {
        const next = transitionState(currentStatus, 'diagnosing');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'diagnose_started', 'Payment failure detected, diagnosing root cause', metadata);
      } 
      else if (event === 'downtime.started') {
        const next = transitionState(currentStatus, 'awaiting_downtime_resolution');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'downtime_suppression', 'Bank downtime detected. Suppressing contact.', metadata);
      }
      else if (event === 'downtime.resolved') {
        const next = transitionState(currentStatus, 'intervention_scheduled');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addIntervention(caseId, 'smart_retry', 'queued', null);
        demoStore.addAuditLog(caseId, 'system', 'retry_scheduled', 'Bank downtime resolved. Bounded smart retry scheduled.', metadata);
      }
      else if (event === 'payment_link.paid' || event === 'payment.captured' || event === 'order.paid') {
        // Prevent double counting if already recovered
        if (currentStatus !== 'recovered') {
          const next = transitionState(currentStatus, 'recovered');
          demoStore.updateCase(caseId, { status: next });
          demoStore.addAuditLog(caseId, 'system', 'payment_recovered', 'Payment successfully captured from link.', metadata);
          
          // Update metrics
          state.metrics.recovered_revenue_paise += c.amount;
          state.metrics.recovery_rate = Math.min(100, Math.round(((state.metrics.recovered_revenue_paise) / (state.metrics.revenue_at_risk_paise + state.metrics.recovered_revenue_paise)) * 100));
        }
      }
      else if (event === 'sarvam.promise_to_pay') {
        const next = transitionState(currentStatus, 'promise_logged');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'promise_logged', 'Customer promised to pay. Bounded future retry queued.', metadata);
      }
      else if (event === 'sarvam.link_requested') {
        const next = transitionState(currentStatus, 'contacting');
        // generate a dummy payment link id
        const plink = `plink_test${Math.floor(Math.random()*10000)}`;
        demoStore.updateCase(caseId, { status: next, razorpay_payment_link_id: plink });
        demoStore.addIntervention(caseId, 'payment_link_follow_up', 'queued', null);
        demoStore.addAuditLog(caseId, 'system', 'payment_link.created → customer_requested_link', 'Customer requested link. Payment link created.', metadata);
      }
      else if (event === 'sarvam.do_not_contact' || event === 'customer.opt_out') {
        const next = transitionState(currentStatus, 'closed_optout');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'opt_out', 'Customer requested do not contact. Automations canceled.', metadata);
      }
      else if (event === 'sarvam.no_answer') {
        const voiceCalls = c.interventions?.filter(i => i.type === 'smart_retry' || i.type === 'voice_call') || [];
        if (voiceCalls.length >= 2) {
          const next = transitionState(currentStatus, 'escalated');
          demoStore.updateCase(caseId, { status: next });
          demoStore.addAuditLog(caseId, 'system', 'escalated', 'Second no-answer. Manual follow-up required.', metadata);
        } else {
          demoStore.addAuditLog(caseId, 'system', 'no_answer', 'Customer did not answer voice call. 1 retry permitted.', metadata);
          demoStore.addIntervention(caseId, 'smart_retry', 'queued', null);
        }
      }
      else if (event === 'sarvam.customer_refused') {
        const next = transitionState(currentStatus, 'closed_lost');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'customer_refused', 'Customer refused payment.', metadata);
      }
      else if (event === 'sarvam.call_failed') {
        const next = transitionState(currentStatus, 'intervention_scheduled');
        const plink = `plink_test${Math.floor(Math.random()*10000)}`;
        demoStore.updateCase(caseId, { status: next, razorpay_payment_link_id: plink });
        demoStore.addIntervention(caseId, 'payment_link_follow_up', 'queued', null);
        demoStore.addAuditLog(caseId, 'system', 'sarvam.call_failed → manual_payment_link_follow_up_required', 'Voice call unavailable. Payment link ready for manual follow-up.', metadata);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn("Invalid transition handled gracefully:", err.message);
      }
    }
  }
};
