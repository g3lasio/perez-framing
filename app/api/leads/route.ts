export async function POST(request: Request) {
  const webhookUrl = process.env.LEADPRIME_WEBHOOK_URL?.trim();

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
    if (contentLength > 35 * 1024 * 1024) {
      return Response.json(
        { ok: false, code: "REQUEST_TOO_LARGE" },
        { status: 413 },
      );
    }

    const payload = await request.formData();

    if (String(payload.get("website") ?? "").trim()) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const requiredFields = [
      "full_name",
      "phone",
      "project_location",
      "project_type",
      "project_details",
      "contact_consent",
    ];

    const hasMissingField = requiredFields.some(
      (field) => !String(payload.get(field) ?? "").trim(),
    );

    if (hasMissingField) {
      return Response.json(
        { ok: false, code: "INVALID_LEAD_REQUEST" },
        { status: 400 },
      );
    }

    if (String(payload.get("contact_consent")) !== "yes") {
      return Response.json(
        { ok: false, code: "CONTACT_CONSENT_REQUIRED" },
        { status: 400 },
      );
    }

    const attachments = payload
      .getAll("attachments")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (attachments.some((file) => file.size > 10 * 1024 * 1024)) {
      return Response.json(
        { ok: false, code: "ATTACHMENT_TOO_LARGE" },
        { status: 413 },
      );
    }

    const allowedTypes = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
    ]);

    if (attachments.some((file) => !allowedTypes.has(file.type))) {
      return Response.json(
        { ok: false, code: "ATTACHMENT_TYPE_NOT_ALLOWED" },
        { status: 415 },
      );
    }

    payload.delete("website");
    payload.set("source", "Perez Rough Frame Specialist Website");
    payload.set("lead_type", "Website Estimate Request");
    payload.set("submitted_at", new Date().toISOString());

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: payload,
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return Response.json(
        { ok: false, code: "LEADPRIME_WEBHOOK_ERROR" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { ok: false, code: "LEAD_REQUEST_FAILED" },
      { status: 500 },
    );
  }
}
