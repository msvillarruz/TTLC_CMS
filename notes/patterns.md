# TTLC CMS — Patterns & Gotchas Log

## 2026-06-12 — Coolify / Traefik routing
Problem: Assumed Nginx was the reverse proxy
Cause: Coolify uses Traefik by default, routing is label-based and automatic
Fix: No manual proxy config needed after redeploy; run `ttlc-remap` to prune stale containers

## 2026-06-12 — Payload CSRF Login Loop
Problem: Admin login loops in production
Cause: Payload builds CSRF allowlist from serverURL; browsers omit Origin on same-origin GETs
Fix: Next.js middleware in cms/src/middleware.ts injects Origin header dynamically

## 2026-06-12 — Hetzner SMTP Port
Problem: Email sending fails silently
Cause: Hetzner blocks port 465
Fix: Use port 587 with requireTLS: true

## 2026-06-12 — Payload Migration vs ALTER TABLE
Problem: Full Payload migration failed on live DB
Cause: Migration tried to recreate ENUMs that already exist
Fix: Use targeted ALTER TABLE for schema changes only

## 2026-06-12 — Payload Global 500 (footer_logo_id)
Problem: GET/POST /api/globals/site-settings returns 500
Cause: CMS container cached a query referencing a column added after initial deploy
Fix: ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_logo_id INTEGER REFERENCES media(id);
Note: Column already existed — error was from stale container startup logs; self-resolved on container restart

## Infrastructure Reference
- Server: root@5.223.65.121 (Hetzner)
- CMS container filter: eyuvq
- DB container: m10xrjirsfs459jpmhwzf5co | DB: ttlc_cms | user: postgres
- Remap script: /usr/local/bin/ttlc-nginx-remap.sh | alias: ttlc-remap
- Payload globals: flat field API even when schema uses tabs

## GitHub Secrets Required
| Secret | Source |
|--------|--------|
| COOLIFY_WEBHOOK_URL | Coolify → Application → Webhooks → Deploy Webhook |
| COOLIFY_TOKEN | Coolify → Keys & Tokens → API Tokens |
