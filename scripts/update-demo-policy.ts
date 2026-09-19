import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  await sql`
    UPDATE merchants 
    SET 
      voice_call_threshold = 0,
      policies = jsonb_set(
        jsonb_set(
          COALESCE(policies, '{}'::jsonb), 
          '{suppressDowntime}', 
          'false'::jsonb
        ),
        '{delayMinutes}',
        '0'::jsonb
      )
    WHERE id = '00000000-0000-0000-0000-000000000001'
  `;
  console.log("Updated policies for demo merchant.");
}
run().catch(console.error).finally(() => process.exit(0));
