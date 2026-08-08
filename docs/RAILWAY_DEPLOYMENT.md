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
NEXT_PUBLIC_SITE_URL=https://perezroughframing.com
LEADPRIME_WEBHOOK_URL=https://leadprime.chyrris.com/api/leads/webhook/<key>
```

`NEXT_PUBLIC_SITE_URL` must be the canonical apex, with no trailing slash and no
`www`. Every absolute URL the site emits is derived from it. If it is unset the
build falls back to whatever domain Railway reports and prints a warning naming
that value — check the build log if canonical ever looks wrong.

## Domains

- Apex `perezroughframing.com` is canonical and is what `NEXT_PUBLIC_SITE_URL` holds.
- `www` must exist in DNS as a CNAME to the Railway target and be added as a
  custom domain in Railway, or it resolves to nothing. Once it reaches the app,
  `proxy.ts` answers it with a 301 to the apex, path and query preserved.
- Keep the Cloudflare proxy grey (DNS only) until Railway issues the certificate.
  After that, if the proxy is enabled, SSL must be Full (strict).

`LEADPRIME_WEBHOOK_URL` is required for the estimate form to deliver leads. It is
deliberately not in the repository: this repo is public and the webhook is an
unauthenticated intake endpoint, so anyone holding the key could create leads in
the account. Keep it in Railway only. `LEADPRIME_WEBHOOK_KEY` works as an
alternative if you prefer to store just the key.

Without it the site still runs, and the form explicitly reports that the request
was not sent and offers phone and text contact instead of a false success.

The assistant needs no variables — it falls back to the account's published Embed
Kit token. Override it with `NEXT_PUBLIC_LEADPRIME_WIDGET_TOKEN` after rotating
the token in Leadprime. `NEXT_PUBLIC_*` values are inlined at build time, so
changing one requires a redeploy.

See [LEADPRIME_INTEGRATION.md](LEADPRIME_INTEGRATION.md) for the full list,
including optional HMAC signing.

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
- Estimate form delivers a test lead into Leadprime; confirm it appears in the
  account, then delete it. Without `LEADPRIME_WEBHOOK_URL` the form shows the
  pending state instead.
- The assistant opens, greets in the site's current language, and answers.
- The webhook URL does not appear in page source or browser network requests.
  The `lp_wid_…` widget token does appear — that one is public by design.
- The widget token's domain allow-list in Leadprime names the production domain.
