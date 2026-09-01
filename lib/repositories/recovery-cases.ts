import { sql } from '../db';
import type { RecoveryCase } from '../demo-data';

export const RecoveryCasesRepository = {
  async get(id: string) {
    const rows = await sql`
      SELECT rc.*,
        row_to_json(c.*) as customer
      FROM recovery_cases rc
      LEFT JOIN customers c ON rc.customer_id = c.id
      WHERE rc.id = ${id}
    `;
    return rows[0] || null;
  },
  async listByMerchant(merchantId: string) {
    const rows = await sql`
      SELECT rc.*,
        row_to_json(c.*) as customer
      FROM recovery_cases rc
      LEFT JOIN customers c ON rc.customer_id = c.id
      WHERE rc.merchant_id = ${merchantId}
      ORDER BY rc.opened_at DESC
    `;
    return rows;
  }
};
