import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const { email, otp, name, business_name, password } = await request.json();
    console.log("verify-otp called with:", { email, otp, name, business_name });
    
    // 1. Verify the email OTP
    const { data: verifyData, error: verifyError } = await insforge.auth.verifyEmail({
      email,
      otp,
    });
    console.log("verifyEmail response:", { verifyData, verifyError });
    
    if (verifyError) {
      return NextResponse.json({ error: verifyError.message }, { status: 400 });
    }
    
    // 2. Sign in with password to get the session
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data || !data.user) {
      return NextResponse.json({ error: 'Verification failed: No user returned' }, { status: 500 });
    }

    // Insert into merchants table now that verification is complete
    const { error: merchantError } = await insforge.database
      .from('merchants')
      .insert({
        id: data.user.id,
        business_name: business_name || 'My Business',
        email: email
      });

    if (merchantError) {
      console.error('Failed to create merchant:', merchantError);
    }

    return NextResponse.json({ 
      user: data.user, 
      token: data.accessToken ?? null,
      business_name: business_name || 'My Business',
      name: name
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
