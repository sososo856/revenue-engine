# Patch Spec — Scenario 4719941 (Auto Twilio Number Provisioner)

This scenario already exists and purchases Twilio numbers. Three behavior changes required.

## Goal

Shift the provisioner from being triggered by `CLIENT_{business_name}` records to being callable inline from Scenario C via webhook, keyed on `stripe_customer_id`. Remove the race condition with Scenario C.

## Pre-patch: pull current blueprint

Before editing, export the scenario blueprint from Make (Scenario > ⋯ > Export Blueprint) and save it for rollback. If re-invoking Claude with Make MCP, the equivalent call is: fetch scenario `4719941`, save JSON locally, then apply the diffs below.

## Change 1 — Webhook payload contract

**Current:** receives `{ business_name, phone, ... }`.

**New contract:**
```json
{
  "stripe_customer_id": "cus_...",
  "business_name": "Acme Roofing",
  "phone": "+15551234567"
}
```

Keep using `{{1.business_name}}` and `{{1.phone}}` where they drive Twilio search/purchase. Add `{{1.stripe_customer_id}}` for all datastore ops.

## Change 2 — Datastore module(s)

**Current module 5:** `datastore:AddRecord` with key `CLIENT_{{1.business_name}}`.

**New module 5:** `datastore:UpdateRecord`
- Target datastore: `90246`
- Key: `{{1.stripe_customer_id}}`
- Overwrite existing: true (it's an UPDATE, the record was created in Scenario A)
- Fields to write after Twilio number purchase:
  - `twilio_number`: `{{twilio_buy_response.phone_number}}` (or whatever the Buy Number module returns)
  - `twilio_number_sid`: `{{twilio_buy_response.sid}}`
  - `twilio_number_status`: `provisioned`
  - `twilio_provisioned_at`: `{{now}}`
  - `twilio_messaging_service_sid`: `{{twilio_msg_service_response.sid}}` (if an MS is created/assigned)
  - `a2p_registered`: `true` (only if A2P registration happens in this scenario; otherwise omit)
  - `last_updated`: `{{now}}`

**Critical:** this must be `UpdateRecord`, not `AddRecord`. If it's `AddRecord` with a key that already exists, Make errors, which is exactly the race condition we're removing.

## Change 3 — Add final `gateway:WebhookRespond` module

Scenario C (module 8) calls this scenario inline and waits for a response. Today the provisioner has no respond module, so Scenario C would time out.

**New last module:** `gateway:WebhookRespond`
- Status: `200`
- Body type: `application/json`
- Body:
```json
{
  "success": true,
  "twilio_number": "{{twilio_buy_response.phone_number}}",
  "twilio_number_sid": "{{twilio_buy_response.sid}}"
}
```

## Change 4 — Update existing error branches

Current error branches (modules 6 and 7) likely email Dan. Keep them, and update subject lines to include `{{1.stripe_customer_id}}` for traceability, e.g.:
- `[LeadCatch ERROR] Twilio provisioner — search failed — {{1.stripe_customer_id}}`
- `[LeadCatch ERROR] Twilio provisioner — purchase failed — {{1.stripe_customer_id}}`

Also add to every error branch a `datastore:UpdateRecord`:
- Key: `{{1.stripe_customer_id}}`
- Fields: `onboarding_status: failed_twilio_provisioning`, `last_error`, `last_error_stage`, `last_updated: {{now}}`

And a respond module on the error path:
- Status: `500`
- Body: `{ "success": false, "error": "{{error.message}}" }`

## Testing

After patching, fire a webhook directly at the provisioner with:
```json
{ "stripe_customer_id": "cus_TEST_PROV", "business_name": "Test Roofing", "phone": "+15551234567" }
```
Make sure:
- Twilio test-credential purchase (or sandbox flow) succeeds
- Datastore record `cus_TEST_PROV` is created/updated with `twilio_number`, `twilio_number_sid`, etc.
- HTTP response to the caller contains `twilio_number`

## Rollback

Keep the exported blueprint from the pre-patch step. If anything breaks, Make > ⋯ > Import Blueprint and restore.
