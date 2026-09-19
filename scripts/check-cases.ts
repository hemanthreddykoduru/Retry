import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  const cases = await sql`SELECT id, status, customer_id FROM recovery_cases WHERE merchant_id = '00000000-0000-0000-0000-000000000001'`;
  console.log("Cases:", cases);
  const events = await sql`SELECT id, event_type, processed_at FROM payment_events ORDER BY id DESC LIMIT 5`;
  console.log("Events:", events);
}
run().catch(console.error).finally(() => process.exit(0));
