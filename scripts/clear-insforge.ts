import { sql } from '@/lib/db';

async function clearDatabase() {
  try {
    // Delete child tables first to satisfy foreign‑key constraints
    await sql`DELETE FROM interventions`;
    await sql`DELETE FROM audit_log`;
    await sql`DELETE FROM daily_metrics`;
    await sql`DELETE FROM recovery_cases`;
    await sql`DELETE FROM customers`;
    await sql`DELETE FROM merchants`;
    console.log('All dummy data cleared from InsForge database.');
  } catch (err) {
    console.error('Error clearing database:', err);
  }
}

clearDatabase().catch(console.error);
