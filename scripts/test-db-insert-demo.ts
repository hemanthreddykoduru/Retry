import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  try {
    await sql`
      INSERT INTO merchants (id, business_name) 
      VALUES ('m_demo_123', 'Testing Business')
      ON CONFLICT (id) DO NOTHING
    `;
    console.log("Success");
  } catch(e) {
    console.error(e);
  }
}
run().catch(console.error).finally(() => process.exit(0));
