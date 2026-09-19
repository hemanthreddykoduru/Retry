import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  const res = await sql`SELECT webhook_secret FROM merchants WHERE id = '00000000-0000-0000-0000-000000000001'`;
  console.log("Secret in DB:", res[0]?.webhook_secret);
}
run().catch(console.error).finally(() => process.exit(0));
