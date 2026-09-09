import { NextResponse } from 'next/server';

type NewsletterBody = {
  email?: string;
  website?: string;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const body = (await req.json()) as NewsletterBody;
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const email = (body.email || '').trim();
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const to = process.env.CONTACT_TO_EMAIL || 'info@13utopia.com';
    const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.info('[newsletter] RESEND_API_KEY missing — logged only:', email);
      return NextResponse.json({ ok: true, queued: false });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Newsletter signup: ${email}`,
        text: `New newsletter subscriber: ${email}`,
      }),
    });

    if (!res.ok) {
      console.error('[newsletter] Resend error', await res.text());
      return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[newsletter] unexpected', err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
