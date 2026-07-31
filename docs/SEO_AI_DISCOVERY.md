# SEO and AI discovery

The discoverability layer is intentionally based on public, crawlable facts rather than information hidden inside a chat widget.

## Implemented

- bilingual homepage copy with specific services, location, license, contact, and builder workflow
- Next.js metadata, Open Graph, Twitter card, canonical URL, and web manifest
- `GeneralContractor` JSON-LD with legal name, license identifier, contact, location, languages, and service radius
- `/company-profile` as a stable factual reference for people, search engines, and AI systems
- `/robots.txt` and `/sitemap.xml`
- `/llms.txt` and `/llms-full.txt` as machine-readable summaries
- descriptive project-image alternative text
- FAQ content visible in page HTML
- guardrails that distinguish 25+ years of professional experience from corporate age

## Domain dependency

The final domain is not confirmed. Set `NEXT_PUBLIC_SITE_URL` in Railway when it is known. That value controls canonical links, sitemap URLs, and crawler host information.

## Content rule

The Leadprime assistant can answer questions, but it cannot be the only place where important business facts exist. Any confirmed change to services, coverage, identity, license, or contact information must also be added to the public homepage and business profile.

`llms.txt` is an emerging convention, not a replacement for strong HTML, structured data, or search-engine indexing.
