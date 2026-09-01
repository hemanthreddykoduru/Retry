import { sql } from '../lib/db';

async function main() {
  try {
    await sql`ALTER TABLE merchants ADD COLUMN IF NOT EXISTS policies jsonb not null default '{}'::jsonb;`;
    console.log("Added policies jsonb column to merchants");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
main();
