import { createAdminClient } from '@insforge/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const insforge = createAdminClient({
  baseUrl: process.env.INSFORGE_BASE_URL!,
  apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY!
});

async function verify() {
  console.log('Verifying InsForge data...');
  const { data: merchants, error: mErr } = await insforge.database.from('merchants').select('id, business_name');
  if (mErr) throw mErr;
  console.log(`Found ${merchants.length} merchants.`);

  const { data: cases, error: cErr } = await insforge.database.from('recovery_cases').select('id, amount, status, customer_id(name)');
  if (cErr) throw cErr;
  console.log(`Found ${cases.length} recovery cases.`);

  const { data: metrics, error: metErr } = await insforge.database.from('daily_metrics').select('*');
  if (metErr) throw metErr;
  console.log(`Found ${metrics.length} daily metrics rows.`);

  console.log('Verification complete.');
}

verify().catch(console.error);
