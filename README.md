# 13 UTOPiA

Production Next.js site for [13utopia.com](https://13utopia.com) — digital marketing, SEO, web development, CGI video, ORM, and email marketing agency in Ahmedabad, India.

## Repository

This repo is the **production Next.js app only** — no WordPress plugins/themes, no Vite scrape dumps, no migration probe scripts. Media lives under `public/wp-content/uploads`.


## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** + Framer Motion + Lenis smooth scroll
- Pixel-parity Elementor scrapes for marketing pages (`app/**/page.tsx`) with shared boots in `public/js`
- API routes for contact + newsletter (`app/api/*`) via Resend
- Deploy target: **Vercel**

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical site URL (`https://13utopia.com`) |
| `RESEND_API_KEY` | Yes (prod forms) | Send contact / newsletter email |
| `CONTACT_TO_EMAIL` | Optional | Inbox for leads (default `info@13utopia.com`) |
| `CONTACT_FROM_EMAIL` | Yes (prod) | Verified Resend from-address |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Project map

```
app/                 Routes, layouts (SEO metadata), API, sitemap/robots/manifest
components/          Shell, motion, SEO JSON-LD, shared UI
lib/                 seo.ts, schema.ts, constants, CSS sheet helpers
public/css|js        Pixel CSS/JS boots + Elementor live cascade
public/wp-content/uploads   Media only (no WP plugins/themes in deploy)
public/llms.txt      AI / GEO citation summary
docs/CUTOVER.md      DNS + go-live checklist
```

## SEO / AEO / GEO

- Per-route `metadata` via server `layout.tsx` (client pages stay interactive)
- Organization + LocalBusiness + Service JSON-LD (`lib/schema.ts`)
- `sitemap.xml`, `robots.txt` (incl. major AI crawlers), `manifest.webmanifest`
- `llms.txt` + `llms-full.txt` for answer-engine discovery
- Canonical URLs, Open Graph, Twitter cards, `en-IN` locale, geo meta

## Deploy (Vercel)

1. Import `13utopia/13utopia` → Framework **Next.js**
2. Set env vars from `.env.example`
3. Deploy `main`
4. Point DNS → Vercel, submit sitemap in Search Console

See [docs/CUTOVER.md](docs/CUTOVER.md) for the full cutover checklist.

## Security notes

- Do **not** commit `.env` / secrets
- WP `plugins/` and `themes/` are gitignored and removed from the deploy surface
- Keep malware-compromised WordPress backups offline / quarantined

## License

Proprietary — © 13 UTOPiA. All rights reserved.
