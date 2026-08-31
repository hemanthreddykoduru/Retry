import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function POST() {
  demoStore.reset();
  return NextResponse.json({ success: true, message: 'Demo state reset to initial conditions.' });
}
