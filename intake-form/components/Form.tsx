"use client";

import { useEffect, useMemo, useState } from "react";
import { Field, inputClass } from "./Field";
import { US_STATES } from "@/lib/states";
import { US_TIMEZONES, DEFAULT_TIMEZONE } from "@/lib/timezones";
import {
  IntakeSubmission,
  isValidStripeCustomerId,
  normalizePhone,
  validate,
} from "@/lib/validation";

const EMPTY: IntakeSubmission = {
  stripe_customer_id: "",
  business_name: "",
  phone: "",
  hours: "",
  service_area: "",
  state: "",
  zip: "",
  services: "",
  calendar_preference: "Google Calendar",
  calendar_email: "",
  timezone: DEFAULT_TIMEZONE,
  decline_types: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function Form({ stripeCustomerId }: { stripeCustomerId: string | null }) {
  const [values, setValues] = useState<IntakeSubmission>({
    ...EMPTY,
    stripe_customer_id: stripeCustomerId ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setValues((v) => ({ ...v, stripe_customer_id: stripeCustomerId ?? "" }));
  }, [stripeCustomerId]);

  const validLink = useMemo(() => isValidStripeCustomerId(stripeCustomerId), [stripeCustomerId]);

  if (!validLink) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
        <h2 className="text-lg font-semibold">Invalid link</h2>
        <p className="mt-2 text-sm">
          This intake link is missing or invalid. Please contact{" "}
          <a href="mailto:alex@leadcatch.homes" className="underline">
            alex@leadcatch.homes
          </a>{" "}
          and we&apos;ll send you a new one.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900">
        <h2 className="text-lg font-semibold">You&apos;re all set.</h2>
        <p className="mt-2 text-sm">
          Your system will be live within 48 hours. You&apos;ll get a text from your new
          business number shortly.
        </p>
      </div>
    );
  }

  function setField<K extends keyof IntakeSubmission>(key: K, v: IntakeSubmission[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const normalizedPhone = normalizePhone(values.phone) ?? values.phone;
    const candidate: IntakeSubmission = { ...values, phone: normalizedPhone };
    const fieldErrors = validate(candidate);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body?.error ?? `Submission failed (${res.status}).`);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (err) {
      setServerError("Network error — please try again.");
      setStatus("error");
    }
  }

  const disabled = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Business name" htmlFor="business_name" error={errors.business_name} required>
        <input
          id="business_name"
          name="business_name"
          className={inputClass}
          value={values.business_name}
          onChange={(e) => setField("business_name", e.target.value)}
          autoComplete="organization"
          disabled={disabled}
        />
      </Field>

      <Field
        label="Business phone"
        htmlFor="phone"
        error={errors.phone}
        hint="US 10-digit or +E.164 format."
        required
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          className={inputClass}
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          autoComplete="tel"
          placeholder="(555) 123-4567"
          disabled={disabled}
        />
      </Field>

      <Field label="Hours" htmlFor="hours" error={errors.hours} hint="e.g. Mon-Fri 8am-6pm" required>
        <input
          id="hours"
          name="hours"
          className={inputClass}
          value={values.hours}
          onChange={(e) => setField("hours", e.target.value)}
          disabled={disabled}
        />
      </Field>

      <Field label="Service area" htmlFor="service_area" error={errors.service_area} required>
        <input
          id="service_area"
          name="service_area"
          className={inputClass}
          value={values.service_area}
          onChange={(e) => setField("service_area", e.target.value)}
          placeholder="Austin, TX metro"
          disabled={disabled}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="State" htmlFor="state" error={errors.state} required>
          <select
            id="state"
            name="state"
            className={inputClass}
            value={values.state}
            onChange={(e) => setField("state", e.target.value)}
            disabled={disabled}
          >
            <option value="">Select…</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ZIP" htmlFor="zip" error={errors.zip} required>
          <input
            id="zip"
            name="zip"
            inputMode="numeric"
            maxLength={5}
            className={inputClass}
            value={values.zip}
            onChange={(e) => setField("zip", e.target.value.replace(/\D/g, ""))}
            disabled={disabled}
          />
        </Field>
      </div>

      <Field label="Services offered" htmlFor="services" error={errors.services} required>
        <textarea
          id="services"
          name="services"
          className={inputClass}
          rows={3}
          value={values.services}
          onChange={(e) => setField("services", e.target.value)}
          placeholder="Residential roof repair, inspections, full replacements..."
          disabled={disabled}
        />
      </Field>

      <Field
        label="Calendar preference"
        htmlFor="calendar_preference"
        error={errors.calendar_preference}
        required
      >
        <select
          id="calendar_preference"
          name="calendar_preference"
          className={inputClass}
          value={values.calendar_preference}
          onChange={(e) =>
            setField(
              "calendar_preference",
              e.target.value as IntakeSubmission["calendar_preference"]
            )
          }
          disabled={disabled}
        >
          <option value="Google Calendar">Google Calendar</option>
          <option value="Calendly">Calendly</option>
          <option value="None">None</option>
        </select>
      </Field>

      <Field
        label="Calendar email"
        htmlFor="calendar_email"
        error={errors.calendar_email}
        hint="Where bookings will land."
        required
      >
        <input
          id="calendar_email"
          name="calendar_email"
          type="email"
          className={inputClass}
          value={values.calendar_email}
          onChange={(e) => setField("calendar_email", e.target.value)}
          autoComplete="email"
          disabled={disabled}
        />
      </Field>

      <Field label="Timezone" htmlFor="timezone" error={errors.timezone} required>
        <select
          id="timezone"
          name="timezone"
          className={inputClass}
          value={values.timezone}
          onChange={(e) => setField("timezone", e.target.value)}
          disabled={disabled}
        >
          {US_TIMEZONES.map((tz) => (
            <option key={tz.id} value={tz.id}>
              {tz.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Job types you don't accept"
        htmlFor="decline_types"
        hint="Optional — helps the AI say no politely."
        error={errors.decline_types}
      >
        <textarea
          id="decline_types"
          name="decline_types"
          className={inputClass}
          rows={2}
          value={values.decline_types}
          onChange={(e) => setField("decline_types", e.target.value)}
          placeholder="e.g. commercial jobs, anything under $500, gutters only"
          disabled={disabled}
        />
      </Field>

      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-brand-accent px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting"
          ? "Submitting…"
          : status === "error"
            ? "Try again"
            : "Finish setup"}
      </button>
    </form>
  );
}
