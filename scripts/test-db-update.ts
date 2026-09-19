import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  try {
    await sql`
      UPDATE merchants 
      SET razorpay_webhook_secret = 'test1234'
      WHERE id = 'b5cde830-46d4-4f3b-8878-88f83be9fa62'
    `;
    console.log("Success");
  } catch(e) {
    console.error(e);
  }
}
run().catch(console.error).finally(() => process.exit(0));
