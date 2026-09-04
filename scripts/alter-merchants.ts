import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) throw new Error('no DB url');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  await sql`ALTER TABLE merchants ADD COLUMN IF NOT EXISTS razorpay_webhook_secret VARCHAR(255)`;
  console.log('Done');
}
run().catch(console.error).finally(() => process.exit(0));
