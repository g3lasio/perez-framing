# Perez Rough Frame Specialist

Production-ready bilingual website for Perez Rough Frame Specialist. Built with Next.js App Router and prepared for Railway.

## What is complete

- Spanish-first site with an English toggle
- Responsive layout, mobile contact bar, project gallery, lightbox, before/after comparison, services, process, FAQ, and builder/GC bid route
- Real project images and business-controlled contact information
- Public contractor license reference: CSLB #1144949
- SEO metadata, JSON-LD, `robots.txt`, `sitemap.xml`, web manifest, public business profile, privacy notice, `llms.txt`, and `llms-full.txt`
- Lead intake API with validation, honeypot protection, campaign attribution, delivery retry, and a safe pending state
- Estimate form wired to the Leadprime lead webhook, including consent capture for A2P 10DLC
- Business assistant powered by the Leadprime Embed Kit, in Spanish and English

## Configuration required before launch

Set `LEADPRIME_WEBHOOK_URL` (or `LEADPRIME_WEBHOOK_KEY`) in Railway. It is not in
this repository on purpose — the repo is public and the webhook is unauthenticated,
so committing the key would let anyone create leads in the account.

Also set the widget token's domain allow-list inside Leadprime to the production
domain, so the assistant can only run from this site.

See [docs/LEADPRIME_INTEGRATION.md](docs/LEADPRIME_INTEGRATION.md) for the payload
contract, field mapping, and the known attachment gap.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```

## Railway

1. Create a Railway service from this repository.
2. Keep the root directory at `/`.
3. Add the variables from `.env.example`.
4. Deploy. Railway uses `npm run start` and supplies `PORT` automatically.
5. After connecting the final domain, set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS URL and redeploy.

Full handoff: [docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md).

## Source of truth

- Public facts: `/company-profile` and `public/llms-full.txt`
- Maintainer facts and guardrails: [docs/BUSINESS_SOURCE_OF_TRUTH.md](docs/BUSINESS_SOURCE_OF_TRUTH.md)
- Instructions for coding agents: [AGENTS.md](AGENTS.md)

Do not add claims about insurance, bonding protection, certifications, crew size, guaranteed results, or financing without current supporting documentation from the business.
