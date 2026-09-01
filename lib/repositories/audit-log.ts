/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '../db';

export const AuditLogRepository = {
  async listByCase(caseId: string) {
    const rows = await sql`SELECT * FROM audit_log WHERE recovery_case_id = ${caseId} ORDER BY created_at ASC`;
    return rows;
  },
  insert: async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [c] = await sql`INSERT INTO audit_log ${sql(data as any)} RETURNING *`;
    return c;
  }
};
