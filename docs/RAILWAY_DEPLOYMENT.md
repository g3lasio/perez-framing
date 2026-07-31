# Railway deployment

## Create the service

1. In Railway, choose **New Project → Deploy from GitHub repo**.
2. Select `g3lasio/perez-framing` and branch `main`.
3. Leave the root directory blank.
4. Railway should detect Next.js, run `npm ci` and `npm run build`, then start with `npm run start`.

`railway.toml` includes the start and health-check settings.

## Variables

Add:

```text
NEXT_PUBLIC_SITE_URL=https://your-final-domain.com
LEADPRIME_WEBHOOK_URL=
NEXT_PUBLIC_LEADPRIME_CHAT_URL=
```

The site works before the two Leadprime values are connected. The form will explicitly report that online delivery is pending; the chat remains marked as coming soon.

## Domain and indexing

After the customer approves the final domain:

1. Add the custom domain in Railway.
2. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS origin with no trailing slash.
3. Redeploy so metadata, sitemap, robots, and JSON-LD use the final origin.
4. Verify `/`, `/company-profile`, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
5. Add the final domain to Google Search Console and submit `/sitemap.xml`.

Do not request indexing while the site is private, while the final domain is unknown, or while old domains still publish conflicting business identities.

## Post-deploy smoke test

- Spanish loads by default; English toggle persists after selection.
- Call, text, and email links use the approved business contact.
- Mobile navigation and bottom contact bar work.
- Project images, lightbox, before/after control, and FAQ work.
- Estimate form shows the pending state until the webhook is configured.
- No secrets appear in page source or browser network requests.
