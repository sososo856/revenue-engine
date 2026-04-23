# LeadCatch AI — Onboarding Rebuild

Unified onboarding system rebuild. Replaces the broken Stripe Delivery + Client Onboarding + Twilio Provisioner flow with a single state-machine-driven pipeline keyed on `stripe_customer_id`.

## Documents

- [`ONBOARDING_REBUILD.md`](./ONBOARDING_REBUILD.md) — full execution plan
- [`STATE.md`](./STATE.md) — progress log
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — final architecture reference (replaces Notion doc)
- [`DEPLOY_INTAKE_FORM.md`](./DEPLOY_INTAKE_FORM.md) — Dan's step-by-step to ship the Vercel form
- [`DNS_SETUP.md`](./DNS_SETUP.md) — exact CNAME record for `intake.leadcatch.homes`
- [`APPS_SCRIPT.md`](./APPS_SCRIPT.md) — Apps Script code + install steps
- [`STRIPE_WEBHOOK_SETUP.md`](./STRIPE_WEBHOOK_SETUP.md) — Stripe webhook endpoint setup
- [`TEST_PLAN.md`](./TEST_PLAN.md) — Phase 6 live-test checklist
- [`FAILURE_RECOVERY.md`](./FAILURE_RECOVERY.md) — runbook for each `failed_*` state
- [`make/`](./make/) — Make scenario blueprints (A/B/C) + Twilio provisioner patch spec

## Related code

- [`../intake-form/`](../intake-form/) — Next.js 14 app for the Vercel-hosted intake form
