import { NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();
    
    // Step 1: Exchange the 6-digit code for a reset token
    const { data: exchangeData, error: exchangeError } = await insforge.auth.exchangeResetPasswordToken({
      email,
      code,
    });
    
    if (exchangeError) {
      return NextResponse.json({ error: exchangeError.message }, { status: 400 });
    }
    
    if (!exchangeData || !exchangeData.token) {
      return NextResponse.json({ error: 'Failed to retrieve reset token' }, { status: 500 });
    }
    
    // Step 2: Use the token to set the new password
    const { error: resetError } = await insforge.auth.resetPassword({
      newPassword,
      otp: exchangeData.token,
    });
    
    if (resetError) {
      return NextResponse.json({ error: resetError.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
