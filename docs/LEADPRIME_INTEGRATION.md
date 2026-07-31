# Leadprime integration handoff

The interface and server boundary are complete. Production credentials and endpoints are intentionally absent.

## 1. Estimate form webhook

The browser posts `multipart/form-data` to `POST /api/leads`. The server validates the request and forwards the same multipart body to `LEADPRIME_WEBHOOK_URL`.

### Required fields

- `full_name`
- `phone`
- `project_location`
- `project_type`
- `project_details`
- `contact_consent` with value `yes`

### Optional fields

- `email`
- `timeline`
- `preferred_language` (`es` or `en`)
- `attachments` (PDF, JPG, JPEG, or PNG; UI and API limit: 10 MB per file)

### Server-added fields

- `source`: `Perez Rough Frame Specialist Website`
- `lead_type`: `Website Estimate Request`
- `submitted_at`: ISO-8601 timestamp

Any `2xx` webhook response is treated as accepted. Non-2xx responses produce a safe error message and never display a false success.

### Security requirements

- Keep the webhook URL server-side. Never expose it as `NEXT_PUBLIC_*`.
- Require HTTPS in production.
- Add signature or shared-secret verification when Leadprime defines its final webhook contract.
- Retain file-type and malware scanning inside Leadprime or its upload service before permanent storage.
- Apply rate limiting at Railway, Leadprime, or an API gateway before advertising heavily.
- Do not log full submissions or attachments in production logs.

When `LEADPRIME_WEBHOOK_URL` is missing, `/api/leads` returns `503` with `LEADPRIME_CONNECTION_PENDING`. The page clearly tells the visitor that the form was not sent and offers phone/text contact.

## 2. Leadprime chat

The floating chat panel is a visual placeholder. Replace its inner panel only after receiving the official Embed Kit requirements.

Required handoff information:

- official embed script or React package
- production assistant/agent identifier
- allowed production domain(s)
- language behavior and Spanish default
- business knowledge-base ownership and update process
- lead-capture tool schema
- escalation to phone/text/human
- consent and privacy behavior
- event names needed for analytics

Do not create a generic fallback bot. The assistant must use the Perez account's Leadprime identity and knowledge base. Essential business information must remain public on the website even after chat is connected.

## Acceptance test after wiring

1. Submit Spanish and English leads.
2. Confirm Leadprime creates exactly one record per submission.
3. Confirm source, language, project type, location, consent, and attachments map correctly.
4. Confirm webhook failure never shows success.
5. Ask the chat about service area, framing services, license, bid sets, and estimates.
6. Confirm unknown facts are not invented.
7. Confirm human escalation works and is recorded in Leadprime.
