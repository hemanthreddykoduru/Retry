/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '../db';

export const PaymentEventsRepository = {
  async insert(event: {
    merchant_id?: string;
    razorpay_event_id: string;
    event_type: string;
    payload: Record<string, unknown>;
  }) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [inserted] = await sql`INSERT INTO payment_events (razorpay_event_id, event_type, payload) VALUES (${event.razorpay_event_id}, ${event.event_type}, ${sql.json(event.payload as any)}) ON CONFLICT (razorpay_event_id) DO NOTHING RETURNING *`;
      return inserted || null; // Null if conflict
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  async markProcessed(id: string) {
    await sql`UPDATE payment_events SET processed = true WHERE id = ${id}`;
  }
};
