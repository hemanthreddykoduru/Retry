import { demoStore } from './demo-store';

export const AuditService = {
  log: (caseId: string, actor: 'agent' | 'system' | 'human', action: string, reasoning: string, metadata: Record<string, unknown> = {}) => {
    demoStore.addAuditLog(caseId, actor, action, reasoning, metadata);
  }
};
