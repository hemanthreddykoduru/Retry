import { sql } from '../db';

export const MetricsRepository = {
  async getByMerchant(merchantId: string, date: string) {
    const rows = await sql`SELECT * FROM daily_metrics WHERE merchant_id = ${merchantId} AND date = ${date}::date`;
    return rows[0] || null;
  }
};
