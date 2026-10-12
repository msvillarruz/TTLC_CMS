# Tiny Thinkers public website

Next.js App Router frontend for https://www.tinythinkers.edu.ph. Content comes from the public Payload CMS API; no CMS credentials are needed to build the marketing website.

## Local checks

Use Node 22.6 or newer for the TypeScript test scripts (validation used Node 24).

```bash
npm ci
npm run typecheck
npm run test:seo
npm run build
npm run verify:seo
```

`verify:seo` starts the built website on loopback port 3032, reads the sitemap, and checks the corresponding pages and public metadata endpoints. It sends GET requests only and shuts down its server afterward. The public CMS and configured sharing image must be reachable for this integration check.

## SEO content ownership

- Page metadata uses the canonical www host. Published article SEO overrides and uploaded sharing images come from the CMS.
- The school JSON-LD, footer contact information, and homepage FAQs read existing CMS fields. JSON-LD escapes CMS text safely.
- The sitemap paginates public programs, published articles, and public events. Programs marked no longer enrolling remain public under the current CMS access model; they are not drafts. CMS failures fail the sitemap instead of emitting a partial successful response.
- `STATIC_CONTENT_UPDATED_AT` tracks this release's significant static content/schema update. Change it only for a real reviewed update. Never replace it with a request-time or build-time clock.
- CMS `ageRange` is the preferred display text. Decimal age labels are not converted automatically because their intended meaning needs school approval.
- Parent FAQs contain verified public facts. New claims about tuition, teaching policies or admission rules require approved CMS content.
- `llms.txt` is an optional public summary, not a guaranteed SEO or AI ranking mechanism.
- The wildcard robots policy preserves public crawler access. Search and model-training permission are separate business decisions. Private CMS resources retain their existing authentication and are not listed in the sitemap.

After an approved release, check live `/robots.txt`, `/sitemap.xml`, `/llms.txt`, canonical URLs and sharing images, submit the sitemap to the verified Google Search Console property, and rerun the same Framer scan.

Deployment requires explicit owner approval under the repository's CMS README.
