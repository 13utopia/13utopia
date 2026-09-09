import { NextResponse } from 'next/server';

/** Stub for Elementor/WCF admin-ajax calls — always empty success. */
export async function POST() {
  return NextResponse.json({ success: true, data: {} });
}

export async function GET() {
  return NextResponse.json({ success: true, data: {} });
}
