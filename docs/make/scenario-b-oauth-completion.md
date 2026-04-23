# Scenario B — OAuth Completion Handler

- **Name:** `LeadCatch — B. OAuth Completion Handler`
- **Team:** `2036038`
- **Scheduling:** On-demand (webhook-driven)
- **Sequential:** true
- **Max errors:** 3
- **Custom webhook name:** `leadcatch_oauth_complete`

## Trigger

**Module 1 — Custom webhook**
- Name: `leadcatch_oauth_complete`
- Expected payload (from Google Apps Script — see `docs/APPS_SCRIPT.md`):
```json
{
  "stripe_customer_id": "cus_...",
  "calendar_email": "owner@acme.com",
  "oauth_token": "ya29....",
  "oauth_refresh_token": "1//....",
  "form_responses": {
    "question_1": "answer",
    "question_2": "answer"
  },
  "submitted_at": "2026-04-23T12:34:56Z"
}
```

## Flow

**Module 2 — Data Store: Get a record** (datastore `88980`)
- Key: `brevo_api_key`

**Module 3 — Data Store: Update a record** (datastore `90246`)
- Key: `{{1.stripe_customer_id}}`
- Fields:
  - `oauth_completed`: `true`
  - `calendar_email`: `{{1.calendar_email}}`
  - `oauth_token`: `{{1.oauth_token}}`
  - `oauth_refresh_token`: `{{1.oauth_refresh_token}}`
  - `onboarding_status`: `awaiting_intake`
  - `last_updated`: `{{now}}`

Note: If the record does not exist (i.e. OAuth form submitted without a valid `stripe_customer_id`), Make will error. The error branch (below) will email Dan. This is the correct behavior — a freshly-submitted OAuth form with an unknown customer id is a bug.

**Module 4 — Data Store: Get a record** (datastore `90246`)
- Key: `{{1.stripe_customer_id}}`
- Used to pull `email` and `name` for the next email.

**Module 5 — HTTP: Brevo (intake email to customer)**
- Method: `POST`
- URL: `https://api.brevo.com/v3/smtp/email`
- Headers: same as Scenario A module 4.
- Body:
```json
{
  "sender": { "email": "alex@leadcatch.homes", "name": "Alex @ LeadCatch AI" },
  "to": [{ "email": "{{4.data.email}}", "name": "{{4.data.name}}" }],
  "subject": "One last step — tell us about your business",
  "htmlContent": "<p>Great, calendar connected.</p><p>Last step — a quick intake so we can configure your AI the way you run your shop:</p><p><a href=\"https://intake.leadcatch.homes/?stripe_customer_id={{1.stripe_customer_id}}\">Open intake form &rarr;</a></p><p>Takes about 2 minutes. After that, we'll provision your business number and text you from it to confirm everything is live.</p><p>— Alex</p>"
}
```

**Module 6 — HTTP: Brevo (internal notification to Dan)**
- Subject: `[LeadCatch] OAuth completed — {{1.stripe_customer_id}}`
- Body: summarize `calendar_email`, current status `awaiting_intake`.

## Error handling (applies to modules 3, 4, 5, 6)

On error branch:
1. **Data Store: Update a record** (datastore `90246`)
   - Key: `{{1.stripe_customer_id}}`
   - Fields: `onboarding_status: failed_oauth_handler`, `last_error`, `last_error_stage`, `last_updated`.
2. **HTTP: Brevo (error alert to Dan)**
   - Subject: `[LeadCatch ERROR] OAuth handler failed — {{1.stripe_customer_id}}`
   - Body: `{{error.message}}`, full inbound payload.

## Testing

Fire a test payload with `stripe_customer_id: cus_TEST1` (record from Scenario A test). Verify:
- Record updated to `awaiting_intake`
- Intake email arrives
- Internal email arrives
