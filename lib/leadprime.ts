/**
 * Server-side Leadprime intake client.
 *
 * The Leadprime lead webhook (`POST /api/leads/webhook/<key>`) accepts a JSON
 * body — it does not parse `multipart/form-data`. Everything the browser posts
 * to `/api/leads` is therefore normalized here into the field names Leadprime
 * recognizes before it is forwarded.
 *
 * The webhook key must never reach the browser: it is an unauthenticated intake
 * endpoint, so anyone holding it can create leads in the account. Keep it in the
 * server environment only (never a `NEXT_PUBLIC_*` variable, never committed).
 */

import crypto from "node:crypto";

const DEFAULT_API_BASE = "https://leadprime.chyrris.com";

export type LeadAttachment = {
  name: string;
  size: number;
  type: string;
};

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  project_type?: string;
  timeline?: string;
  message: string;
  consent: boolean;
  consent_text?: string;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
};

/**
 * Resolve the intake endpoint. Either the full URL or just the webhook key can be
 * configured; the key form keeps the Railway variable short and unambiguous.
 */
export function resolveWebhookUrl(): string | null {
  const explicit = process.env.LEADPRIME_WEBHOOK_URL?.trim();
  if (explicit) return explicit;

  const key = process.env.LEADPRIME_WEBHOOK_KEY?.trim();
  if (!key) return null;

  const base = (process.env.LEADPRIME_API_BASE?.trim() || DEFAULT_API_BASE).replace(/\/$/, "");
  return `${base}/api/leads/webhook/${key}`;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

function text(form: FormData, field: string, max = 500): string {
  return String(form.get(field) ?? "")
    .trim()
    .slice(0, max);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Build the Leadprime payload.
 *
 * Leadprime stores a fixed set of lead columns, so anything without a column of
 * its own (timeline detail, language, project location, attachments) is folded
 * into `message`, which is persisted in full on the lead record.
 */
export function buildLeadPayload(form: FormData, attachments: LeadAttachment[] = []): LeadPayload {
  const language = text(form, "preferred_language", 2) === "en" ? "en" : "es";
  const spanish = language === "es";

  const location = text(form, "project_location", 160);
  const projectType = text(form, "project_type", 160);
  const timeline = text(form, "timeline", 160);
  const details = text(form, "project_details", 4000);
  const consentText = text(form, "consent_text", 600);

  const lines: string[] = [];
  if (details) lines.push(details);

  const facts: string[] = [];
  if (location) facts.push(spanish ? `Ubicación: ${location}` : `Location: ${location}`);
  if (projectType) facts.push(spanish ? `Tipo de proyecto: ${projectType}` : `Project type: ${projectType}`);
  if (timeline) facts.push(spanish ? `Cuándo desea comenzar: ${timeline}` : `Desired start: ${timeline}`);
  facts.push(spanish ? "Idioma preferido: Español" : "Preferred language: English");
  facts.push(
    spanish
      ? "Origen: formulario de estimado del sitio web"
      : "Source: website estimate form",
  );

  if (attachments.length > 0) {
    const listed = attachments
      .map((file) => `${file.name} (${formatBytes(file.size)})`)
      .join(", ");
    facts.push(
      spanish
        ? `Archivos adjuntos seleccionados: ${listed}`
        : `Attachments selected: ${listed}`,
    );
  }

  lines.push("", facts.join("\n"));

  return {
    name: text(form, "full_name", 200),
    phone: text(form, "phone", 40),
    email: text(form, "email", 200) || undefined,
    city: location || undefined,
    project_type: projectType || undefined,
    timeline: timeline || undefined,
    message: lines.join("\n").trim(),
    consent: text(form, "contact_consent", 10) === "yes",
    consent_text: consentText || undefined,
    page_url: text(form, "page_url", 500) || undefined,
    referrer: text(form, "referrer", 500) || undefined,
    ...Object.fromEntries(
      UTM_KEYS.map((key) => [key, text(form, key, 200) || undefined]).filter(
        ([, value]) => Boolean(value),
      ),
    ),
  };
}

/**
 * Optional shared-secret signature. Leadprime verifies
 * `HMAC-SHA256(webhook_hmac_secret, JSON.stringify(parsedBody))`, so the exact
 * serialized string sent on the wire is what gets signed.
 */
export function signBody(body: string): string | null {
  const secret = process.env.LEADPRIME_WEBHOOK_SECRET?.trim();
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export type ForwardResult =
  | { ok: true }
  | { ok: false; status: number; code: string };

/**
 * Forward the lead. One retry on a transport error or 5xx — the visitor only gets
 * a single chance to submit, so a transient blip should not cost the business a lead.
 */
export async function forwardLead(url: string, payload: LeadPayload): Promise<ForwardResult> {
  const body = JSON.stringify(payload);
  const signature = signBody(body);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (signature) headers["X-LeadPrime-Signature"] = signature;

  let lastStatus = 0;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(15_000),
      });

      if (response.ok) return { ok: true };

      lastStatus = response.status;

      // 4xx means Leadprime rejected the payload itself — retrying sends the
      // identical body and would fail the same way.
      if (response.status < 500) {
        return {
          ok: false,
          status: 502,
          code: response.status === 404 ? "LEADPRIME_WEBHOOK_NOT_FOUND" : "LEADPRIME_WEBHOOK_REJECTED",
        };
      }
    } catch {
      lastStatus = 0;
    }
  }

  return {
    ok: false,
    status: 502,
    code: lastStatus >= 500 ? "LEADPRIME_WEBHOOK_UNAVAILABLE" : "LEADPRIME_WEBHOOK_UNREACHABLE",
  };
}
