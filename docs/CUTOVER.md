# Go-live / cutover checklist

Ship only this Next.js app. Keep any compromised WordPress host offline.

**Code status (2026-09-10):** production `npm run build` passes; all primary marketing/service/legal routes return 200; legacy blog post slugs 301 → `/blog`; forms fail loud in production if `RESEND_API_KEY` is missing.

## Before DNS cutover (you must do these)

1. Set Vercel env vars from `.env.example`:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL=info@13utopia.com`
   - `CONTACT_FROM_EMAIL` (verified Resend sender domain — not `onboarding@resend.dev`)
   - `NEXT_PUBLIC_SITE_URL=https://13utopia.com`
2. Confirm Framework Preset is **Next.js** (see `vercel.json`).
3. Soften or disable **Vercel Attack Challenge** so Googlebot / SEO crawlers are not blocked with 403.
4. Deploy production (or preview with production env) → smoke-test:
   - `/`, `/digital-marketing`, `/search-engine-optimization`, `/web-development`
   - `/contact-us` form (must actually deliver email)
   - Newsletter footer signup
   - WhatsApp float, favicon tab icon
   - `/sitemap.xml`, `/robots.txt`, `/llms.txt`
   - One old blog URL (e.g. `/seo-services-in-ahmedabad-proven-strategy-predictable-results`) → lands on `/blog`
5. Confirm `/wp-content/plugins` and themes are absent from the deployment.
6. Verify security headers on any HTML response (HSTS / frame / nosniff).
7. Optional later: migrate full blog posts off redirects if those URLs still rank.

## DNS

1. Point `13utopia.com` / `www` to Vercel (set primary domain + redirect www ↔ apex).
2. Enable HTTPS (HSTS headers already configured in `next.config.mjs` / `vercel.json`).
3. Submit `https://13utopia.com/sitemap.xml` in Google Search Console.

## After cutover

1. Do not reconnect the old WordPress server publicly.
2. Keep WP backups offline/quarantined for content recovery only.
3. Monitor Resend delivery and form spam rates.
4. Spot-check service heroes (Poseidon/Zeus), benefit icons, and scroll on mobile.

## Local commands

```bash
npm run build
npm run start
```
