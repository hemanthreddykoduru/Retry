import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL);
async function run() {
  await sql`ALTER TABLE interventions ADD COLUMN IF NOT EXISTS metadata JSONB`;
  console.log('Added metadata column');
  process.exit(0);
}
run().catch(console.error);
