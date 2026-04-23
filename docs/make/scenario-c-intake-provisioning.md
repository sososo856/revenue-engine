# Scenario C — Intake & Provisioning Handler

- **Name:** `LeadCatch — C. Intake & Provisioning Handler`
- **Team:** `2036038`
- **Scheduling:** On-demand (webhook-driven)
- **Sequential:** true
- **Max errors:** 3
- **Custom webhook name:** `leadcatch_intake`

## Trigger

**Module 1 — Custom webhook**
- Name: `leadcatch_intake`
- Expected payload (from `intake-form` Next.js app at `/api/submit`):
```json
{
  "stripe_customer_id": "cus_...",
  "business_name": "Acme Roofing",
  "phone": "+15551234567",
  "hours": "Mon-Fri 8am-6pm",
  "service_area": "Austin, TX metro",
  "state": "TX",
  "zip": "78701",
  "services": "Residential roof repair, replacement, inspections.",
  "calendar_preference": "Google Calendar",
  "calendar_email": "owner@acme.com",
  "timezone": "America/Chicago",
  "decline_types": "commercial jobs, anything under $500"
}
```

## Flow

**Module 2 — Data Store: Get a record** (datastore `88980`)
- Key: `brevo_api_key`

**Module 3 — Data Store: Get a record** (datastore `88980`)
- Key: `anthropic_api_key`

**Module 4 — Data Store: Get a record** (datastore `90246`)
- Key: `SYSTEM_CONFIG`
- Expose: `twilio_account_sid`, `twilio_auth_token`, `twilio_messaging_service_sid`

**Module 5 — Data Store: Update a record** (datastore `90246`)
- Key: `{{1.stripe_customer_id}}`
- Fields:
  - `business_name`, `phone`, `hours`, `service_area`, `state`, `zip`, `services`, `calendar_preference`, `calendar_email`, `timezone`, `decline_types` — all from `{{1.*}}`
  - `onboarding_status`: `provisioning`
  - `last_updated`: `{{now}}`

**Module 6 — HTTP: Claude proxy (generate AI greeting)**
- Method: `POST`
- URL: `https://leadcatch-proxy.vercel.app/api/claude`
- Headers:
  - `Content-Type`: `application/json`
  - `x-proxy-secret`: `{{3.data.value}}`
  - `anthropic-version`: `2023-06-01`
- Body:
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 300,
  "system": "You are configuring an AI lead capture system for a roofing contractor. Write a natural, warm, professional greeting the AI will send when a customer calls and gets no answer. Mention the business name, acknowledge the missed call, promise a fast response, ask what they can help with. Max 2 sentences. Sound like a real receptionist. Return ONLY the greeting text.",
  "messages": [
    {
      "role": "user",
      "content": "Business name: {{1.business_name}}\nServices: {{1.services}}\nService area: {{1.service_area}}"
    }
  ]
}
```
- Parse response: yes
- Handle errors: yes

**Module 7 — Data Store: Update a record** (datastore `90246`)
- Key: `{{1.stripe_customer_id}}`
- Fields:
  - `ai_greeting`: `{{6.content[0].text}}`
  - `last_updated`: `{{now}}`

**Module 8 — HTTP: Call Twilio Provisioner (scenario 4719941) inline**
- Method: `POST`
- URL: Twilio Provisioner webhook URL (hook `2203921`). Paste the full `https://hook.*.make.com/...` URL here.
- Headers:
  - `Content-Type`: `application/json`
- Body:
```json
{
  "stripe_customer_id": "{{1.stripe_customer_id}}",
  "business_name": "{{1.business_name}}",
  "phone": "{{1.phone}}"
}
```
- Parse response: yes
- Handle errors: yes
- Expected response: `{ "success": true, "twilio_number": "+1...", "twilio_number_sid": "PN..." }` (see Phase 3 patch)

**Module 9 — HTTP: Claude proxy (generate welcome SMS copy)**
- Same endpoint/headers as module 6.
- Body:
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 200,
  "system": "Write a friendly confirmation SMS from a small business owner. Tell them their new AI lead capture system is live. Mention their business name. Max 3 sentences. Sign off as 'Alex @ LeadCatch AI'. No emojis. Return ONLY the SMS body.",
  "messages": [
    {
      "role": "user",
      "content": "Business name: {{1.business_name}}\nNew business number: {{8.twilio_number}}"
    }
  ]
}
```

**Module 10 — HTTP: Twilio REST API (send welcome SMS)**
- Method: `POST`
- URL: `https://api.twilio.com/2010-04-01/Accounts/{{4.data.twilio_account_sid}}/Messages.json`
- Authentication: Basic auth
  - Username: `{{4.data.twilio_account_sid}}`
  - Password: `{{4.data.twilio_auth_token}}`
- Body type: `application/x-www-form-urlencoded`
- Fields:
  - `From`: `{{8.twilio_number}}`
  - `To`: `{{1.phone}}`
  - `Body`: `{{9.content[0].text}}`
- Parse response: yes
- Handle errors: yes

**Module 11 — Data Store: Update a record** (datastore `90246`)
- Key: `{{1.stripe_customer_id}}`
- Fields:
  - `onboarding_status`: `active`
  - `activated_at`: `{{now}}`
  - `last_updated`: `{{now}}`

**Module 12 — HTTP: Brevo (welcome email to customer)**
- Same endpoint/headers as Scenario A module 4.
- Body:
```json
{
  "sender": { "email": "alex@leadcatch.homes", "name": "Alex @ LeadCatch AI" },
  "to": [{ "email": "{{1.calendar_email}}", "name": "{{1.business_name}}" }],
  "subject": "You're live — here's your LeadCatch AI summary",
  "htmlContent": "<p>Hey {{1.business_name}} team,</p><p>Your LeadCatch AI is live. Quick recap:</p><ul><li><strong>Your new business number:</strong> {{8.twilio_number}}</li><li><strong>Hours we'll route calls:</strong> {{1.hours}}</li><li><strong>Service area:</strong> {{1.service_area}}</li><li><strong>Calendar:</strong> {{1.calendar_preference}} ({{1.calendar_email}})</li></ul><p><strong>AI greeting preview:</strong></p><blockquote>{{7.data.ai_greeting}}</blockquote><p>Forward calls from your main line to <strong>{{8.twilio_number}}</strong> and we'll catch every missed call. Reply to this email if anything looks off.</p><p>— Alex</p>"
}
```

**Module 13 — HTTP: Brevo (internal notification to Dan)**
- Subject: `[LeadCatch] Client ACTIVATED — {{1.business_name}} ({{1.stripe_customer_id}})`
- Body: include `twilio_number`, `business_name`, `phone`, `services`, and full record summary.

## Error handling (per-module)

Each HTTP/datastore module has its own error branch. On error:
1. **Data Store: Update a record** (datastore `90246`) — key = `{{1.stripe_customer_id}}`, set:
   - `onboarding_status`: one of:
     - module 5 error: `failed_intake_handler`
     - module 6 error: `failed_intake_handler`
     - module 7 error: `failed_intake_handler`
     - module 8 error: `failed_twilio_provisioning`
     - module 9 error: `failed_sms_generation`
     - module 10 error: `failed_sms_send`
     - module 11/12/13 error: `failed_activation`
   - `last_error`: `{{error.message}}`
   - `last_error_stage`: `intake_handler_module_{N}`
2. **HTTP: Brevo error alert to Dan** — subject: `[LeadCatch ERROR] Intake/provisioning failed — {{1.business_name}} ({{1.stripe_customer_id}})`. Body: `{{error.message}}`, full inbound payload, module number.

**Critical:** a paying customer must never be stranded without Dan being alerted.

## Testing

Fire a test payload with `stripe_customer_id: cus_TEST1` (record from Scenario B test) and a phone number Dan controls. Verify:
- Record transitions: `awaiting_intake` -> `provisioning` -> `active`
- Twilio number purchased
- Welcome SMS arrives at Dan's phone from the new number
- Welcome email arrives at `calendar_email`
- Internal email arrives at `somtooputa4@gmail.com`

**Cleanup after test:** release the test Twilio number and delete the test record.
