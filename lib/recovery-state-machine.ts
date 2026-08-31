import { CaseStatus } from './demo-data';

export const VALID_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  open: ['diagnosing', 'closed_optout'],
  diagnosing: ['awaiting_downtime_resolution', 'intervention_scheduled', 'closed_optout'],
  awaiting_downtime_resolution: ['intervention_scheduled', 'closed_optout'],
  intervention_scheduled: ['contacting', 'recovered', 'closed_optout'],
  contacting: ['promise_logged', 'escalated', 'closed_optout', 'closed_lost', 'recovered'],
  promise_logged: ['recovered', 'escalated', 'closed_optout', 'closed_lost'],
  recovered: [], // terminal
  escalated: ['closed_lost', 'closed_optout', 'recovered'],
  closed_lost: [], // terminal
  closed_optout: [] // terminal
};

export function canTransition(current: CaseStatus, next: CaseStatus): boolean {
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

export function transitionState(current: CaseStatus, next: CaseStatus): CaseStatus {
  if (canTransition(current, next)) {
    return next;
  }
  throw new Error(`Invalid state transition from ${current} to ${next}`);
}
