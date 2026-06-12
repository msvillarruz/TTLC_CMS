# TTLC CMS — Patterns & Gotchas Log

## 2026-06-12 — Coolify / Traefik routing
Problem: Assumed Nginx was the reverse proxy
Cause: Coolify uses Traefik by default, routing is label-based and automatic
Fix: No manual proxy config needed after redeploy

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
