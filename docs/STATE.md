# Build State — Onboarding Rebuild

## Current phase
Phase 1 code scaffold complete (artifacts only). Awaiting Dan for deploy + Make/Stripe/Apps Script manual steps.

## Phase log

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| 1. Vercel intake form | partial (code done, deploy pending Dan) | 2026-04-23 | — | Code under `intake-form/`. Dan must: create `sososo856/leadcatch-intake` repo, push, deploy to Vercel, set env var, add CNAME. See `docs/DEPLOY_INTAKE_FORM.md`. |
| 2. Unified Make scenarios (A/B/C) | blueprint specs done, scenarios not created | 2026-04-23 | — | Blueprints under `docs/make/`. Make.com MCP unavailable — Dan must create in Make UI using specs. |
| 3. Twilio Provisioner mods | patch spec done, not applied | 2026-04-23 | — | See `docs/make/scenario-twilio-provisioner-patch.md`. |
| 4. Google Form Apps Script | code + instructions done | 2026-04-23 | — | See `docs/APPS_SCRIPT.md`. Manual — Dan executes. |
| 5. Stripe webhook update | instructions done | 2026-04-23 | — | See `docs/STRIPE_WEBHOOK_SETUP.md`. Manual — Dan executes. |
| 6. End-to-end live test | checklist done, test not run | 2026-04-23 | — | See `docs/TEST_PLAN.md`. Gate before Phase 7. |
| 7. Cutover & cleanup | pending | — | — | Blocked on Phase 6 pass. |

## Blockers

**Tool availability deviations from the original plan:**

- **Make.com MCP:** not available to me in this environment. I cannot create, modify, or run Make scenarios. Delivered as JSON blueprints + Markdown specs under `docs/make/` for Dan to import or manually replicate.
- **Vercel MCP / CLI:** not available. Cannot deploy or configure domains. Delivered full Next.js app under `intake-form/`; Dan must push to a new repo and click deploy in Vercel dashboard.
- **Notion MCP:** not available. Architecture page delivered as `docs/ARCHITECTURE.md` instead. Dan can copy into Notion if desired.
- **GitHub MCP scope:** restricted to `sososo856/revenue-engine` only. I cannot create the `sososo856/leadcatch-intake` repo. Dan creates it and pushes `intake-form/` contents.

## Deviations from plan

- Intake form code lives in this repo under `intake-form/` rather than in a separate `leadcatch-intake` repo. Dan will copy it out to the new repo (instructions in `docs/DEPLOY_INTAKE_FORM.md`).
- Notion architecture doc replaced with Markdown `docs/ARCHITECTURE.md`.

## Webhook URLs (filled in as Dan creates scenarios)

- Webhook A (Stripe): TBD — paste here after Make scenario A is created
- Webhook B (OAuth): TBD — paste here after Make scenario B is created
- Webhook C (Intake): TBD — paste here after Make scenario C is created

## Deployed URLs

- Intake form: TBD — paste Vercel URL after deploy, then `intake.leadcatch.homes` after DNS
- GitHub repo (intake): TBD — `https://github.com/sososo856/leadcatch-intake` after Dan creates it

## Notion doc

- Replaced with `docs/ARCHITECTURE.md`.
