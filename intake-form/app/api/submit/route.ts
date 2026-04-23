import { NextResponse } from "next/server";
import { validate, normalizePhone, IntakeSubmission } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const webhookUrl = process.env.MAKE_INTAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[intake/submit] MAKE_INTAKE_WEBHOOK_URL not configured");
    return NextResponse.json(
      { error: "Server not configured. Contact alex@leadcatch.homes." },
      { status: 500 }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const body = raw as Partial<IntakeSubmission>;

  const submission: IntakeSubmission = {
    stripe_customer_id: String(body.stripe_customer_id ?? "").trim(),
    business_name: String(body.business_name ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    hours: String(body.hours ?? "").trim(),
    service_area: String(body.service_area ?? "").trim(),
    state: String(body.state ?? "").trim(),
    zip: String(body.zip ?? "").trim(),
    services: String(body.services ?? "").trim(),
    calendar_preference: (body.calendar_preference ?? "Google Calendar") as IntakeSubmission["calendar_preference"],
    calendar_email: String(body.calendar_email ?? "").trim(),
    timezone: String(body.timezone ?? "").trim(),
    decline_types: String(body.decline_types ?? "").trim(),
  };

  const normalizedPhone = normalizePhone(submission.phone);
  if (normalizedPhone) submission.phone = normalizedPhone;

  const errors = validate(submission);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[intake/submit] Make webhook failed", {
        status: res.status,
        body: text.slice(0, 500),
        stripe_customer_id: submission.stripe_customer_id,
      });
      return NextResponse.json(
        { error: "Submission failed upstream. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    clearTimeout(timeout);
    console.error("[intake/submit] Fetch error", {
      err: err instanceof Error ? err.message : String(err),
      stripe_customer_id: submission.stripe_customer_id,
    });
    return NextResponse.json(
      { error: "Network error reaching intake service. Please try again." },
      { status: 502 }
    );
  }
}
