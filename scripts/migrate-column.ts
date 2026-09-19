import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  await sql`UPDATE merchants SET webhook_secret = razorpay_webhook_secret WHERE razorpay_webhook_secret IS NOT NULL`;
  await sql`ALTER TABLE merchants DROP COLUMN IF EXISTS razorpay_webhook_secret`;
  console.log("Migrated and dropped");
}
run().catch(console.error).finally(() => process.exit(0));
