import { sql } from '../db';

export const AuditLogRepository = {
  async listByCase(caseId: string) {
    return await sql`SELECT * FROM audit_log WHERE recovery_case_id = ${caseId} ORDER BY created_at ASC`;
  }
};
