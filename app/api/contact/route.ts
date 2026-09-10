import { NextResponse } from 'next/server';

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  company?: string;
  websiteUrl?: string;
  website?: string; // honeypot
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
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
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = (await req.json()) as ContactBody;

    // Honeypot — bots fill hidden fields
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const service = (body.service || '').trim();
    const company = (body.company || '').trim();
    const websiteUrl = (body.websiteUrl || '').trim();
    const message = (body.message || '').trim();

    if (!name || name.length > 120) {
      return NextResponse.json({ error: 'Valid name is required.' }, { status: 400 });
    }
    if (!email || !isValidEmail(email) || email.length > 200) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }
    if (!phone || phone.length > 40) {
      return NextResponse.json({ error: 'Valid phone is required.' }, { status: 400 });
    }
    if (message && (message.length < 3 || message.length > 5000)) {
      return NextResponse.json({ error: 'Message is too short or too long.' }, { status: 400 });
    }

    const to = process.env.CONTACT_TO_EMAIL || 'info@13utopia.com';
    const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
    const apiKey = process.env.RESEND_API_KEY;

    const subject = `New inquiry from ${name}${service ? ` — ${service}` : ''}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'n/a'}`,
      `Company: ${company || 'n/a'}`,
      `Website: ${websiteUrl || 'n/a'}`,
      `Service: ${service || 'n/a'}`,
      '',
      message || '(no message)',
    ].join('\n');

    if (!apiKey) {
      console.info('[contact] RESEND_API_KEY missing — logged only:', {
        name,
        email,
        phone,
        service,
        company,
      });
      // Production must fail loud so cutover smoke tests catch missing env
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Email delivery is not configured. Set RESEND_API_KEY on Vercel.' },
          { status: 503 }
        );
      }
      return NextResponse.json({
        ok: true,
        queued: false,
        message: 'Received. Email delivery is not configured yet; inquiry was logged.',
      });
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
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[contact] Resend error', res.status, errText);
      return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] unexpected', err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
