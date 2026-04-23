import { US_STATES } from "./states";
import { US_TIMEZONES } from "./timezones";

export type CalendarPreference = "Google Calendar" | "Calendly" | "None";

export interface IntakeSubmission {
  stripe_customer_id: string;
  business_name: string;
  phone: string;
  hours: string;
  service_area: string;
  state: string;
  zip: string;
  services: string;
  calendar_preference: CalendarPreference;
  calendar_email: string;
  timezone: string;
  decline_types: string;
}

export type Errors = Partial<Record<keyof IntakeSubmission, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}$/;
const US_STATE_CODES = new Set(US_STATES.map((s) => s.code));
const TIMEZONE_IDS = new Set(US_TIMEZONES.map((tz) => tz.id));

// Accept US 10-digit, E.164 with +1, or 11-digit starting with 1.
// Normalize in validatePhone.
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (input.startsWith("+") && digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

export function isValidStripeCustomerId(id: string | null | undefined): id is string {
  if (!id) return false;
  return /^cus_[A-Za-z0-9]{6,}$/.test(id);
}

export function validate(values: IntakeSubmission): Errors {
  const errors: Errors = {};

  if (!isValidStripeCustomerId(values.stripe_customer_id)) {
    errors.stripe_customer_id = "Invalid or missing Stripe customer ID.";
  }
  if (!values.business_name.trim()) errors.business_name = "Required.";
  if (!values.phone.trim()) {
    errors.phone = "Required.";
  } else if (!normalizePhone(values.phone)) {
    errors.phone = "Enter a valid phone number (e.g., 555-123-4567 or +15551234567).";
  }
  if (!values.hours.trim()) errors.hours = "Required.";
  if (!values.service_area.trim()) errors.service_area = "Required.";
  if (!US_STATE_CODES.has(values.state)) errors.state = "Select a state.";
  if (!ZIP_RE.test(values.zip)) errors.zip = "Enter a 5-digit ZIP.";
  if (!values.services.trim()) errors.services = "Required.";

  const validPrefs: CalendarPreference[] = ["Google Calendar", "Calendly", "None"];
  if (!validPrefs.includes(values.calendar_preference)) {
    errors.calendar_preference = "Select an option.";
  }
  if (!values.calendar_email.trim()) {
    errors.calendar_email = "Required.";
  } else if (!EMAIL_RE.test(values.calendar_email)) {
    errors.calendar_email = "Enter a valid email.";
  }
  if (!TIMEZONE_IDS.has(values.timezone)) errors.timezone = "Select a timezone.";
  // decline_types is optional — no validation

  return errors;
}
