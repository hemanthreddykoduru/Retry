import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  const interventions = await sql`SELECT id, metadata FROM interventions ORDER BY created_at DESC LIMIT 5`;
  console.log(JSON.stringify(interventions, null, 2));
}
run().finally(() => process.exit(0));
