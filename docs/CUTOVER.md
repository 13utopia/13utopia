# Go-live / cutover checklist

Ship only this Next.js app. Keep any compromised WordPress host offline.

## Before DNS cutover

1. Set Vercel env vars from `.env.example`:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL=info@13utopia.com`
   - `CONTACT_FROM_EMAIL` (verified Resend sender)
   - `NEXT_PUBLIC_SITE_URL=https://13utopia.com`
2. Confirm Framework Preset is **Next.js** (see `vercel.json`).
3. Deploy preview → smoke-test routes, contact, newsletter, WhatsApp.
4. Confirm `/wp-content/plugins` and themes are absent from the deployment.
5. Verify security headers on any HTML response.
6. Check `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and rich results (Organization / LocalBusiness).

## DNS

1. Point `13utopia.com` / `www` to Vercel.
2. Enable HTTPS (HSTS headers already configured).
3. Submit `https://13utopia.com/sitemap.xml` in Google Search Console.

## After cutover

1. Do not reconnect the old WordPress server publicly.
2. Keep WP backups offline/quarantined for content recovery only.
3. Monitor Resend delivery and form spam rates.

## Local commands

```bash
npm run build
npm run start
```
