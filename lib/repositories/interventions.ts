import { sql } from '../db';

export const InterventionsRepository = {
  async listByCase(caseId: string) {
    return await sql`SELECT * FROM interventions WHERE recovery_case_id = ${caseId} ORDER BY created_at ASC`;
  }
};
