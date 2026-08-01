# Instructions for AI and coding agents

This repository is the business-controlled source for the Perez Rough Framing website.

## Product intent

The site must communicate two clear paths:

1. Homeowners can request a project review for framing, additions, and structural renovations.
2. Builders and general contractors can send bid sets and framing opportunities for fit and availability review.

The default language is Spanish. English remains available through the existing toggle. Preserve the direct, restrained, construction-focused visual style and keep mobile calling, texting, and estimate actions easy to reach.

## Canonical business facts

- Public brand: Perez Rough Framing. This is the only name. No "Specialist" variant, no corporate suffix.
- Legal entity: PENDING CONFIRMATION from the owner. Nothing renders it. Do not publish a guess anywhere, including JSON-LD.
- CSLB license: #1144949 — Class B, General Building Contractor
- Insurance: general liability and workers' compensation in force (confirmed by the owner). Publish that coverage exists; never publish policy numbers, limits, or renewal dates.
- Certifications: commercial, government, and residential work
- Crew: 11 people on payroll
- License and corporation age: 3 years
- Base: San Pablo, CA 94806
- General service radius: approximately 35 miles, subject to project fit
- Phone: (415) 419-4496
- Email: perez.hp450@gmail.com
- Languages: Spanish and English
- Experience statement: 25+ years of hands-on construction experience. This belongs to the owner, not the company.
- Estimates: free, in person, weekends only, scheduled 2 to 5 days ahead
- Pricing: in person only. No channel publishes prices, ranges, square-foot rates, or minimums

Read `docs/BUSINESS_SOURCE_OF_TRUTH.md` before changing services, identity, contact information, claims, metadata, structured data, or AI-facing files. Keep the homepage, `/company-profile`, JSON-LD, metadata, `llms.txt`, and `llms-full.txt` consistent.

## Claims guardrail

Insurance coverage, certifications, and crew size were confirmed by the owner and are published as facts only — coverage exists, 11 on payroll, certified for commercial/government/residential. Do not extend them into limits, policy numbers, renewal dates, bonding, or guaranteed availability.

Do not publish or infer any of the following without current documentary support supplied by the business:

- insurance limits, policy numbers, coverage amounts, renewal dates, or bonding
- guaranteed crew availability for a given schedule
- certifications beyond the public license record and the confirmed list above
- guaranteed permits, inspections, schedules, financing, rankings, leads, contracts, or outcomes
- testimonials, star ratings, project values, or client names
- any price, range, square-foot rate, or minimum, on any channel
- the 25+ years figure attached to the company rather than the owner, or any founding year implying it

When adding project photographs, use only business-owned images and describe only what is visibly supported or confirmed.

## Leadprime integration boundary

Both connections are wired. Read `docs/LEADPRIME_INTEGRATION.md` before changing either.

1. The estimate form posts to `/api/leads`, which normalizes the submission into Leadprime's JSON lead-webhook contract and forwards it. Leadprime's webhook does **not** parse `multipart/form-data`; do not send it multipart.
2. The chat panel is the Leadprime Embed Kit, called through the public widget endpoints (`/api/widget/config`, `/api/widget/chat`) so it keeps the site's language toggle and visual language.

Rules that still hold:

- The webhook URL/key stays server-side and out of the repository. This repo is public and the endpoint is unauthenticated, so a committed key is a live lead-injection vector. The `lp_wid_…` widget token is different — it is public by design and ships in page source.
- Do not invent webhook URLs, secrets, agent IDs, or account IDs.
- Do not add a local fallback bot. If Leadprime rejects the token or is unreachable, the assistant hides itself or points the visitor at phone and text — it never answers on its own.
- Never show a success state for a submission that was not delivered.

## Deployment

Target hosting is Railway. Keep `npm run build` and `npm run start` working. Do not reintroduce Cloudflare Sites/Vinext files unless the hosting decision changes. The final domain is not yet confirmed; canonical URLs use `NEXT_PUBLIC_SITE_URL`.

## Completion gate

Before committing meaningful changes:

```bash
npm run lint
npm run build
```

Also verify the Spanish and English views, mobile navigation, phone/text/email links, project lightbox, comparison slider, form pending behavior, `/company-profile`, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
