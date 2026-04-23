# Scenario A — Stripe Payment Handler

- **Name:** `LeadCatch — A. Stripe Payment Handler`
- **Team:** `2036038`
- **Scheduling:** On-demand (webhook-driven)
- **Sequential:** true
- **Max errors:** 3
- **Custom webhook name:** `leadcatch_stripe`

## Trigger

**Module 1 — Custom webhook**
- Name: `leadcatch_stripe`
- Data structure: parse inbound Stripe payload as JSON. If Make auto-detects after a test call, accept it; otherwise set no structure (use raw `{{1.data.object...}}` mapping).

Expected inbound shape (relevant fields only):
```
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "customer": "cus_...",
      "customer_details": { "email": "...", "name": "..." },
      "amount_total": 49900,
      "currency": "usd"
    }
  }
}
```

## Flow

**Module 2 — Data Store: Get a record** (datastore `88980`)
- Key: `brevo_api_key`
- Purpose: fetch Brevo API key

**Module 3 — Data Store: Add/Replace a record** (datastore `90246`)
- Key: `{{1.data.object.customer}}`
- Overwrite: true (idempotent — same customer retrying will refresh)
- Fields:
  - `stripe_customer_id`: `{{1.data.object.customer}}`
  - `email`: `{{1.data.object.customer_details.email}}`
  - `name`: `{{1.data.object.customer_details.name}}`
  - `amount`: `{{1.data.object.amount_total}}`
  - `onboarding_status`: `paid`
  - `created_at`: `{{now}}`
  - `last_updated`: `{{now}}`

**Module 4 — HTTP: Make a request** (Brevo: send transactional email)
- Method: `POST`
- URL: `https://api.brevo.com/v3/smtp/email`
- Headers:
  - `api-key`: `{{2.data.value}}`
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`
- Body type: Raw / JSON
- Body:
```json
{
  "sender": { "email": "alex@leadcatch.homes", "name": "Alex @ LeadCatch AI" },
  "to": [{ "email": "{{1.data.object.customer_details.email}}", "name": "{{1.data.object.customer_details.name}}" }],
  "subject": "Welcome to LeadCatch AI — connect your calendar to get started",
  "htmlContent": "<p>Hey {{1.data.object.customer_details.name}},</p><p>Welcome aboard. To finish setup, we need to connect your Google Calendar (so the AI can book jobs straight into it) and grab a few basics.</p><p><a href=\"GOOGLE_FORM_URL?stripe_customer_id={{1.data.object.customer}}\">Connect calendar &amp; answer a few questions &rarr;</a></p><p>Takes about 90 seconds. Once done, we'll send you one more quick intake form, then your system goes live within 48 hours.</p><p>— Alex</p>"
}
```
- **Replace `GOOGLE_FORM_URL`** with the pre-filled viewform URL for the existing Google Form. The form must have a short-answer question whose entry id maps to `stripe_customer_id`; use the `entry.NNNNN=` prefill URL (see `docs/APPS_SCRIPT.md` step 1 for how to obtain it).
- Parse response: yes
- Handle errors: yes

**Module 5 — Data Store: Update a record** (datastore `90246`)
- Key: `{{1.data.object.customer}}`
- Fields:
  - `onboarding_status`: `awaiting_oauth`
  - `last_updated`: `{{now}}`

**Module 6 — HTTP: Brevo (internal notification to Dan)**
- Same endpoint/headers as module 4
- Body:
```json
{
  "sender": { "email": "alex@leadcatch.homes", "name": "LeadCatch AI System" },
  "to": [{ "email": "somtooputa4@gmail.com" }],
  "subject": "[LeadCatch] New paid client — awaiting OAuth — {{1.data.object.customer}}",
  "htmlContent": "<p>New Stripe payment received.</p><ul><li>Customer: {{1.data.object.customer}}</li><li>Email: {{1.data.object.customer_details.email}}</li><li>Name: {{1.data.object.customer_details.name}}</li><li>Amount: {{1.data.object.amount_total}} {{1.data.object.currency}}</li></ul><p>Status: <strong>awaiting_oauth</strong>. Customer has been emailed the OAuth link.</p>"
}
```

## Error handling (applies to modules 3, 4, 5, 6)

On error branch:
1. **Data Store: Update a record** (datastore `90246`)
   - Key: `{{1.data.object.customer}}`
   - Fields:
     - `onboarding_status`: `failed_stripe_handler`
     - `last_error`: `{{error.message}}`
     - `last_error_stage`: `stripe_handler_module_{module_number}`
     - `last_updated`: `{{now}}`
2. **HTTP: Brevo (error alert to Dan)**
   - Subject: `[LeadCatch ERROR] Stripe handler failed — {{1.data.object.customer}}`
   - Body: include `{{error.message}}`, full inbound payload, module number.

## Testing

Send a sample `checkout.session.completed` payload via Make's "Run once" with fabricated customer id `cus_TEST1`. Verify:
- Record created in datastore 90246 with key `cus_TEST1`
- `onboarding_status` ends at `awaiting_oauth`
- OAuth email arrives at the test email
- Internal email arrives at `somtooputa4@gmail.com`
