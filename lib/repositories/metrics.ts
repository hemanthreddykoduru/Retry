import { sql } from '../db';

export const MetricsRepository = {
  async getByMerchant(merchantId: string, date: string) {
    const rows = await sql`SELECT * FROM daily_metrics WHERE merchant_id = ${merchantId} AND date = ${date}::date`;
    return rows[0] || null;
  },
  async getAggregatedByMerchant(merchantId: string) {
    const rows = await sql`
      SELECT 
        COALESCE(SUM(failures_detected), 0)::int as failures_detected,
        COALESCE(SUM(cases_opened), 0)::int as cases_opened,
        COALESCE(SUM(cases_recovered), 0)::int as cases_recovered,
        COALESCE(SUM(amount_at_risk), 0)::int as amount_at_risk,
        COALESCE(SUM(amount_recovered), 0)::int as amount_recovered,
        COALESCE(SUM(calls_placed), 0)::int as calls_placed,
        COALESCE(SUM(whatsapps_sent), 0)::int as whatsapps_sent,
        COALESCE(SUM(optouts), 0)::int as optouts
      FROM daily_metrics 
      WHERE merchant_id = ${merchantId}
    `;
    return rows[0] || null;
  }
};
