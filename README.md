# Perez Rough Frame Specialist

Production-ready bilingual website for Perez Rough Frame Specialist. Built with Next.js App Router and prepared for Railway.

## What is complete

- Spanish-first site with an English toggle
- Responsive layout, mobile contact bar, project gallery, lightbox, before/after comparison, services, process, FAQ, and builder/GC bid route
- Real project images and business-controlled contact information
- Public contractor license reference: CSLB #1144949
- SEO metadata, JSON-LD, `robots.txt`, `sitemap.xml`, web manifest, public business profile, privacy notice, `llms.txt`, and `llms-full.txt`
- Lead intake API with validation, honeypot protection, attachment-size checks, and a safe pending state
- Leadprime assistant placeholder that does not pretend the chat is connected

## The only pending production connections

1. Set `LEADPRIME_WEBHOOK_URL` to the final Leadprime multipart intake endpoint.
2. Replace the assistant placeholder with the official Leadprime Embed Kit once its production URL/configuration is provided.

See [docs/LEADPRIME_INTEGRATION.md](docs/LEADPRIME_INTEGRATION.md) for the payload and handoff contract.

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
