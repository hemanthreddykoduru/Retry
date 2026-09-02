import { sql } from './lib/db.js';
async function run() {
  try {
    const res = await sql`SELECT id, voice_call_threshold, policies FROM merchants`;
    console.log("Merchants:", res);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
