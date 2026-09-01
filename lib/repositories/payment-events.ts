import { sql } from '../db';

export const PaymentEventsRepository = {
  async insert(event: {
    merchant_id?: string;
    razorpay_event_id: string;
    event_type: string;
    payload: Record<string, unknown>;
  }) {
    const rows = await sql`
      INSERT INTO payment_events (merchant_id, razorpay_event_id, event_type, payload)
      VALUES (${event.merchant_id || null}, ${event.razorpay_event_id}, ${event.event_type}, ${sql.json(event.payload as unknown as Record<string, unknown>)})
      ON CONFLICT (razorpay_event_id) DO NOTHING
      RETURNING *
    `;
    return rows[0] || null; // Null if conflict
  },
  async markProcessed(id: string) {
    await sql`UPDATE payment_events SET processed = true WHERE id = ${id}`;
  }
};
