import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // Return token and user info
    return NextResponse.json({ user: data.user, token: data.session?.access_token }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
