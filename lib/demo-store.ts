import { RecoveryCase, Customer, mockCases, mockCustomers, metricsData } from './demo-data';

export interface DemoState {
  cases: RecoveryCase[];
  customers: Customer[];
  metrics: typeof metricsData;
}

const getInitialState = (): DemoState => {
  return {
    cases: JSON.parse(JSON.stringify(mockCases)),
    customers: JSON.parse(JSON.stringify(mockCustomers)),
    metrics: JSON.parse(JSON.stringify(metricsData)),
  };
};

const globalForDemo = globalThis as unknown as { demoState: DemoState };

export const demoStore = {
  getState: () => {
    if (!globalForDemo.demoState) {
      globalForDemo.demoState = getInitialState();
    }
    return globalForDemo.demoState;
  },
  reset: () => {
    globalForDemo.demoState = getInitialState();
  },
  updateCase: (id: string, updates: Partial<RecoveryCase>) => {
    const state = demoStore.getState();
    const index = state.cases.findIndex(c => c.id === id);
    if (index !== -1) {
      state.cases[index] = { ...state.cases[index], ...updates };
    }
  },
  addAuditLog: (caseId: string, actor: 'agent' | 'system' | 'human', action: string, reasoning: string, metadata: Record<string, unknown> = {}) => {
    const state = demoStore.getState();
    const caseObj = state.cases.find(c => c.id === caseId);
    if (caseObj) {
      if (!caseObj.audit_logs) caseObj.audit_logs = [];
      caseObj.audit_logs.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        recovery_case_id: caseId,
        actor,
        action,
        reasoning,
        metadata,
        created_at: new Date().toISOString()
      });
    }
  },
  addIntervention: (caseId: string, type: 'smart_retry' | 'whatsapp_nudge' | 'payment_link_follow_up' | 'voice_call' | 'human_escalation', status: string, outcome: string | null = null) => {
    const state = demoStore.getState();
    const caseObj = state.cases.find(c => c.id === caseId);
    if (caseObj) {
      if (!caseObj.interventions) caseObj.interventions = [];
      caseObj.interventions.push({
        id: 'int_' + Date.now(),
        recovery_case_id: caseId,
        type,
        status: status as "queued" | "completed" | "failed" | "delivered",
        scheduled_for: new Date().toISOString(),
        executed_at: status === 'completed' || status === 'delivered' || status === 'failed' ? new Date().toISOString() : null,
        outcome
      });
    }
  }
};
