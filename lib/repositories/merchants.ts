import { sql } from '../db';

export const MerchantsRepository = {
  async get(id: string) {
    const rows = await sql`SELECT * FROM merchants WHERE id = ${id}`;
    return rows[0] || null;
  }
};
