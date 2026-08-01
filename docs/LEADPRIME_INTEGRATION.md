# Leadprime integration

Both connections are live in the code. What remains is configuration: the intake
webhook key belongs in the Railway environment and must not be committed, because
this repository is public and the webhook is unauthenticated.

## 1. Estimate form → Leadprime lead webhook

The browser posts `multipart/form-data` to `POST /api/leads`. The route validates
the submission and forwards it to Leadprime as **JSON** — Leadprime's webhook
(`POST /api/leads/webhook/<key>`) parses `application/json` or
`application/x-www-form-urlencoded` and ignores multipart bodies entirely.

### Environment

```text
# Either the full URL…
LEADPRIME_WEBHOOK_URL=https://leadprime.chyrris.com/api/leads/webhook/<key>

# …or just the key (the URL is assembled from LEADPRIME_API_BASE, which
# defaults to https://leadprime.chyrris.com)
LEADPRIME_WEBHOOK_KEY=<key>

# Optional. Set only after rotating the key in Leadprime, which is what issues
# the HMAC secret. When present, requests are signed with X-LeadPrime-Signature.
LEADPRIME_WEBHOOK_SECRET=<hmac secret>
```

With none of these set, `/api/leads` returns `503 LEADPRIME_CONNECTION_PENDING`
and the page tells the visitor their information was not sent and offers phone
and text contact. It never shows a false success.

### Field mapping

| Form field | Leadprime field | Stored as |
| --- | --- | --- |
| `full_name` | `name` | `leads.name` |
| `phone` | `phone` | `leads.phone`, normalized to E.164 |
| `email` | `email` | `leads.email` |
| `project_location` | `city` | `leads.city` |
| `project_type` | `project_type` | `leads.project_type` |
| `timeline` | `timeline` | `leads.timeline` |
| `project_details` | `message` | `leads.notes` in full, plus a 200-character preview in `leads.ai_summary` |
| `contact_consent` | `consent` | `leads.has_sms_consent` + a `lead_consent` audit row |
| `consent_text` | `consent_text` | the exact wording shown, stored on the consent record |
| `utm_*`, `gclid`, `fbclid`, `msclkid` | same names | campaign attribution columns |
| `page_url` | `page_url` | `lead_consent.source_url` |

Leadprime has no column for project location, preferred language, or origin, so
those are appended to `message` as labelled lines and land in `leads.notes`
alongside the visitor's own text.

Campaign values are captured from the landing URL on arrival and kept in
`sessionStorage` for the session (`lib/attribution.ts`), first touch wins. A lead
with `gclid` is filed by Leadprime as `google_ads`, `fbclid` as `meta_ads`,
`msclkid` as `microsoft_ads`, a bare `utm_source` under that source, and a visit
with no campaign data as `webhook` / `Formulario Web`.

### Delivery behavior

- Any `2xx` from Leadprime is treated as accepted.
- A transport error or `5xx` is retried once before reporting failure.
- A `4xx` is reported immediately; retrying an identical body cannot help.
- Failures return `502` with a specific code and surface the error state on the
  page. Submissions and attachments are never written to the logs.

### Attachments — known gap

Leadprime's lead webhook accepts JSON only, and the account has no public
attachment endpoint tied to the webhook key, so browser-selected files cannot
reach the CRM. Rather than a picker that silently discards files, the form points
visitors at email and text for photos and plans.

To close this properly, Leadprime would need a lead-attachment intake
(multipart accepted on the webhook key, files stored via `s3Service`, and rows
linked to the lead so they render in the lead view). Until then the email and
text route is the working path.

## 2. Business assistant → Leadprime Embed Kit

The assistant (`components/AssistantChat.tsx`) talks to the same public endpoints
Leadprime's own `embed.js` calls, so answers come from the account's agent and
knowledge base — there is no local fallback bot.

- `GET /api/widget/config?token=…` — agent name, greeting, consent settings the
  owner manages in Leadprime. A `401`/`403` hides the assistant entirely rather
  than showing a chat that cannot answer.
- `POST /api/widget/chat` — `{ token, message, sessionId, leadId, pageUrl, pageTitle }`
  returning `{ reply, sessionId, leadId }`. The returned `leadId` is carried into
  later turns so the agent keeps cross-channel context, and the session id stays
  stable for the whole conversation.

The site renders this inside its own panel instead of injecting `embed.js` so the
assistant follows the Spanish/English toggle, the site's visual language, and its
keyboard and focus behavior, and so it does not collide with the mobile contact
bar. Lead capture during a conversation is handled by Leadprime's own agent tool.

### Environment

```text
# Optional. Defaults to the account's published widget token.
NEXT_PUBLIC_LEADPRIME_WIDGET_TOKEN=lp_wid_…

# Optional. Defaults to https://leadprime.chyrris.com
NEXT_PUBLIC_LEADPRIME_API_BASE=
```

The widget token is a public credential — the official Embed Kit ships it in page
source. The real boundary is the per-token domain allow-list in Leadprime.

**Set the allow-list to the production domain** in the account's widget settings
(`widget_tokens.allowed_origins`). Without it the token works from any origin,
which lets a copied token spend the account's AI budget from another site.
Leadprime always permits `localhost`, so local development keeps working.

## Acceptance test after wiring

1. Submit Spanish and English leads; confirm exactly one lead per submission.
2. Confirm name, phone, email, location, project type, timeline, consent, and the
   full message body arrive intact.
3. Submit with `?utm_source=…&gclid=…` on the landing URL and confirm Leadprime
   files the lead under Google Ads.
4. Confirm a webhook failure never shows success.
5. Ask the assistant about service area, framing services, license, bid sets, and
   estimates; confirm it does not invent facts.
6. Confirm the call and text escalations work from inside the chat panel.
