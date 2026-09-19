import postgres from 'postgres';

const directUrl = "postgresql://postgres:654f24421313c41d7addad16b7079437@67eyaefq.us-east.database.insforge.app:5432/insforge?sslmode=require";
const poolerUrl = "postgresql://postgres:654f24421313c41d7addad16b7079437@67eyaefq.us-east.database.insforge.app:6543/insforge?sslmode=require&pgbouncer=true";

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
