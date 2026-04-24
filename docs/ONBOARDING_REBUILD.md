# LeadCatch AI — Onboarding Rebuild: Complete Execution Package

## Context for Claude Code

You have Make.com MCP access, GitHub access, Vercel access, and Notion MCP access. You are executing a full rebuild of the LeadCatch AI client onboarding system. The current state is broken across multiple paused Make scenarios with no handoffs, a Telnyx/Twilio mismatch, no error handling, a phantom intake form, and a fragile primary key strategy. Full teardown and rebuild required.

**Work inside the existing `sososo856/revenue-engine` repo.** All planning docs live under `docs/`. The Vercel intake form gets its own new repo (`leadcatch-intake`) per Phase 1.

**Progress tracking:** After completing each Phase, update `docs/STATE.md` with status (done/blocked/in-progress), timestamp, and any deviations from the plan. If blocked, write the blocker explicitly and stop. Report back to Dan after each phase completes. Do not silently run end-to-end.

---

## Existing Assets

- Make.com team ID: `2036038`
- Datastore `90246` — client records (keep this)
- Datastore `88980` — API keys (keep this)
- Brevo sender: `alex@leadcatch.homes` (API key at datastore key `brevo_api_key`)
- Claude proxy: `https://leadcatch-proxy.vercel.app/api/claude` with `x-proxy-secret` header from datastore key `anthropic_api_key`
- Twilio credentials in datastore key `SYSTEM_CONFIG` (fields: `twilio_account_sid`, `twilio_auth_token`, `twilio_messaging_service_sid`, `twilio_sms_webhook`, `twilio_voice_webhook`, `notify_email`)
- **Existing Google Form for Google Calendar OAuth + basic questions — DO NOT MODIFY structure. Chain to it via Apps Script, don't merge with intake form.**
- Dan's notification email: `somtooputa4@gmail.com`
- Domain: `leadcatch.homes` (Dan owns it; intake form will live at `intake.leadcatch.homes`)

**Scenarios to archive (do NOT delete until new system is live-tested):**
- `4611743` — Stripe Delivery — LeadCatch AI Onboarding
- `4706612` — 🚀 LeadCatch AI — Client Onboarding Automation

**Scenario to preserve and modify:**
- `4719941` — 📱 LeadCatch AI — Auto Twilio Number Provisioner (see Phase 3)

**Scenario to NEVER touch:**
- `4611742` — CRM Update — Inbound Reply Handler (battle-tested, leave alone)

---

## Why This Rebuild (Problem Diagnosis)

The current onboarding system has seven concrete bugs that collectively make it non-viable even if Stripe and Twilio were active:

1. **Stripe → Onboarding handoff is missing.** Stripe Delivery (4611743) ends without calling the Client Onboarding webhook (hook 2144534). Zero handoff between payment and provisioning.
2. **Intake form is a placeholder.** The email sent after Stripe payment links to `https://forms.gle/YOUR_FORM_ID_HERE` — literally the unfilled placeholder string.
3. **Telnyx/Twilio mismatch.** Client Onboarding module 10 posts to `{{9.telnyx_provisioner_webhook}}` but the actual provisioner is Twilio (scenario 4719941, hook 2203921). Field never gets populated.
4. **Welcome SMS is never sent.** Onboarding module 6 generates SMS copy via Claude but no Twilio send-SMS module exists downstream. The copy ends up only in an internal notification email to Dan.
5. **Race condition on CLIENT record.** Both Client Onboarding (module 3) and Twilio Provisioner (module 5) use `datastore:AddRecord` with the same key pattern `CLIENT_{business_name}`. Second call errors or overwrites.
6. **Primary key collision risk.** `CLIENT_{business_name}` is fragile — whitespace, casing, or duplicate business names collide. Every downstream scenario keys on this.
7. **No state machine.** Stripe Delivery sets `followup_status: awaiting_onboarding` on `STRIPE_*` records. Onboarding sets `active_client` on `CLIENT_*` records. Two parallel record namespaces that never reconcile.

**The fix is architectural, not patches.** Rebuild as one unified state-machine-driven pipeline with `stripe_customer_id` as the universal primary key.

---

## Target Architecture

**State machine:**
```
paid → awaiting_oauth → awaiting_intake → provisioning → active
                                                      ↘ failed_{stage}
```

**Primary key everywhere:** `stripe_customer_id`. No exceptions. Never `business_name`.

**Flow:**
```
1. Stripe checkout.session.completed
     → Webhook A → create record { status: paid, stripe_customer_id, email, name, amount }
     → email customer: link to existing Google OAuth form with ?stripe_customer_id={id}
     → status: awaiting_oauth

2. Google OAuth form submission (via Apps Script → webhook)
     → Webhook B → update record { oauth_completed: true, calendar_email, oauth fields }
     → email customer: link to NEW intake form with ?stripe_customer_id={id}
     → status: awaiting_intake

3. Intake form submission (Vercel form → webhook)
     → Webhook C → update record with all business fields
     → status: provisioning
     → call Twilio Provisioner inline with stripe_customer_id
     → Twilio Provisioner updates same record with twilio_number
     → send welcome SMS from the new Twilio number
     → status: active
     → send internal notification email
```

---

## Phase 1: Build the Vercel-Hosted Intake Form

**Why Vercel, not Tally/Google Forms:** Dan already runs `leadcatch-proxy.vercel.app`. Stack is GitHub + Vercel. No subscription needed, full control, matches existing infra.

1. Create new GitHub repo `sososo856/leadcatch-intake`, Next.js 14, App Router, TypeScript, Tailwind.
2. Single page at `/` with form fields (all required unless noted):
   - `business_name` (text)
   - `phone` (tel, format validation)
   - `hours` (text, e.g. "Mon-Fri 8am-6pm")
   - `service_area` (text)
   - `state` (select, all US states)
   - `zip` (text, 5-digit validation)
   - `services` (textarea)
   - `calendar_preference` (select: "Google Calendar" / "Calendly" / "None")
   - `calendar_email` (email)
   - `timezone` (select, IANA zones — default America/New_York)
   - `decline_types` (textarea, optional — "job types you don't accept")
   - `stripe_customer_id` (hidden, prefilled from `?stripe_customer_id=` URL param)
3. On submit: POST JSON to a Next.js API route (`/api/submit`) which server-side proxies to the Make Webhook C URL. This keeps the webhook URL out of client code.
4. Environment variable: `MAKE_INTAKE_WEBHOOK_URL` (set in Vercel dashboard, not committed).
5. Styling: minimal, mobile-first, Tailwind. Match LeadCatch branding from the landing page.
6. **Client-side validation before submit:** block empty required fields, validate phone (E.164 or US format), zip (5 digits), email format, `stripe_customer_id` presence. If `stripe_customer_id` missing, show: "Invalid link — contact alex@leadcatch.homes".
7. **Post-submit success state:** "Thanks! Your system will be live within 48 hours. You'll get a text from your new business number shortly."
8. **Post-submit failure handling:** retain form data in state, show retry button, log error to Vercel logs.
9. Deploy to Vercel. Add custom domain `intake.leadcatch.homes` — Dan will need to add the CNAME record at his DNS provider; Claude Code: output the exact DNS record to add.
10. Return the deployed URL and webhook URL spec to Dan.

**Deliverable:** deployed form at `intake.leadcatch.homes`, GitHub repo with README, environment variable configured.

---

## Phase 2: Build the Unified Onboarding Make Scenario(s)

**Approach:** Three separate webhook-triggered scenarios (cleaner than one mega-scenario with a router, given distinct payload shapes). All three write to the same datastore record keyed on `stripe_customer_id`.

**Global scenario settings for all three:**
- `handleErrors: true` on every HTTP module
- `maxErrors: 3`
- Enable DLQ in scenario metadata
- `sequential: true` to prevent race conditions on the same record

### Scenario A: Stripe Handler

- **Name:** `🚀 LeadCatch — A. Stripe Payment Handler`
- **Team:** `2036038`
- **Trigger:** Custom webhook, name `leadcatch_stripe`
- **Flow:**
  1. Receive Stripe `checkout.session.completed` payload
  2. Get `brevo_api_key` from datastore 88980
  3. `datastore:AddRecord` to datastore 90246:
     - key: `{{1.data.object.customer}}` (raw Stripe customer ID, no prefix)
     - fields: `stripe_customer_id`, `email`, `name`, `amount`, `onboarding_status: paid`, `created_at: {{now}}`, `last_updated: {{now}}`
  4. Send Brevo email to customer:
     - Subject: "Welcome to LeadCatch AI — connect your calendar to get started"
     - Body: links to existing Google OAuth form URL + `?stripe_customer_id={{1.data.object.customer}}`
  5. `datastore:UpdateRecord` — `onboarding_status: awaiting_oauth`, `last_updated: {{now}}`
  6. Send internal notification to `somtooputa4@gmail.com`
- **Error branch:** on any HTTP failure, update record `onboarding_status: failed_stripe_handler`, email Dan with full error payload.

### Scenario B: OAuth Completion Handler

- **Name:** `🚀 LeadCatch — B. OAuth Completion Handler`
- **Trigger:** Custom webhook, name `leadcatch_oauth_complete`
- **Expected payload:** `{ stripe_customer_id, calendar_email, oauth_token, oauth_refresh_token, ...other Google Form fields }`
- **Flow:**
  1. Receive OAuth webhook from Google Apps Script (see Phase 4)
  2. Get `brevo_api_key` from datastore 88980
  3. `datastore:UpdateRecord` on datastore 90246, key = `{{1.stripe_customer_id}}`:
     - `oauth_completed: true`, `calendar_email`, `oauth_token`, `oauth_refresh_token`, `onboarding_status: awaiting_intake`, `last_updated: {{now}}`
  4. Send Brevo email to customer:
     - Subject: "One last step — tell us about your business"
     - Body: links to `https://intake.leadcatch.homes/?stripe_customer_id={{1.stripe_customer_id}}`
  5. Send internal notification to Dan
- **Error branch:** same pattern as Scenario A.

### Scenario C: Intake Handler + Provisioning

- **Name:** `🚀 LeadCatch — C. Intake & Provisioning Handler`
- **Trigger:** Custom webhook, name `leadcatch_intake`
- **Expected payload:** all fields from Vercel form + `stripe_customer_id`
- **Flow:**
  1. Receive intake form submission
  2. Get `brevo_api_key` from datastore 88980
  3. Get `anthropic_api_key` from datastore 88980
  4. Get `SYSTEM_CONFIG` from datastore 90246
  5. `datastore:UpdateRecord` on datastore 90246, key = `{{1.stripe_customer_id}}`:
     - All business fields, `onboarding_status: provisioning`, `last_updated: {{now}}`
  6. Call Claude proxy to generate AI greeting:
     - URL: `https://leadcatch-proxy.vercel.app/api/claude`
     - Headers: `Content-Type: application/json`, `x-proxy-secret: {{anthropic_api_key.value}}`, `anthropic-version: 2023-06-01`
     - Body: `{"model":"claude-haiku-4-5-20251001","max_tokens":300,"system":"You are configuring an AI lead capture system for a roofing contractor. Write a natural, warm, professional greeting the AI will send when a customer calls and gets no answer. Mention the business name, acknowledge the missed call, promise a fast response, ask what they can help with. Max 2 sentences. Sound like a real receptionist. Return ONLY the greeting text.","messages":[{"role":"user","content":"Business name: {{1.business_name}}\nServices: {{1.services}}\nService area: {{1.service_area}}"}]}`
  7. `datastore:UpdateRecord` — add `ai_greeting` field
  8. **Call Twilio Provisioner inline** via HTTP POST to its webhook URL (hook `2203921`):
     - Payload: `{ stripe_customer_id, business_name, phone }`
     - `parseResponse: true`, `handleErrors: true`
     - Wait for response containing `twilio_number` and `twilio_number_sid`
  9. Generate welcome SMS copy via Claude proxy (same endpoint, prompt: confirm system live, mention business name, 3 sentences max, sign "Alex @ LeadCatch AI")
  10. Send welcome SMS via Twilio REST API:
      - URL: `https://api.twilio.com/2010-04-01/Accounts/{{SYSTEM_CONFIG.twilio_account_sid}}/Messages.json`
      - Basic auth: account_sid / auth_token
      - Body: `From={provisioned_number}&To={customer_phone}&Body={sms_copy}`
  11. `datastore:UpdateRecord` — `onboarding_status: active`, `activated_at: {{now}}`
  12. Send Brevo welcome email with all system details (business info, AI greeting preview, Twilio number)
  13. Send internal "client activated" notification to Dan
- **Error branch at every stage:** if any step fails, update `onboarding_status: failed_{stage_name}` (e.g. `failed_twilio_provisioning`, `failed_sms_send`), email Dan with full error context, stop the scenario. **A paying customer should never be stranded mid-provisioning without an alert reaching Dan.**

---

## Phase 3: Modify Twilio Provisioner (Scenario 4719941)

Pull the current blueprint via Make MCP first. Then apply:

1. **Update webhook payload contract** to `{ stripe_customer_id, business_name, phone }`. Keep `{{1.business_name}}` references working but use `stripe_customer_id` for all datastore ops.
2. **Change Module 5 from `datastore:AddRecord` to `datastore:UpdateRecord`.** Key = `{{1.stripe_customer_id}}`. This prevents the race condition with Scenario C.
3. **Record fields written:** `twilio_number`, `twilio_number_sid`, `twilio_number_status: provisioned`, `twilio_provisioned_at`, `twilio_messaging_service_sid`, `a2p_registered: true`.
4. **Add `gateway:WebhookRespond` module at the end** returning: `{ success: true, twilio_number, twilio_number_sid }`. Scenario C consumes this response.
5. **Verify existing error branches (modules 6 and 7)** still fire. Update subject lines to include `stripe_customer_id` for traceability.

---

## Phase 4: Google Form Apps Script (executed via claude-in-chrome)

Claude Code: generate the complete Apps Script code block, then use claude-in-chrome to paste it into the existing Google Form's Apps Script editor, set the trigger, and authorize. Do not attempt to modify the live form structure — only add the script.

**Browser-automated checklist:**

1. Open the existing Google Form via claude-in-chrome.
2. Verify form has a short-answer field named exactly `stripe_customer_id` (auto-filled via URL prefill param).
3. Extensions → Apps Script.
4. Paste the generated script (must: parse all form item responses into an object, extract `stripe_customer_id`, `calendar_email`, OAuth token fields, and POST JSON to Webhook B URL with `UrlFetchApp.fetch`, `muteHttpExceptions: true`, catch errors and log).
5. Set up installable trigger: Triggers → Add Trigger → function `onFormSubmit`, event type `On form submit`.
6. Save; Dan authorizes the script when prompted (OAuth authorization cannot be scripted — pause here, ask Dan to click through the authorization prompt, then resume).
7. Submit a test response with `?stripe_customer_id=test123` prefilled.
8. Verify Webhook B fires in Make and record updates correctly.

---

## Phase 5: Stripe Dashboard Config (executed via claude-in-chrome)

1. Navigate to Stripe Dashboard → Developers → Webhooks via claude-in-chrome.
2. Create new endpoint (or update existing) pointing at Scenario A's webhook URL.
3. Event to send: `checkout.session.completed` only.
4. Copy the webhook signing secret, store it in Make datastore 88980 as key `stripe_webhook_secret` (not required for MVP signature verification, but store for future use).

---

## Phase 6: End-to-End Live Test (executed via claude-in-chrome)

**Do not skip. No scenario goes live until this passes.**

1. Put all three new Make scenarios in test mode (or use Make's "Run once" feature).
2. Create a $1 Stripe test-mode product.
3. Check out with a real email + real phone number Dan controls.
4. **Verify:** Scenario A fires → record created with `onboarding_status: paid → awaiting_oauth` → OAuth email arrives.
5. Click OAuth link → complete Google Form.
6. **Verify:** Scenario B fires → record updated to `awaiting_intake` → intake email arrives.
7. Click intake link → fill Vercel form → submit.
8. **Verify:** Scenario C fires → record updated to `provisioning` → Twilio Provisioner called → number purchased → welcome SMS arrives from the new number → record ends at `active`.
9. **Verify:** All internal notification emails arrived at `somtooputa4@gmail.com`.
10. **Forced failure test:** temporarily break the Brevo API key in the datastore, re-run Scenario A, confirm error handler fires, record shows `failed_stripe_handler`, Dan gets the error email. Restore the key after.

---

## Phase 7: Cutover and Cleanup

Only after Phase 6 passes:

1. Activate all three new scenarios (`isActive: true`).
2. Archive (don't delete) scenarios `4611743` and `4706612` — rename with `[ARCHIVED]` prefix in Make.
3. Activate Twilio Provisioner (4719941).
4. Update Stripe webhook endpoint to point at new Scenario A.
5. Decommission the old `leadcatch-calendar-auth.vercel.app` OAuth link references in any marketing materials or landing pages — confirm the existing Google Form URL is what's referenced going forward.

---

## Guardrails

- **If you hit any unknown state, stop and ask Dan.** Do not guess field names or webhook payload shapes — pull actual blueprints via Make MCP and verify.
- **Every datastore operation must be keyed on `stripe_customer_id`.** No exceptions. If you find yourself keying on `business_name`, stop.
- **Every HTTP module in Make must have `handleErrors: true`.** No exceptions.
- **Never hardcode secrets.** All credentials from datastore 88980 or Vercel env vars.
- **Test each phase in isolation before connecting them.** Build A, test A, build B, test A→B, etc.
- **Report back to Dan after each phase.** Update `docs/STATE.md`. No silent end-to-end runs.

---

## Deliverables

1. Deployed Vercel form at `intake.leadcatch.homes`
2. GitHub repo `sososo856/leadcatch-intake` with README
3. Three new Make scenarios, tested end-to-end
4. Modified Twilio Provisioner (4719941)
5. Google Apps Script code block pasted via claude-in-chrome into Dan's existing form
6. Stripe webhook configured via claude-in-chrome
7. A short Notion page (via Notion MCP) documenting final architecture: state machine diagram, webhook URLs, failure-recovery playbook
8. Confirmation that archived scenarios are renamed, not deleted
9. `docs/STATE.md` fully updated with all phase completions
