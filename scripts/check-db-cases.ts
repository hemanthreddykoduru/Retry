import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  const cases = await sql`SELECT id, merchant_id FROM recovery_cases WHERE merchant_id = '00000000-0000-0000-0000-000000000001'`;
  console.log("Cases:", cases.length);
}
run().catch(console.error).finally(() => process.exit(0));
