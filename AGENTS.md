# Instructions for AI and coding agents

This repository is the business-controlled source for the Perez Rough Frame Specialist website.

## Product intent

The site must communicate two clear paths:

1. Homeowners can request a project review for framing, additions, and structural renovations.
2. Builders and general contractors can send bid sets and framing opportunities for fit and availability review.

The default language is Spanish. English remains available through the existing toggle. Preserve the direct, restrained, construction-focused visual style and keep mobile calling, texting, and estimate actions easy to reach.

## Canonical business facts

- Public brand: Perez Rough Frame Specialist
- Legal entity: Perez Rough Frame Specialists Corp.
- CSLB license: #1144949
- Base: San Pablo, CA 94806
- General service radius: approximately 35 miles, subject to project fit
- Phone: (415) 419-4496
- Email: perez.hp450@gmail.com
- Languages: Spanish and English
- Experience statement: 25+ years of hands-on construction experience. Never convert this into a claim that the corporation has existed for 25 years.

Read `docs/BUSINESS_SOURCE_OF_TRUTH.md` before changing services, identity, contact information, claims, metadata, structured data, or AI-facing files. Keep the homepage, `/company-profile`, JSON-LD, metadata, `llms.txt`, and `llms-full.txt` consistent.

## Claims guardrail

Do not publish or infer any of the following without current documentary support supplied by the business:

- “bonded and insured” or insurance limits
- crew size or guaranteed availability
- certifications beyond the public license record
- guaranteed permits, inspections, schedules, financing, rankings, leads, contracts, or outcomes
- testimonials, star ratings, project values, or client names

When adding project photographs, use only business-owned images and describe only what is visibly supported or confirmed.

## Leadprime integration boundary

Only two items are intentionally pending:

1. The contact form posts to `/api/leads`, which forwards multipart form data only when `LEADPRIME_WEBHOOK_URL` exists.
2. The visible chat panel is a placeholder until the official Leadprime Embed Kit configuration is supplied.

Do not invent webhook URLs, secrets, agent IDs, account IDs, or chat scripts. Do not silently fall back to a generic assistant. Follow `docs/LEADPRIME_INTEGRATION.md`.

## Deployment

Target hosting is Railway. Keep `npm run build` and `npm run start` working. Do not reintroduce Cloudflare Sites/Vinext files unless the hosting decision changes. The final domain is not yet confirmed; canonical URLs use `NEXT_PUBLIC_SITE_URL`.

## Completion gate

Before committing meaningful changes:

```bash
npm run lint
npm run build
```

Also verify the Spanish and English views, mobile navigation, phone/text/email links, project lightbox, comparison slider, form pending behavior, `/company-profile`, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
