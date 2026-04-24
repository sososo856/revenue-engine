# Build State — Onboarding Rebuild

## Current phase
Phase 1 complete. Awaiting approval for Phase 2.

## Phase log

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| 0. Plan saved to repo + Obsidian | ✅ done | 2026-04-24 | 2026-04-24 | Mirrored to Ventures/LeadCatch/ |
| 0b. Pull current blueprints | ✅ done | 2026-04-24 | 2026-04-24 | docs/blueprints/ — diagnoses confirmed |
| 1. Vercel intake form | ✅ done | 2026-04-24 | 2026-04-24 | Deployed, domain added, awaits DNS + webhook URL |
| 2. Unified Make scenarios (A/B/C) | ⏳ pending | | | Awaiting approval |
| 3. Twilio Provisioner mods | ⏳ pending | | | |
| 4. Google Form Apps Script | ⏳ pending | | | Executed via claude-in-chrome |
| 5. Stripe webhook update | ⏳ pending | | | Executed via claude-in-chrome |
| 6. End-to-end live test | ⏳ pending | | | Executed via claude-in-chrome |
| 7. Cutover & cleanup | ⏳ pending | | | |

## Blockers
- Dan must add DNS record at Porkbun: `A intake.leadcatch.homes 76.76.21.21`
- `MAKE_INTAKE_WEBHOOK_URL` env var not yet set — Scenario C hook will be created in Phase 2.

## Deviations from plan
- Phases 4, 5, 6 executed via claude-in-chrome browser automation instead of manual Dan instructions (per Dan's request 2026-04-24).
- Vercel project linked under personal scope `somtooputa4-8227s-projects` instead of team `team_2eavJbkF4osItfupvdEozCA8` — team scope was unavailable for a new project. Non-blocking; Dan can transfer later via Vercel dashboard.
- GitHub→Vercel auto-deploy link failed (needs Login Connection in Vercel account). Deploys currently via `vercel deploy --prod` from CLI. Dan can enable GitHub connection at https://vercel.com/somtooputa4-8227s-projects/leadcatch-intake/settings/git if he wants push-to-deploy.

## Webhook URLs (filled in as built)
- Webhook A (Stripe): TBD — Phase 2
- Webhook B (OAuth): TBD — Phase 2
- Webhook C (Intake): TBD — Phase 2

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
