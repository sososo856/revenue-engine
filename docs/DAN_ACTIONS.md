# Dan Actions — In Priority Order

All infra is built. Everything below is what I cannot do autonomously (security boundaries, external vendor UIs, or missing credentials).

---

## 🔥 Priority 1 — Unblock cold email sending (30 min total)

**The #1 reason you haven't sent emails for 20 days is a missing technical piece you didn't know about:** `leadcatch.homes` has zero MX records. Every reply to `alex@leadcatch.homes` bounces. Fix this before you send anything.

### 1a. ImprovMX signup (5 min)
1. Go to https://improvmx.com (free tier is enough — 25 aliases, unlimited traffic).
2. Sign up with `somtooputa4@gmail.com`.
3. Add domain: `leadcatch.homes`.
4. Create alias: `alex` → forwards to `somtooputa4@gmail.com`.
5. Copy the MX + SPF records ImprovMX shows you.

### 1b. Porkbun DNS (5 min)
Log into porkbun.com → Domain Management → `leadcatch.homes` → DNS Records.

**Add three records** (ImprovMX gives you the exact values — typically these):

| Type | Host | Answer | Priority | TTL |
|---|---|---|---|---|
| MX | *(blank / root)* | `mx1.improvmx.com` | 10 | 600 |
| MX | *(blank / root)* | `mx2.improvmx.com` | 20 | 600 |
| A | `intake` | `76.76.21.21` | — | 600 |

**For SPF:** you already have a Brevo SPF TXT record. Don't add a second one — merge. The merged TXT value should look like:
```
v=spf1 include:spf.brevo.com include:spf.improvmx.com ~all
```

Find your existing SPF (TXT record at root starting with `v=spf1`), edit it, add `include:spf.improvmx.com` before the `~all`. If you don't have one yet, add it as `v=spf1 include:spf.brevo.com include:spf.improvmx.com ~all`.

### 1c. Test (1 min)
After DNS propagates (~5 min), email `alex@leadcatch.homes` from your personal Gmail. It should land in `somtooputa4@gmail.com`. If it does — inbound is fixed.

### 1d. Send the drafts
Open Gmail Drafts. 27 drafts waiting. Select all, Send. If you want to batch-send, use the "Schedule send" staggered over 2 days (e.g. 5 per hour) to protect sender reputation.

**Heads-up on draft persona inconsistency:** your drafts are signed as "Somto" (apr 11-13), "Dan" (apr 7-9), and "Alex" (apr 5). Sender address is consistent (`alex@leadcatch.homes`) but signoffs vary. If a prospect replies asking who they're talking to, match the draft signoff. Not worth rewriting all 27 — just send.

---

## Priority 2 — Finish LeadCatch onboarding infrastructure (15 min of clicks)

Phase 2 + 3 scenarios are built but paused. To go live you need these credentials that I cannot generate myself:

### 2a. Stripe webhook update (Stripe Dashboard — 2 min)
1. Go to https://dashboard.stripe.com/webhooks
2. Edit your existing LeadCatch webhook (or create one if none).
3. Endpoint URL: `https://hook.us2.make.com/q9555298zyjwnf09evp92dwkjl3vvjv9`
4. Events to send: `checkout.session.completed` only.
5. Copy the "Signing secret" value (starts with `whsec_`).
6. In Make datastore 88980, add key `stripe_webhook_secret` with that value. (Not required for scenarios to work today; useful for future signature verification.)

### 2b. Stripe live keys (Stripe Dashboard — 3 min)
Your memory notes say the Stripe live deadline was Apr 20. Still blocking real revenue on both LeadCatch and Milestone.
1. https://dashboard.stripe.com → Developers → API keys
2. Copy `sk_live_...` and `pk_live_...`
3. Update these in:
   - `~/striveos/.env.local` (STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
   - Milestone Vercel project env vars (same names, both preview + production)
   - Redeploy Milestone after.

### 2c. OAuth form URL (Make datastore — 1 min)
You have an existing Google Form for Calendar OAuth. I don't know its URL.
1. Open the form in Google Forms.
2. Click Send → Link tab → copy.
3. In Make datastore `88980`, update record `oauth_form_url` — replace `SET_OAUTH_FORM_URL_HERE` with the form URL (the full prefill URL works best).

### 2d. Google Form Apps Script (Google Forms — 5 min)
1. Open your existing OAuth Google Form.
2. Make sure it has a short-answer field titled exactly `stripe_customer_id` (auto-prefills via URL param).
3. Extensions → Apps Script → delete default code → paste contents of `docs/apps_script.js` from this repo.
4. Save (disk icon).
5. Triggers (clock icon in left nav) → Add Trigger → function: `onFormSubmit`, event source: `From form`, event type: `On form submit`. Authorize when prompted.
6. Test: open form with `?stripe_customer_id=test_abc` in URL, submit any response. In Make, scenario B should run (or enqueue, since still paused).

### 2e. Twilio credentials (Make datastore — 2 min)
Required to complete client onboarding after intake. Currently all Twilio fields in SYSTEM_CONFIG are `PENDING`.
1. https://console.twilio.com → copy Account SID + Auth Token.
2. https://console.twilio.com → Messaging → Services → copy Messaging Service SID (create one if none — needs A2P 10DLC registration with EIN).
3. Update SYSTEM_CONFIG record in Make datastore 90246 — set `twilio_account_sid`, `twilio_auth_token`, `twilio_messaging_service_sid`.
4. Also update the flat keys in datastore 88980: `twilio_account_sid`, `twilio_auth_token`, `twilio_phone`. (Both locations are referenced.)

### 2f. Test with $1 Stripe checkout (10 min)
1. Create a $1 test product in Stripe test mode.
2. Activate scenarios A, B, C, and Twilio Provisioner (all currently paused).
3. Check out with your own email + phone.
4. Verify you get: OAuth email → fill form → intake email → fill form → welcome SMS arrives from new number.
5. If all green, leave scenarios active. Otherwise check Make execution logs.

---

## Priority 3 — Vercel GitHub auto-deploy link (optional, 2 min)

https://vercel.com/somtooputa4-8227s-projects/leadcatch-intake/settings/git → "Connect GitHub account" → authorize. Push-to-deploy starts working. Low priority; CLI deploys work fine today.

---

## Summary of infra I built autonomously

- **leadcatch-intake** (Next.js 14, Tailwind): deployed to Vercel, domain `intake.leadcatch.homes` added (pending DNS), env var `MAKE_INTAKE_WEBHOOK_URL` set + redeployed. Repo: `sososo856/leadcatch-intake`.
- **Make Scenario A** (Stripe Payment Handler) — ID 4851729, hook `q9555298...`
- **Make Scenario B** (OAuth Completion Handler) — ID 4851735, hook `p4twy6ho...`
- **Make Scenario C** (Intake & Provisioning Handler) — ID 4851740, hook `7paxsbmk...`
- **Twilio Provisioner** (ID 4719941) — rebuilt to key on `stripe_customer_id`, added `gateway:WebhookRespond` so Scenario C gets the number back synchronously.
- **Old scenarios archived** — 4611743 + 4706612 renamed `[ARCHIVED 2026-04-24]`.
- **Config records in datastore 88980** — `oauth_form_url` (placeholder), `intake_form_url` (set).
- **Apps Script generated** — `docs/apps_script.js`.
- **Blueprints snapshotted** — `docs/blueprints/*.json`.
