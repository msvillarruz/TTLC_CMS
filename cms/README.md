# TTLC CMS

Payload CMS 3 backend for Tiny Thinkers Learning Center.

Deployed via Coolify on Hetzner CPX22 (Singapore).
Serves content to the Next.js frontend at tinythinkers.edu.ph.

---

## Stack

- **CMS:** Payload 3 (Next.js-based)
- **Database:** PostgreSQL 16
- **Media:** Cloudflare R2 (via S3 adapter)
- **Hosting:** Hetzner CPX22, Singapore — deployed via Coolify
- **Admin URL:** https://cms.tinythinkers.edu.ph

---

## Collections

| Collection | Purpose |
|---|---|
| `programs` | Brainy Bunch, Crayon Crew, Epic Explorers |
| `articles` | Blog/news posts |
| `events` | Open house, recitals, parent meetings |
| `announcements` | Short pinned site-wide banners |
| `trial-requests` | Trial class bookings from the website |
| `authors` | Staff who write articles |
| `categories` | Article categories |
| `media` | Uploaded images (proxied to R2) |
| `parents` | Hidden stub — for future Parent Portal |

## Globals

| Global | Purpose |
|---|---|
| `site-settings` | Contact info, social links, SEO defaults |
| `home-page` | Home page hero, about, CTA copy |

---

## MSV-GUIDE rules

- TypeScript only — no JavaScript, no Python
- `fetch` not `axios`
- Secrets in `.env` only — never committed
- No deploy without explicit MSV approval
- Port: `3333` (avoids conflict with existing Coolify apps)

---

## Local dev

```bash
# 1. Clone
git clone git@github.com:msvillarruz/TTLC_CMS.git
cd TTLC_CMS

# 2. Install
npm install

# 3. Set up env
cp .env.example .env
# Edit .env with real values

# 4. Start dev server
npm run dev
# Admin: http://localhost:3333/admin
```

---

## Production deploy

Managed by Coolify. Push to `main` → Coolify auto-deploys.

Environment variables are set in Coolify UI — not in this repo.

---

## API endpoints (used by Next.js frontend)

```
GET  /api/programs          → All active programs
GET  /api/articles          → Published articles (paginated)
GET  /api/articles?slug=X   → Single article
GET  /api/events            → Upcoming events
GET  /api/announcements     → Active announcements
GET  /api/globals/site-settings
GET  /api/globals/home-page
POST /api/trial-requests    → Submit trial class booking
POST /api/revalidate        → Webhook to trigger Next.js ISR (secured)
```

---

## Changelog

See `/CHANGELOG.md`

