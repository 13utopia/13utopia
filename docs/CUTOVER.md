# Go-live — website only (email stays Hostinger for now)

**Now:** WordPress on Hostinger → Next.js on Vercel.  
**Later:** Boss buys Google Workspace; then switch MX to Google (separate job).  
**Until then:** do **not** change MX / Hostinger mailbox DNS.

**Boss requirement today:** live site on Vercel; form queries still land in existing `@13utopia.com` Hostinger inboxes.

**Code status (2026-09-10):** production build passes; primary routes 200; legacy blog slugs 301 → `/blog`; forms fail in production if `RESEND_API_KEY` is missing.

---

## How leads work after website cutover

```
Form on Vercel → Resend → CONTACT_TO_EMAIL (e.g. info@13utopia.com on Hostinger)
```

---

## Phase A — Website cutover (do this now)

### 1. Vercel Production env

| Variable | Value |
|----------|--------|
| `RESEND_API_KEY` | from Resend |
| `CONTACT_TO_EMAIL` | `info@13utopia.com` (or whichever Hostinger box gets leads) |
| `CONTACT_FROM_EMAIL` | verified Resend sender, e.g. `noreply@13utopia.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://13utopia.com` |

Redeploy after saving.

### 2. Resend

1. Verify domain `13utopia.com` (add Resend’s TXT/CNAME only — **not** MX)
2. Confirm a test send reaches the Hostinger inbox (check spam)

### 3. Smoke-test on `*.vercel.app`

- Home + main services
- Contact form → Hostinger inbox
- Newsletter signup
- Old blog URL → `/blog`
- Soften/disable Vercel Attack Challenge for crawlers

### 4. Point website DNS only

1. Vercel → Domains → add `13utopia.com` + `www`
2. At Hostinger DNS, change **only** `@` and `www` A/CNAME to Vercel’s values
3. **Leave MX, mail SPF, Hostinger DKIM, DMARC alone**
4. Wait until Vercel shows domain Valid + HTTPS

### 5. Retire public WordPress

Once the live domain serves Next.js:

1. Stop / remove Hostinger **website** hosting (or unpublish WP)
2. Keep Hostinger **email** plan active
3. Keep a WP backup offline for content only

### 6. After

- Submit `https://13utopia.com/sitemap.xml` in Search Console
- One real contact test → Hostinger inbox

---

## Phase B — Google Workspace (later, after boss purchases)

1. Set up Google Workspace on `13utopia.com`
2. Create/migrate mailboxes (`info@`, etc.)
3. Switch **MX** (and Google SPF/DKIM) to Google
4. Keep website A/CNAME on Vercel unchanged
5. Cancel Hostinger email when Google mail is confirmed
6. No code change needed if `CONTACT_TO_EMAIL` stays `info@13utopia.com`

---

## DNS cheat sheet (Phase A)

| Record | Touch now? |
|--------|------------|
| `A` / `CNAME` for `@` and `www` | **Yes** → Vercel |
| MX / Hostinger mail SPF / DKIM | **No** |
| Resend domain verification records | **Yes** (sending only) |

---

## Local commands

```bash
npm run build
npm run start
```
