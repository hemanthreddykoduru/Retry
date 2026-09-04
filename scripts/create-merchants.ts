import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) throw new Error('no DB url');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  await sql`
    CREATE TABLE IF NOT EXISTS merchants (
      id VARCHAR(255) PRIMARY KEY,
      business_name VARCHAR(255),
      razorpay_webhook_secret VARCHAR(255)
    )
  `;
  await sql`
    INSERT INTO merchants (id, business_name, razorpay_webhook_secret)
    VALUES ('m_demo_123', 'Testing Business', NULL)
    ON CONFLICT (id) DO NOTHING
  `;
  console.log('Done');
}
run().catch(console.error).finally(() => process.exit(0));
