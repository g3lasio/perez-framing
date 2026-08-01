import { buildLeadPayload, forwardLead, resolveWebhookUrl, type LeadAttachment } from "@/lib/leadprime";
import { validateEstimateDate } from "@/lib/scheduling";

const MAX_REQUEST_BYTES = 35 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const REQUIRED_FIELDS = [
  "full_name",
  "phone",
  "project_location",
  "project_type",
  "project_details",
  "contact_consent",
];

const ALLOWED_ATTACHMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export async function POST(request: Request) {
  const webhookUrl = resolveWebhookUrl();

  if (!webhookUrl) {
    return Response.json(
      {
        ok: false,
        code: "LEADPRIME_CONNECTION_PENDING",
        message: "The Leadprime webhook has not been connected yet.",
      },
      { status: 503 },
    );
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return Response.json({ ok: false, code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const payload = await request.formData();

    // Honeypot: bots fill every field they can see. Answer as if it worked so the
    // bot does not learn the trap exists, and forward nothing.
    if (String(payload.get("website") ?? "").trim()) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const hasMissingField = REQUIRED_FIELDS.some(
      (field) => !String(payload.get(field) ?? "").trim(),
    );

    if (hasMissingField) {
      return Response.json({ ok: false, code: "INVALID_LEAD_REQUEST" }, { status: 400 });
    }

    if (String(payload.get("contact_consent")) !== "yes") {
      return Response.json({ ok: false, code: "CONTACT_CONSENT_REQUIRED" }, { status: 400 });
    }

    // Estimate visits are weekends only, booked a few days out. Enforced here too so
    // a request that skips the browser cannot put an unworkable day on the calendar.
    const requestedDate = String(payload.get("preferred_date") ?? "").trim();
    if (validateEstimateDate(requestedDate)) {
      return Response.json({ ok: false, code: "ESTIMATE_DATE_NOT_AVAILABLE" }, { status: 400 });
    }

    const files = payload
      .getAll("attachments")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (files.some((file) => file.size > MAX_ATTACHMENT_BYTES)) {
      return Response.json({ ok: false, code: "ATTACHMENT_TOO_LARGE" }, { status: 413 });
    }

    if (files.some((file) => !ALLOWED_ATTACHMENT_TYPES.has(file.type))) {
      return Response.json({ ok: false, code: "ATTACHMENT_TYPE_NOT_ALLOWED" }, { status: 415 });
    }

    const attachments: LeadAttachment[] = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const result = await forwardLead(webhookUrl, buildLeadPayload(payload, attachments));

    if (!result.ok) {
      // Never log the submission itself — only why delivery failed.
      console.error(`[leads] Leadprime delivery failed: ${result.code}`);
      return Response.json({ ok: false, code: result.code }, { status: result.status });
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ ok: false, code: "LEAD_REQUEST_FAILED" }, { status: 500 });
  }
}
