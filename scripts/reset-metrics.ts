import { createAdminClient } from '@insforge/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const insforge = createAdminClient({
  baseUrl: process.env.INSFORGE_BASE_URL!,
  apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY!
});

async function run() {
  console.log('Resetting daily metrics...');
  const date = new Date().toISOString().split('T')[0];
  const { error } = await insforge.database.from('daily_metrics').update({
    failures_detected: 0,
    cases_opened: 0,
    cases_recovered: 0,
    amount_at_risk: 0,
    amount_recovered: 0,
    calls_placed: 0,
    whatsapps_sent: 0,
    optouts: 0
  }).eq('merchant_id', '00000000-0000-0000-0000-000000000001').eq('date', date);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Metrics reset successfully!');
  }
  
  console.log('Deleting dummy recovery cases...');
  const { error: deleteError } = await insforge.database
    .from('recovery_cases')
    .delete()
    .in('id', [
      '20000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000002',
      '20000000-0000-0000-0000-000000000003',
      '20000000-0000-0000-0000-000000000004',
      '20000000-0000-0000-0000-000000000005'
    ]);
    
  if (deleteError) {
    console.error('Error deleting dummy cases:', deleteError);
  } else {
    console.log('Dummy cases deleted successfully!');
  }
}

run();
