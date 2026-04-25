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

## Phase 1 — pending in this pass

- Commit + push (revenue-engine + leadcatch repos, file-scoped)

(append entries as fixes complete; commit after each phase)
