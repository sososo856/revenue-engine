# LeadCatch AI — Onboarding Architecture (post-rebuild)

Single source of truth for the rebuilt onboarding pipeline. Replaces the scattered Notion / Make scenario notes.

## State machine

```
                     checkout.session.completed
Stripe  ────────────────▶  Scenario A (leadcatch_stripe)
                           └─▶ datastore 90246: Add record(stripe_customer_id)
                               onboarding_status: paid
                               ─▶ Brevo: email customer OAuth link
                               ─▶ onboarding_status: awaiting_oauth

Google Form submit (Apps Script)
                         ─▶  Scenario B (leadcatch_oauth_complete)
                             └─▶ datastore 90246: Update(stripe_customer_id)
                                 onboarding_status: awaiting_intake
                                 ─▶ Brevo: email customer intake link
                                    https://intake.leadcatch.homes/?stripe_customer_id=...

Vercel intake form submit
                         ─▶  Scenario C (leadcatch_intake)
                             └─▶ Update record: onboarding_status: provisioning
                                 ─▶ Claude proxy: generate AI greeting
                                 ─▶ HTTP: call Twilio Provisioner (4719941) inline
                                         returns { twilio_number, twilio_number_sid }
                                 ─▶ Claude proxy: generate welcome SMS copy
                                 ─▶ Twilio REST: send welcome SMS
                                 ─▶ Update record: onboarding_status: active
                                 ─▶ Brevo: welcome email to customer
                                 ─▶ Brevo: internal notification to Dan
```

## Primary key

`stripe_customer_id` (raw, e.g. `cus_NffrFeUfNV2Hib`). Used as the datastore 90246 key across every scenario and the Twilio provisioner. **Never `CLIENT_{business_name}`**.

## Webhooks

| Scenario | Webhook name | Trigger |
|----------|--------------|---------|
| A | `leadcatch_stripe` | Stripe `checkout.session.completed` |
| B | `leadcatch_oauth_complete` | Google Form Apps Script `onFormSubmit` |
| C | `leadcatch_intake` | Vercel intake form `/api/submit` |
| Twilio Provisioner (existing) | (hook `2203921`) | Called inline by Scenario C module 8 |

URLs are stored in `docs/STATE.md` (filled in as scenarios are created).

## Datastores

- **`90246`** — client records. Primary key = `stripe_customer_id`. See `docs/make/datastore-schema.md` for full field list.
- **`88980`** — API keys. Keys used: `brevo_api_key`, `anthropic_api_key`, `stripe_webhook_secret` (future). Also `SYSTEM_CONFIG` (Twilio creds + notify email) — historically stored in `90246`, keep there if already present.

## External services

| Service | Usage | Secret location |
|---------|-------|-----------------|
| Stripe | Payment, webhook to A | Stripe dashboard |
| Brevo | Transactional email (Scenarios A/B/C + internal notifications) | datastore 88980 `brevo_api_key` |
| Anthropic (via leadcatch-proxy) | AI greeting + welcome SMS copy | datastore 88980 `anthropic_api_key` (used as `x-proxy-secret`) |
| Twilio | Phone number purchase, SMS send, (future) A2P | `SYSTEM_CONFIG` record in datastore 90246 |
| Google Forms + Apps Script | OAuth capture, webhook trigger for Scenario B | Scripts owned by Dan's Google account |
| Vercel | Intake form hosting, Claude proxy | `MAKE_INTAKE_WEBHOOK_URL` env var in intake-form project |

## Failure states

Every terminal `failed_*` state:
- Records stay in datastore 90246 with the failure stage.
- Dan receives an email via Brevo with the full error context.
- Customer sees no error — the frontend they last touched (Stripe receipt, Google Form thank-you, or intake form success screen) completes normally.

Recovery runbook: `docs/FAILURE_RECOVERY.md`.

## Scenarios archived (kept for rollback)

- `4611743` — old Stripe Delivery
- `4706612` — old Client Onboarding Automation

Rename to `[ARCHIVED] ...` in Make, `isActive: false`. Do not delete until the new system has served at least one real paying customer.

## Scenario left untouched

- `4611742` — CRM Update / Inbound Reply Handler. Battle-tested. Out of scope for this rebuild.

## Future hardening (tracked but out of scope)

- Stripe webhook signature verification in Scenario A (see `docs/STRIPE_WEBHOOK_SETUP.md`)
- Retry scenario for stuck `failed_*` records (cron → scan datastore → re-invoke the appropriate scenario)
- Calendar OAuth re-auth flow for token expiry
- Twilio A2P registration automation (currently manual)
