import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function GET() {
  return NextResponse.json(demoStore.getState());
}
