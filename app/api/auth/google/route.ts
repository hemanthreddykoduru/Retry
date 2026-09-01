import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${process.env.VERCEL_URL ?? ''}`;
    const redirectTo = `${baseUrl}/dashboard`;
    const { data, error } = await insforge.auth.signInWithOAuth({
      provider: 'google',
      redirectTo,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // data.url contains the Google auth URL
    return data?.url ? NextResponse.redirect(data.url as string) : NextResponse.json({ error: 'Missing redirect URL' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
