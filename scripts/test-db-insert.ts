import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  try {
    await sql`
      INSERT INTO merchants (id, razorpay_webhook_secret) 
      VALUES ('00000000-0000-0000-0000-000000000001', 'test1234')
      ON CONFLICT (id) DO UPDATE SET razorpay_webhook_secret = EXCLUDED.razorpay_webhook_secret
    `;
    console.log("Success");
  } catch(e) {
    console.error(e);
  }
}
run().catch(console.error).finally(() => process.exit(0));
