# Failure Recovery Runbook

When a customer's record lands in any `failed_*` state, here's what to do per stage. All actions happen in Make + datastore 90246.

## Triage steps (every case)

1. Open the error email from Brevo (or Make's built-in failure notification). Note `stripe_customer_id` and `last_error_stage`.
2. Open datastore 90246 → find record by key. Confirm `onboarding_status`, `last_error`, `last_error_stage`, `last_updated`.
3. Identify the stage below.
4. Reach out to customer only if the failure is customer-visible (rare — most are backend-only).

## `failed_stripe_handler`

**Symptom:** Paid customer exists in Stripe but onboarding email never sent, or record not advanced beyond `paid`.

**Likely causes:**
- Brevo API key invalid/rotated
- Brevo API outage
- Stripe webhook payload shape changed

**Fix:**
1. Check `last_error` — if 401/403 from Brevo, rotate/refresh `brevo_api_key` in datastore 88980.
2. In Make, re-run Scenario A for this specific payload from history.
3. Or manually email customer their OAuth link, then manually set `onboarding_status: awaiting_oauth`.

## `failed_oauth_handler`

**Symptom:** Customer completed OAuth form, but intake email never sent, or record not advanced to `awaiting_intake`.

**Likely causes:**
- Record for that `stripe_customer_id` didn't exist (Scenario A never ran, or customer edited the form URL)
- Brevo failure

**Fix:**
1. If the error is "record not found": check Scenario A's history for the Stripe checkout corresponding to this email. If A never ran, something is wrong with the Stripe webhook — replay from Stripe dashboard.
2. If Brevo failed: same as `failed_stripe_handler` fix 1-2.
3. Worst case: manually set `onboarding_status: awaiting_intake`, email customer the intake link directly.

## `failed_intake_handler`

**Symptom:** Customer submitted intake form successfully (they saw success screen), but backend processing failed before reaching Twilio.

**Likely causes:**
- Claude proxy unreachable (module 6 AI greeting)
- Datastore update failure

**Fix:**
1. Check `last_error_stage` to know which module failed.
2. Re-run Scenario C from Make history with the same inbound payload.
3. If Claude proxy is down: verify `leadcatch-proxy.vercel.app/api/claude` responds; if not, check Vercel deployment status.

## `failed_twilio_provisioning`

**Symptom:** Record at `provisioning` with `failed_twilio_provisioning`. No Twilio number purchased.

**Likely causes:**
- Twilio credentials invalid/expired in `SYSTEM_CONFIG`
- Twilio account has no funds
- Area code search found no numbers (set a broader search fallback)

**Fix:**
1. Check Twilio console — account balance, API key status.
2. Test Twilio provisioner scenario (4719941) in isolation with `{ stripe_customer_id: "cus_XYZ", business_name: "...", phone: "+1..." }`.
3. Once fixed, re-run Scenario C from the Twilio call step. Easiest: trigger Scenario C again with the same intake payload (the datastore will just overwrite fields that were already set, idempotently).

## `failed_sms_send`

**Symptom:** Twilio number purchased (record has `twilio_number`), but welcome SMS never reached customer.

**Likely causes:**
- Brand-new Twilio number not yet SMS-capable (A2P 10DLC registration pending)
- Customer phone number invalid

**Fix:**
1. Verify phone number format in record (`phone` field should be E.164).
2. Send the SMS manually from Twilio console to confirm number works.
3. Manually set `onboarding_status: active`, `activated_at: {{now}}` after sending manually.

## `failed_activation`

**Symptom:** Everything worked including SMS, but the final welcome email or status update failed.

**Likely causes:**
- Brevo failure at the end
- Datastore timeout

**Fix:**
1. Manually send welcome email from Brevo with the details from the record.
2. Set `onboarding_status: active`, `activated_at: {{now}}`.

## Record is completely corrupt

Last resort:
1. Refund the customer in Stripe.
2. Delete their record from datastore 90246.
3. Release any Twilio number they got assigned (Twilio console → Phone Numbers → release).
4. Tell customer we're manually resetting.
5. Run them through fresh as a comped test customer.
