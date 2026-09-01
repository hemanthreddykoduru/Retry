import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function GET() {
  try {
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL + '/dashboard';
    const { data, error } = await insforge.auth.signInWithOAuth({
      provider: 'google',
      redirectUrl,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // data.url contains the Google auth URL
    return NextResponse.redirect(data.url);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
