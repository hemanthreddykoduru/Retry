import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    await sql`ALTER TABLE merchants ADD COLUMN IF NOT EXISTS policies jsonb not null default '{}'::jsonb;`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
