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
    if (!data || !data.user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
    
    // Try to get merchant data
    let business_name = 'My Business';
    const { data: merchantData, error: mError } = await insforge.database
      .from('merchants')
      .select('business_name')
      .eq('id', data.user.id)
      .single();
      
    if (merchantData) {
      business_name = merchantData.business_name;
    }

    // Return token and user info safely
    return NextResponse.json({
      user: data.user,
      token: data.accessToken ?? null,
      business_name: business_name,
      name: data.user?.user_metadata?.name || 'Hemanth R.',
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
