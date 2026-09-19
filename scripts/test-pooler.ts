import postgres from 'postgres';

const directUrl = process.env.DIRECT_URL;
const poolerUrl = process.env.DATABASE_URL;

if (!poolerUrl) {
  throw new Error("Missing DATABASE_URL in environment variables.");
}

const sql = postgres(poolerUrl, { max: 1 });

async function run() {
  try {
    const res = await sql`SELECT 1 as connected`;
    console.log("Pooler success:", res);
  } catch (e) {
    console.error("Pooler failed:", e);
  }
}
run().finally(() => process.exit(0));
