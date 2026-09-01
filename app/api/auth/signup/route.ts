import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const { name, business_name, email, password } = await request.json();
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
      // business_name is not part of CreateUserRequest; handle separately if needed
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
    }
    return NextResponse.json({ user: data.user, token: data.accessToken ?? null }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
