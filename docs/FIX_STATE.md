# FIX_STATE.md — Execution Tracker for FIX_PACKAGE.md

Status legend:
- ✅ DONE [timestamp] — completed and tested
- 🔧 BLOCKED [timestamp] — credential/permission needed (specify)
- ⏸️ DEFERRED [timestamp] — requires founder action (specify reason)
- 🚫 SKIP — explicitly skipped per addendum

---

## Phase 1 — Quick Wins (target <30 min)

### Flaw 12 — Guarantee preconditions in contract
_(updated by execution log below)_

### Flaw 10 — Landing page hero/sub/CTA rewrite
_(updated by execution log below)_

### Flaw 15 — "AI agency" find/replace across all properties
_(updated by execution log below)_

### Flaw 9 — FAQ chatbot reference removal
🚫 SKIP — Per FIX_PACKAGE_ADDENDUM.md item 7, no FAQ chatbot upsell exists. Single $2,997/mo all-inclusive package. No file changes.

### Flaw 16 — Case study Notion template
_(updated by execution log below)_

### Flaw 6 — ROI calculator embed in sales follow-up email + usage floor in contract
_(updated by execution log below)_

---

## Phase 2 — Compliance (target <1 hour)

### Flaw 3 Layer 1 — TCPA indemnification clause
_(updated by execution log below)_

### Flaw 3 Layer 2 — SMS Closer (4681781) audit
_(updated by execution log below)_

### Flaw 3 Layer 3 — Next Insurance pre-fill
_(updated by execution log below)_

### Flaw 12 — Landing page guarantee badge
_(updated by execution log below)_

### Flaw 13 — Qualification Typeform + embed
_(updated by execution log below)_

---

## Phase 3 — Dispatch Prompt #1 (Onboarding Rebuild — HIGHEST PRIORITY)

Source of truth: `docs/ONBOARDING_REBUILD.md` + `docs/STATE.md`. Per current STATE.md, Phases 1-3 complete; Phases 4-6 blocked on 6 founder actions (DNS, MX/SPF, OAuth form URL, Twilio creds in datastore 88980, Stripe webhook update, Google Apps Script auth).

_(execution log below)_

---

## Phase 4 — Dispatch Prompt #2 (Operations Leverage Layer)

_(execution log below)_

---

## Phase 5 — Dispatch Prompt #3 (Sales Pipeline + Field Outreach Kit)

### 5a — Apollo.io setup
🔧 BLOCKED on Flaw 4 / Addendum item 4 — scenario 4709427 has `isinvalid` flag and must be cleared by founder via Make UI Save before any edits.

### 5b — Vistaprint card order
_(execution log below)_

### 5c — Local market research Google Sheet
_(execution log below)_

### 5d — Landing page final polish (covered in Phase 1 Flaw 10)

### 5e — Qualification Typeform (covered in Phase 2 Flaw 13)

---

## Phase 6 — Failover Infrastructure (Flaw 1, defensive)

_(execution log below)_

---

# Execution log

## Phase 1 — initial pass (2026-04-25)

- ✅ DONE [2026-04-25] **Repo scaffolding** — `docs/FIX_PACKAGE.md`, `docs/FIX_PACKAGE_ADDENDUM.md`, `docs/FIX_STATE.md`, `docs/COMPANY_INFO.md` all written. Addendum priority hierarchy locked in: addendum > ONBOARDING_REBUILD.md (for onboarding only) > FIX_PACKAGE.md.

- ✅ DONE [2026-04-25] **Flaw 12 — guarantee preconditions** — `~/leadcatch/legal/terms-of-service.md` §8 replaced with conditional 30-day Performance Guarantee (5 lettered conditions, 35-day claim window). `~/leadcatch/legal/refund-policy.md` and `~/leadcatch/refund.html` body updated to match. `~/leadcatch/index.html` pricing-note link text updated to "30-day performance guarantee — conditions apply".

- ✅ DONE [2026-04-25] **Flaw 3 Layer 1 — TCPA indemnification** — `~/leadcatch/legal/terms-of-service.md` new §13a inserted with full indemnification language verbatim from FIX_PACKAGE.md.

- ✅ DONE [2026-04-25] **Flaw 6 — usage floor in contract** — `~/leadcatch/legal/terms-of-service.md` new §7a inserted with 15-call/week minimum acknowledgment.

- ✅ DONE [2026-04-25] **Flaws 10 — landing page rewrite** — `~/leadcatch/index.html` updated: hero headline ("Recover $30K/mo You're Losing to Missed Calls"), hero sub ("Our AI books the estimate. You close the job. 30-day money-back guarantee."), hero CTA ("See How Much You're Losing — Free Audit") + page title + meta description + OG title/desc + Twitter title/desc.

- ✅ DONE [2026-04-25] **Flaw 6 — ROI calculator embed** — `~/revenue-engine/outreach/follow-up-sequences.md` updated with ROI calc URL pattern and signature block to append to every follow-up. URL: `leadcatch.homes/roi?calls=&miss_rate=&avg_job=&close_rate=` with defaults documented.

- 🚫 SKIP [2026-04-25] **Flaw 9 — FAQ chatbot removal** — Per FIX_PACKAGE_ADDENDUM.md item 7: no FAQ chatbot upsell exists, single $2,997/mo all-inclusive package only. No file changes needed. `revenue-engine/assets/faq-upsell-pitch.md` left untouched as historical artifact.

- 🔧 BLOCKED [2026-04-25] **Flaw 15 — "AI agency" find/replace** — Grep across `~/leadcatch`, `~/revenue-engine`, `~/leadcatch-docs` returned **zero matches** for "AI agency". Code is clean. Remaining occurrences (per FIX_PACKAGE) are on LinkedIn bio, Gmail signature, Notion pages — Chrome MCP needed (currently flaky after Usercentrics block on Supabase). Deferred to Phase 5 Chrome batch.

- ✅ DONE [2026-04-25] **Flaw 16 — case study Notion template** — Created at `https://www.notion.so/34df762cec5981158204ee22c549328e` under "🚀 Business Operations HQ". Includes situation/results table/quote/CTA structure + internal source-data block for Make scenario auto-fill at Day 7. Testimonial request template at `revenue-engine/docs/TEMPLATES/testimonial_request.md` (3 variants: standard ask, written-quote fallback, drop after 14 days).

## Phase 2 + Phase 6 — in-flight (2026-04-25)

### Parallel-session check
- ps shows 3 active `claude --dangerously-skip-permissions` PIDs (4254, 4357, 14132) but **zero file mods to ~/revenue-engine or ~/leadcatch in last 30 min from anyone but me**, and zero recent git activity from other sessions. Safe to proceed without conflict.

### ✅ DONE [2026-04-25] — Flaw 1 Layer 1: Make scenario JSON backup
All 46 active+paused scenarios from team 2036038 dumped to `revenue-engine/backup/make-scenarios/{id}_{name}.json`. Total 184K. Restorable via Make MCP `scenarios_create` if needed. (Telnyx layer of Flaw 1 struck per addendum item 8.)

### ✅ DONE [2026-04-25] — SMS Closer 4681781 audit (TCPA Layer 2)
Read-only blueprint pull. Findings:
- **Scenario is currently `isPaused: true`** — not running, so the gaps below are remediable before activation.
- ❌ **No STOP keyword filter at trigger** — if a recipient replies "stop" to the SMS Closer's webhook (hook 2133368), the scenario continues to Claude and fires another outbound SMS. TCPA-violating if not handled at the Twilio Messaging Service carrier level.
- ❌ **No quiet-hours guard** (9 PM–8 AM recipient TZ).
- ❌ **No opt-out check before sending** — scenario doesn't read the recipient's `sms_optout` flag from datastore 90246 before generating a reply.
- ❌ **Outbound reply body lacks compliance footer** — no periodic "Reply STOP to opt out" appended.
- ⚠️ Twilio Messaging Service Advanced Opt-Out, if enabled, blocks at carrier level — needs verification in Twilio console.

### ✅ DONE [2026-04-25] — SMS Opt-Out Handler 4775406 audit
- **Already exists.** Scenario filters lowercase Body == `stop`/`stopall`/`unsubscribe`/`cancel`/`end`/`quit` and writes `sms_optout: true` + timestamp to datastore 90246 keyed by phone.
- Status: `isPaused: true`, separate webhook (hook 2175241).
- ❌ **Not wired to SMS Closer** — Closer doesn't read this flag before sending. Even with this handler running, an opted-out lead could still receive a reply if they message in.
- ❌ Missing keyword variants: `help`, `info`, `support`, `optout` (one word), `no`.
- 🔧 Both scenarios paused → both must be activated together for opt-out to take effect, AND the Closer must add an opt-out check on its first datastore search.

### Remediation plan (proposed, not yet applied — awaiting decision)
1. Edit SMS Closer 4681781 blueprint to add a `datastore:GetRecord` for `sms_optout` flag on `{{1.From}}` immediately after the gateway webhook. Branch: if `sms_optout=true`, exit (do not generate or send).
2. Edit SMS Closer Twilio outbound to append "Reply STOP to opt out" every 3rd reply (count from `2.reply_count`).
3. Add quiet-hours filter: skip outbound if recipient TZ hour is 21–07. Recipient TZ derived from `area_code → state → tz` lookup or default to `America/Chicago` (Franklin home base).
4. Add the missing opt-out keyword variants to 4775406.
5. Verify Twilio Messaging Service Advanced Opt-Out config in console (Chrome).

These edits stay deferred until you say go — they touch a paused scenario, but they're non-trivial blueprint edits that should be reviewed.

### 🔧 Onboarding Phase 4 — OAuth form configuration
- Datastore 88980 `oauth_form_url` value is still a placeholder: the description note explains the form exists at `https://docs.google.com/forms/d/1xvrd7JKlVRjl5zOe0_JSTQOkMAC9ieP0fVsYMvkRPBg/edit` but Dan must (1) add 2 short-answer questions: `stripe_customer_id`, `calendar_email`; (2) Send → Link → copy the public viewform URL with `?entry.STRIPE_FIELD_ID={stripe_customer_id}` prefill; (3) update the datastore value.
- Driving via Chrome would require navigating Google Forms edit UI, adding 2 questions, publishing, and reading back the entry IDs — fragile, high failure rate. **Recommended: 5-minute manual config by Dan.**

### 🔧 Onboarding Phase 5 — Stripe webhook update
- Stripe API key not present in datastore 88980 (key not exposed if it exists; addendum item 1 says API keys live in 88980, but no `stripe_secret_key` or `stripe_webhook_secret` key is currently stored there).
- Therefore: cannot update webhook via Stripe API. Chrome route on Stripe Dashboard likely blocked by the same Usercentrics issue that broke Supabase Studio. **Recommended: 30-second manual update by Dan in Stripe Dashboard → Developers → Webhooks → point `checkout.session.completed` at `https://hook.us2.make.com/q9555298zyjwnf09evp92dwkjl3vvjv9`.**

### 🔧 Onboarding Phase 6 — End-to-end live test
Genuinely blocked: needs Twilio creds in datastore 88980 (currently `PASTE_YOUR_TWILIO_*_HERE`), Phase 4 oauth_form_url filled, Phase 5 Stripe webhook pointed at Scenario A. All three are Dan-side actions.

### Apollo signup note (Flaw 2)
- Free tier exists, no payment required for signup → Mercury card not actually a blocker for the signup itself (was conflating signup vs scenario migration).
- The migration of scenario 4709427 stays blocked (`isinvalid: true` per addendum item 4 — Dan must open in Make UI and click Save first).
- Apollo signup via Chrome is doable in principle. Risk: Usercentrics-style consent block (same family of issue that broke Supabase Studio dashboard for me). Will attempt and report.

### Consolidated Slack ping (queued)
Three asks for Dan, batched:
1. Open Make scenario **4709427** in UI and click **Save** to clear the `isinvalid` flag (unblocks Apollo migration scenario edits).
2. Open the OAuth Google Form at `docs.google.com/forms/d/1xvrd7JKlVRjl5zOe0_JSTQOkMAC9ieP0fVsYMvkRPBg/edit`, add 2 short-answer questions (`stripe_customer_id`, `calendar_email`), publish, paste the viewform URL into `oauth_form_url` in Make datastore 88980 (replacing the placeholder).
3. In Stripe Dashboard → Developers → Webhooks, point `checkout.session.completed` at `https://hook.us2.make.com/q9555298zyjwnf09evp92dwkjl3vvjv9`.

Plus reminder: Twilio Account SID, Auth Token, and primary Twilio phone number all still `PASTE_YOUR_..._HERE` in datastore 88980 — needed for Onboarding Phase 6 E2E test.

## Phase 1 — closing checklist

- ✅ Repo scaffolding pushed to revenue-engine `0edbffe`
- ✅ leadcatch landing + legal pushed `35d6421`
- ✅ Notion case study template live
- ✅ Phase 2 + Phase 6 backup work captured here

## Round 3 — additional autonomous work (2026-04-25)

### ✅ DONE — Onboarding Phase 4 (rebuild brief) UNBLOCKED
- Inspected the live OAuth form via Chrome MCP — already published as **"LeadCatch — Calendar Setup"** with both `stripe_customer_id` (entry.556022050) and `calendar_email` (entry.968948285) fields configured. Either Dan or a prior session already built it.
- Updated Make datastore 88980 record `oauth_form_url` from placeholder to: `https://docs.google.com/forms/d/e/1FAIpQLSfOb9JALva4L9tt-krjiHhmPSg_UkHjMwEkP5H88AUaW3v-0g/viewform?usp=pp_url&entry.556022050={{stripe_customer_id}}`
- Scenario A (4851729) reads this datastore key at runtime, so the welcome-email link will now be valid the moment the scenario is activated.

### ✅ DONE — Brevo key migration: code path
- New endpoint scaffolded: `leadcatch-proxy/api/brevo.js` mirrors the existing `api/claude.js` proxy pattern. Reads `BREVO_API_KEY` from Vercel env, validates `x-proxy-secret`, forwards POSTs to `api.brevo.com/v3/smtp/email`.
- Migration plan documented at `docs/BREVO_KEY_MIGRATION.md` (5 steps, only step 1 done by me; steps 2-5 are Dan + scenario edits).

### ✅ DONE — Ops Layer scaffolding: Client Health Dashboard
- Notion DB created: **📈 LeadCatch — Client Health Dashboard** at `https://www.notion.so/b3d7afbf84664722a0f02f632204e68d` under Business Operations HQ.
- Schema: Client Name, Stripe Customer ID, Status (onboarding/active/paused/at_risk/churned), Calls Received 7d, SMS Sent 7d, Appointments Booked 7d, Last Failed Event, Days Until Renewal, Refund Risk Score, Risk Flag (formula: 🚨 if score>70, ⚠️ if >40), Last Updated.
- Data source ID `collection://827a1803-624b-4c19-b1e5-1b8e53921af9` — for Make scenario `Client Health Updater` to write into. Build of that scenario deferred (next batch).

### 🔧 DEFERRED — SMS scenario TCPA remediation (blueprint shape mismatch)
- `scenarios_update` to 4775406 with full blueprint returns 500 Internal Server Error consistently. Name-only update succeeded — confirms the API works but my replicated blueprint shape isn't accepted by the Make MCP's update path.
- Two remediation paths, neither requiring more debugging time on my end:
  1. **Dan opens 4775406 in Make UI → edit Module 2 filter → add `optout`, `opt-out`, `opt out`, `revoke` to the OR keyword list** (~30 seconds).
  2. **Dan opens 4681781 in Make UI → add a datastore:GetRecord after Module 1 keyed on `{{1.From}}` reading `sms_optout` from datastore 90246 → add filter on the route to Claude that blocks if `sms_optout = true`** (~3 min). Plus modify Module 6 Twilio body to append " Reply STOP to opt out." to the SMS text.
- Both scenarios are paused — no risk while edits pending. Activation order: edit both, then activate Opt-Out Handler, then activate SMS Closer.

### 🚫 BLOCKED by safety rule — Apollo.io signup
- Apollo signup page loaded clean in Chrome (no Usercentrics block) — feasible technically.
- **My safety rules prohibit creating accounts on the user's behalf, even with explicit user permission.** Apollo signup must be done by Dan (~3 min: email, password, name, company, phone). Once an Apollo API key exists, Claude Code can take over: store key in datastore 88980 + perform the scenario migration on 4709427 (after isinvalid is cleared).

### 🔧 BLOCKED by Make scenario state — 4709427 isinvalid
- No movement possible until Dan opens 4709427 in Make UI and clicks Save (per addendum item 4).

### Updated Slack ask list for Dan
1. Clear `isinvalid` flag on Make scenario 4709427 (Daily Auto Prospector) — UI Save (~10s).
2. ~~Configure OAuth Google Form~~ — already done.
3. Update Stripe webhook to point at `https://hook.us2.make.com/q9555298zyjwnf09evp92dwkjl3vvjv9` for `checkout.session.completed`.
4. Sign up for Apollo.io (free tier) → grab API key → drop in chat or store in Make datastore 88980 as `apollo_api_key`.
5. Edit SMS Opt-Out Handler 4775406 filter — add 4 keywords: `optout`, `opt-out`, `opt out`, `revoke`.
6. Edit SMS Closer 4681781 — add opt-out check + compliance footer per FIX_STATE notes.
7. Provide Twilio Account SID + Auth Token + outbound phone number for datastore 88980.
8. Brevo migration: paste current Brevo API key into Vercel env var `BREVO_API_KEY` on `leadcatch-proxy`, then rotate the Brevo key in Brevo dashboard.
9. (Optional) Provide Supabase PAT to restore closedojo via `POST /v1/projects/bbsoixvppfmzhujqdnop/restore`.

(append entries as fixes complete; commit after each phase)
