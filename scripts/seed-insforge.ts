import { createAdminClient } from '@insforge/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const insforge = createAdminClient({
  baseUrl: process.env.INSFORGE_BASE_URL!,
  apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY!
});

const merchantId = 'm_demo_1'; // Use a deterministic string UUID if possible, but UUIDs usually must be valid format. Let's use a real UUID.
const mId = '00000000-0000-0000-0000-000000000001';

async function seed() {
  console.log('Seeding InsForge database...');

  // 1. Merchant
  const { error: mErr } = await insforge.database.from('merchants').upsert({
    id: mId,
    business_name: 'NammaMart Demo Store',
    email: 'demo@nammamart.com',
    voice_call_threshold: 50000
  }, { onConflict: 'id' });
  if (mErr) console.error('Merchant error:', mErr);

  // 2. Customers
  const customers = [
    { id: '10000000-0000-0000-0000-000000000001', merchant_id: mId, name: 'Ananya R.', phone: '+919876543001', preferred_language: 'en', do_not_contact: false },
    { id: '10000000-0000-0000-0000-000000000002', merchant_id: mId, name: 'Ravi K.', phone: '+919876543002', preferred_language: 'hi', do_not_contact: false },
    { id: '10000000-0000-0000-0000-000000000003', merchant_id: mId, name: 'Srilatha P.', phone: '+919876543003', preferred_language: 'te', do_not_contact: false },
    { id: '10000000-0000-0000-0000-000000000004', merchant_id: mId, name: 'Kiran M.', phone: '+919876543004', preferred_language: 'en', do_not_contact: true },
    { id: '10000000-0000-0000-0000-000000000005', merchant_id: mId, name: 'Nikhil S.', phone: '+919876543005', preferred_language: 'hi', do_not_contact: false }
  ];
  
  for (const c of customers) {
    const { error } = await insforge.database.from('customers').upsert(c, { onConflict: 'id' });
    if (error) console.error('Customer error:', error);
  }

  // 3. Recovery Cases
  const cases = [
    { id: '20000000-0000-0000-0000-000000000001', merchant_id: mId, customer_id: customers[0].id, amount: 149900, trigger_source: 'payment_failed_webhook', root_cause: 'bank_downtime', status: 'awaiting_downtime_resolution' }, // rc_8f21 equivalent
    { id: '20000000-0000-0000-0000-000000000002', merchant_id: mId, customer_id: customers[1].id, amount: 89900, trigger_source: 'snippet_timeout', root_cause: 'network_drop', status: 'contacting' }, // rc_b182
    { id: '20000000-0000-0000-0000-000000000003', merchant_id: mId, customer_id: customers[2].id, amount: 199900, trigger_source: 'payment_failed_webhook', root_cause: 'insufficient_funds', status: 'promise_logged' }, // rc_c931
    { id: '20000000-0000-0000-0000-000000000004', merchant_id: mId, customer_id: customers[3].id, amount: 74900, trigger_source: 'payment_failed_webhook', root_cause: 'unknown', status: 'closed_optout' }, // rc_a744
    { id: '20000000-0000-0000-0000-000000000005', merchant_id: mId, customer_id: customers[4].id, amount: 249900, trigger_source: 'payment_failed_webhook', root_cause: 'auth_failure', status: 'intervention_scheduled' } // rc_6e02
  ];

  for (const rc of cases) {
    const { error } = await insforge.database.from('recovery_cases').upsert(rc, { onConflict: 'id' });
    if (error) console.error('Case error:', error);
  }

  // Interventions & Audit Logs
  const interventions = [
    { recovery_case_id: cases[2].id, type: 'voice_call', status: 'completed', outcome: 'promise_to_pay' }
  ];
  for (const int of interventions) {
    const { error } = await insforge.database.from('interventions').insert(int);
    if (error) console.error('Intervention error:', error);
  }

  const auditLogs = cases.map(c => ({
    recovery_case_id: c.id,
    actor: 'system',
    action: 'case_opened',
    reasoning: 'Automated failure detection'
  }));
  for (const al of auditLogs) {
    const { error } = await insforge.database.from('audit_log').insert(al);
    if (error) console.error('AuditLog error:', error);
  }

  // 4. Metrics
  const { error: metErr } = await insforge.database.from('daily_metrics').upsert({
    merchant_id: mId,
    date: new Date().toISOString().split('T')[0],
    failures_detected: 100,
    cases_opened: 100,
    cases_recovered: 61,
    amount_at_risk: 7942000,
    amount_recovered: 4862000,
    calls_placed: 42,
    whatsapps_sent: 58,
    optouts: 2
  }, { onConflict: 'merchant_id,date' });
  if (metErr) console.error('Metrics error:', metErr);

  console.log('Seeding complete.');
}

seed().catch(console.error);
