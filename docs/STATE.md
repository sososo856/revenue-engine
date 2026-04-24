# Build State — Onboarding Rebuild

## Current phase
Phases 1-3 complete. Archive of old scenarios done. Awaiting Dan actions to reach end-to-end testing.

## Phase log

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| 0. Plan saved to repo + Obsidian | ✅ done | 2026-04-24 | 2026-04-24 | Mirrored to Ventures/LeadCatch/ |
| 0b. Pull current blueprints | ✅ done | 2026-04-24 | 2026-04-24 | docs/blueprints/ — diagnoses confirmed |
| 1. Vercel intake form | ✅ done | 2026-04-24 | 2026-04-24 | Deployed + env var set + redeployed |
| 2. Unified Make scenarios (A/B/C) | ✅ done | 2026-04-24 | 2026-04-24 | A=4851729 B=4851735 C=4851740 |
| 3. Twilio Provisioner mods | ✅ done | 2026-04-24 | 2026-04-24 | 4719941 keyed on stripe_customer_id, WebhookRespond added |
| 3b. Archive old scenarios | ✅ done | 2026-04-24 | 2026-04-24 | 4611743 + 4706612 renamed [ARCHIVED 2026-04-24] |
| 4. Google Form Apps Script | ⏳ blocked | | | Needs existing OAuth form URL + claude-in-chrome |
| 5. Stripe webhook update | ⏳ blocked | | | Needs claude-in-chrome OR Stripe dashboard action |
| 6. End-to-end live test | ⏳ blocked | | | Needs Twilio creds + OAuth form URL + Stripe webhook |
| 7. Cutover & cleanup | ⏳ pending | | | Scenarios stay paused until Phase 6 passes |

## Blockers (Dan actions needed)
1. **DNS at Porkbun** (2 min) — for intake form domain:
   - `A intake 76.76.21.21` under `leadcatch.homes`
2. **MX + SPF records at Porkbun** (5 min) — so replies to alex@leadcatch.homes don't bounce. Use ImprovMX free:
   - Sign up at improvmx.com with domain `leadcatch.homes`, alias `alex → somtooputa4@gmail.com`
   - Add MX records Porkbun shows you (ImprovMX provides the exact values; typically `mx1.improvmx.com` priority 10 + `mx2.improvmx.com` priority 20)
   - Add the SPF TXT they give you (don't overwrite existing Brevo SPF — merge)
3. **Fill `oauth_form_url` in Make datastore 88980** — paste URL of your existing Google Form (for Calendar OAuth). Scenario A uses this. Currently `SET_OAUTH_FORM_URL_HERE`.
4. **Add Twilio credentials to Make datastore 88980** — currently `PENDING` / placeholder. Needed: `twilio_account_sid`, `twilio_auth_token`, `twilio_messaging_service_sid`. Also requires A2P 10DLC approval + EIN chain (existing blocker).
5. **Stripe webhook endpoint update** — in Stripe Dashboard, point `checkout.session.completed` webhook to `https://hook.us2.make.com/q9555298zyjwnf09evp92dwkjl3vvjv9` (Scenario A hook).
6. **Google Form Apps Script** — paste provided Apps Script into your existing OAuth form → Extensions → Apps Script; set On-form-submit trigger. Script POSTs to Webhook B (`https://hook.us2.make.com/p4twy6homsddyuu3aigocqygn3iwbfro`). Full script: docs/apps_script.js (to be generated).

## Deviations from plan
- Phases 4, 5, 6 executed via claude-in-chrome browser automation instead of manual Dan instructions (per Dan's request 2026-04-24).
- Vercel project linked under personal scope `somtooputa4-8227s-projects` instead of team `team_2eavJbkF4osItfupvdEozCA8` — team scope was unavailable for a new project. Non-blocking; Dan can transfer later via Vercel dashboard.
- GitHub→Vercel auto-deploy link failed (needs Login Connection in Vercel account). Deploys currently via `vercel deploy --prod` from CLI. Dan can enable GitHub connection at https://vercel.com/somtooputa4-8227s-projects/leadcatch-intake/settings/git if he wants push-to-deploy.

## Webhook URLs
- Webhook A (Stripe): `https://hook.us2.make.com/q9555298zyjwnf09evp92dwkjl3vvjv9` — scenario 4851729
- Webhook B (OAuth): `https://hook.us2.make.com/p4twy6homsddyuu3aigocqygn3iwbfro` — scenario 4851735
- Webhook C (Intake): `https://hook.us2.make.com/7paxsbmkpkvzi9neknpa8bdrkkquduym` — scenario 4851740
- Twilio Provisioner: `https://hook.us2.make.com/bp64u6pklcsurw6171brthzd595ngok2` — scenario 4719941 (modified)

## Deployed URLs
- Intake form (production deployment): https://leadcatch-intake-n4ymasi3q-somtooputa4-8227s-projects.vercel.app
- Intake form (custom domain, pending DNS): https://intake.leadcatch.homes
- GitHub repo (intake): https://github.com/sososo856/leadcatch-intake

## DNS action for Dan (Porkbun)
Add this record at porkbun.com → leadcatch.homes → DNS:
- Type: `A`
- Host: `intake`
- Answer: `76.76.21.21`
- TTL: default (600)

(Alternative: CNAME `intake → cname.vercel-dns.com` — Vercel supports either.)

## Notion doc
- Final architecture page: TBD — Phase 7
