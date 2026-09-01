import { createAdminClient } from '@insforge/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const insforge = createAdminClient({
  baseUrl: process.env.INSFORGE_BASE_URL!,
  apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY!
});

async function verify() {
  const { data: merchants, error: mErr } = await insforge.database.from('merchants').select('id, business_name');
  if (mErr) throw mErr;
  if (!merchants || merchants.length === 0) {
    console.error('Demo merchant missing.');
    process.exit(1);
  }
  console.log(`Found ${merchants.length} merchants.`);

  const { data: cases, error: cErr } = await insforge.database.from('recovery_cases').select('id, amount, status');
  if (cErr) throw cErr;
  if (!cases || cases.length < 5) {
    console.error(`Expected 5 cases, found ${cases?.length}`);
    process.exit(1);
  }
  console.log(`Found ${cases.length} recovery cases.`);

  const { data: audits, error: aErr } = await insforge.database.from('audit_log').select('id, recovery_case_id');
  if (aErr) throw aErr;
  const uniqueCaseAudits = new Set(audits.map((a: Record<string, unknown>) => a.recovery_case_id));
  if (uniqueCaseAudits.size < 5) {
    console.error(`Missing audit records for some cases. Only ${uniqueCaseAudits.size} have audits.`);
    process.exit(1);
  }
  console.log('All cases have audit records.');

  const { data: metrics, error: metErr } = await insforge.database.from('daily_metrics').select('*');
  if (metErr) throw metErr;
  if (!metrics || metrics.length === 0) {
    console.error('Daily metrics missing.');
    process.exit(1);
  }
  console.log(`Found ${metrics.length} daily metrics rows.`);

  console.log('Verification complete.');
}

verify().catch(console.error);
