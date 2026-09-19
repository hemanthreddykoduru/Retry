import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  const result = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'merchants'`;
  console.log(result);
}
run().catch(console.error).finally(() => process.exit(0));
