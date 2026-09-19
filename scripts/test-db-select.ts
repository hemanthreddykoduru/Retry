import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  const result = await sql`SELECT id, business_name FROM merchants`;
  console.log(result);
}
run().catch(console.error).finally(() => process.exit(0));
