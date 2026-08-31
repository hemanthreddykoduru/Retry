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
        demoStore.updateCase(caseId, { status: next });
        demoStore.addIntervention(caseId, 'whatsapp_nudge', 'queued', null);
        demoStore.addAuditLog(caseId, 'system', 'whatsapp_queued', 'Customer requested link. WhatsApp fallback queued.', metadata);
      }
      else if (event === 'sarvam.do_not_contact' || event === 'customer.opt_out') {
        const next = transitionState(currentStatus, 'closed_optout');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'opt_out', 'Customer requested do not contact. Automations canceled.', metadata);
      }
      else if (event === 'sarvam.no_answer') {
        demoStore.addAuditLog(caseId, 'system', 'no_answer', 'Customer did not answer voice call.', metadata);
        // logic for max calls could escalate here
      }
      else if (event === 'sarvam.customer_refused') {
        const next = transitionState(currentStatus, 'closed_lost');
        demoStore.updateCase(caseId, { status: next });
        demoStore.addAuditLog(caseId, 'system', 'customer_refused', 'Customer refused payment.', metadata);
      }
      else if (event === 'sarvam.call_failed') {
        demoStore.addIntervention(caseId, 'whatsapp_nudge', 'queued', null);
        demoStore.addAuditLog(caseId, 'system', 'fallback_queued', 'Provider failure. sarvam.call_failed → fallback.whatsapp_queued.', metadata);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn("Invalid transition handled gracefully:", err.message);
      }
    }
  }
};
