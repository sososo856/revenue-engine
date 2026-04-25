# LeadCatch AI — Complete Fix Package (v2 — Full Autonomy Edition)

**Execution context:** Claude Code has autonomous access to Claude for Chrome. Browser-required tasks (Apollo signup, Vistaprint orders, insurance quotes, web form submissions) can now be executed end-to-end without founder intervention.

Every flaw identified, addressed. Three categories:

- ✅ **FIXED HERE** — done in this document, ready to use
- 🔧 **CLAUDE CODE EXECUTES** — tooled access available
- 👤 **FOUNDER ONLY** — physical world actions

> **Read `FIX_PACKAGE_ADDENDUM.md` first.** Pre-execution corrections override anything in this file.

---

## CATEGORY 1: STRUCTURAL & LEGAL FLAWS

### Flaw 1: Single point of failure across fragile stack (Make, Twilio, Anthropic, Stripe)

**Status:** 🔧 CLAUDE CODE EXECUTES — Build failover infrastructure

| Vendor | If it goes down | Backup to pre-stage |
|---|---|---|
| Make.com | SMS pipeline stops | Snapshot scenarios as n8n JSON in `revenue-engine/backup/n8n/` |
| Twilio | Numbers stop ringing | ~~Telnyx~~ struck per addendum item 8. Twilio failover handled inside Twilio (second messaging service / spare numbers in same account) |
| Anthropic API | AI Closer stops | OpenAI GPT-4o-mini failover prompt + key in datastore 88980 |
| Stripe | Payments freeze | Square account opened under LLC, dormant |
| Google Maps API | Prospecting stops | Apollo.io as primary (handled in Flaw 2) |

Actions: Export every active Make scenario as JSON to `revenue-engine/backup/make-scenarios/`. Open Telnyx account via Chrome. Configure OpenAI failover key in datastore 88980 as `openai_failover_key`. Update SMS Closer scenario with router: Anthropic 500 → OpenAI. Open dormant Square account under LLC info.

### Flaw 2: Google Maps scraping is on borrowed time

**Status:** 🔧 CLAUDE CODE EXECUTES — Migrate to Apollo.io

Open Apollo via Chrome → build saved search (roofing contractors, US, $1M-$5M revenue, 5-50 employees, has phone+email, 4.0+ Google rating) → API key into datastore 88980 as `apollo_api_key` → modify scenario 4709427 (replace Google Maps module with HTTP→Apollo) → 5-record test pull → log to `docs/APOLLO_MIGRATION.md` → pause old Google Maps module 30-day fallback.

### Flaw 3: TCPA exposure

**Layer 1 (file):** Add indemnification clause to client service agreement:

```
13. TCPA & SMS Compliance Indemnification

Client represents and warrants that all phone numbers provided to the
System for outbound or response messaging have been obtained with the
recipient's prior express consent for commercial SMS, in accordance
with the Telephone Consumer Protection Act (TCPA), 47 U.S.C. § 227,
and applicable state laws. Client agrees to indemnify, defend, and
hold harmless Company from any and all claims, damages, settlements,
and legal fees arising from messages sent to recipients who did not
provide such consent. Company's role is limited to providing the
software automation; consent collection and verification is the
sole responsibility of Client.
```

**Layer 2 (Make scenarios):** Audit SMS Closer (per addendum: scenario **4681781**). Check: first-touch SMS includes "Reply STOP to opt out"; STOP keyword routes to "Do Not Contact" datastore (create if missing); quiet hours filter 9 PM–8 AM recipient TZ. Test report: 3 messages, STOP one, verify block.

**Layer 3 (insurance):** 👤 Founder finalizes signature on Next Insurance application. Claude Code pre-fills via Chrome, leaves at signature, Slacks screenshot.

### Flaw 4: Roofing contractors are a brutal segment

**Refined ICP:**

| Criterion | Required |
|---|---|
| Annual revenue | $1M–$5M |
| Years in business | 3+ |
| Trucks/crews | 1–3 |
| Lead sources | Google LSA, Facebook Ads, or referral |
| Inbound call volume | 15+/week |
| Owner-operator | Yes |
| Currently losing calls | Self-reported 30%+ miss rate |
| Online reviews | 4.0+ Google, 20+ reviews |

**Disqualifying signals:** "I just need leads" (wrong product); hesitates on $2,997 for >24h (can't afford); W-2 office staff already answering (no problem); <$500K revenue (wrong stage); asks for trial beyond 30-day guarantee (won't convert).

**30-day onboarding gauntlet:** Day 1 setup call → Day 3 missed-call test → Day 7 first-booked celebration SMS → Day 14 ROI report → Day 21 check-in call → Day 28 renewal conversation. Build as Make scenario "Onboarding Gauntlet".

### Flaw 5: Competitive moat erosion

**90-day moat plan:**
1. 3 documented video case studies by Day 90
2. Geo-lock Nashville, Memphis, Knoxville
3. Feed every conversation into prompt optimization → "trained on 50,000+ roofing conversations"

### Flaw 6: Pricing fragility

**Change 1:** ROI calculator becomes a sales tool — embed in sales follow-up email pre-filled with prospect's stated numbers.

**Change 2:** Usage floor in contract:

```
The System's effectiveness is dependent on inbound call volume to
Client's connected number. Client acknowledges that a minimum of
15 inbound calls per week is required for the System to demonstrate
measurable ROI within the 30-day evaluation period. Client agrees
to direct all marketing and lead-generation efforts to the connected
number for the duration of this Agreement.
```

### Flaw 7: No upside on contractor wins

**Status:** ✅ Deferred until 3+ paying clients. **LeadCatch Performance** ($1,997/mo base + $97/booked appointment, auto-tracked via Calendar). Save spec to `docs/PRICING_ROADMAP.md`. Do not launch yet.

### Flaw 8: You're the entire business

See Dispatch Prompt #2 below.

### Flaw 9: FAQ chatbot upsell distraction

**Status:** ⏸️ SKIP — Per addendum item 7, no FAQ chatbot upsell exists. Single $2,997/mo all-inclusive package only. Take no action on Flaw 9.

### Flaw 10: Vitamin not painkiller

| Element | Old | New |
|---|---|---|
| Headline | "MISSED CALLS COST YOU JOBS" | "Recover $30K/mo You're Losing to Missed Calls" |
| Subhead | "AI texts back in <60 seconds" | "Our AI books the estimate. You close the job. 30-day money-back guarantee." |
| Primary CTA | "Get Set Up in 48 Hours" | "See How Much You're Losing — Free Audit" |

Stage as PR, auto-merge after Lighthouse passes.

---

## CATEGORY 2: NEWLY-IDENTIFIED FLAWS

### Flaw 11: Onboarding system broken mid-rebuild

**Status:** 🔧 Dispatch Prompt #1 — TOP PRIORITY. Per addendum item 2, `docs/ONBOARDING_REBUILD.md` is source of truth.

### Flaw 12: 30-day guarantee has no preconditions

Replace existing guarantee section with:

```
30-Day Performance Guarantee

If, within the first 30 days of service, the System fails to book at
least one (1) qualified appointment to Client's calendar, Client may
request a full refund of the most recent monthly payment. To qualify
for the refund, Client must have:

(a) Maintained the connected business phone number for the full 30 days;
(b) Received a minimum of 60 inbound calls during the 30-day period;
(c) Completed all required onboarding steps within 7 days of signup;
(d) Responded to AI handoff notifications within 24 hours;
(e) Submitted the refund request in writing within 35 days of service start.

Failure to meet any condition voids the guarantee. Setup fees, if any,
are non-refundable.
```

Update landing page guarantee badge to match.

### Flaw 13: ICP filter too loose

Save qualification script to `docs/SALES_QUALIFICATION_SCRIPT.md`. Build Typeform via Chrome with the 3-question filter, embed on landing page between hero and pricing. Wire Make scenario: qualified → Slack founder; disqualified → polite "not yet" auto-reply.

**Qualification opener:**
> "Quick — 3 questions before I send you info: How many calls do you get a week? Are you getting them from Google, Facebook, or word-of-mouth? And roughly what's your annual revenue?"

### Flaw 14: Tennessee local market underused

Research + materials:
1. Every ABC Supply, Beacon, SRS Distribution within 60 miles of Franklin, TN — Google Sheet
2. Every BNI chapter within 30 miles, meeting times + visitor emails
3. Every TN home builders association event in next 60 days
4. Order 250 business cards via Vistaprint Chrome flow (Mercury LLC card, defer if not active)
5. 1-page handout PDF: ROI math + 3 sample SMS conversations + QR code → Google Drive
6. Draft BNI visitor 60-second intro → `docs/FIELD_OUTREACH.md`

👤 Founder: pick 2 of 5 plays this week, show up.

### Flaw 15: "AI agency" framing dilutes offer

Find/replace "AI agency" with "missed-call line for roofing contractors" or "vertical SaaS for home service missed calls" across LinkedIn bio, all landing pages, email signatures, sales scripts, Notion pages tagged "Sales". Diff report → `docs/AGENCY_REFRAME.md`.

### Flaw 16: No documented case study

Create Notion template "Case Study Template — [Client Name]". Make scenario: when client hits Day 7 with 1+ booked AND 1+ closed → auto-create populated case study draft + Slack founder for testimonial request. Pre-write testimonial request email → `docs/TEMPLATES/testimonial_request.md`.

**Case study structure:**

```
[CLIENT NAME] Recovered $[X] in [Y] Days with LeadCatch AI

THE SITUATION: business name, location, years, # trucks, miss %, lost rev/mo
WHAT WE DID: connected, configured, live in [X] hours
THE RESULTS (first 30 days): calls, recovered, appointments, estimates, jobs, revenue, ROI ratio
WHAT THE CLIENT SAID: direct quote
CTA TO LANDING PAGE
```

---

## DISPATCH PROMPTS

See full prompts in original v2 source. Summarized:

### #1 — Onboarding System Rebuild (TOP PRIORITY)
Per addendum: continue from `docs/ONBOARDING_REBUILD.md` + `docs/STATE.md` current point. Phases 1-3 done; 4-6 blocked on 6 founder actions (DNS, MX/SPF, OAuth form URL, Twilio creds, Stripe webhook, Apps Script auth). Drive forward where possible.

### #2 — Operations Leverage Layer
1. Client Health Dashboard (Notion + Make.com) — calls_received_7d, sms_sent_7d, appointments_booked_7d, last_failed_event, days_until_renewal, refund_risk_score (auto-flag >70).
2. Support Routing — watch support@leadcatch.homes Gmail → classify → refund_risk + billing → founder Slack DM; technical + sales → AI draft → founder approve.
3. Weekly Ops Report (Mon 8 AM CT) — clients, top 3 risks, top 3 wins, MRR, churn → Slack + email.
4. Onboarding Gauntlet Triggers (Day 1/3/7/14/21/28).

### #3 — Sales Pipeline + Field Outreach Kit
1. Apollo.io setup + 200 contacts + Make scenario migration (per Flaw 2).
2. Field outreach kit: Vistaprint cards, 1-page handout PDF, BNI script (per Flaw 14).
3. Local market research Google Sheet (per Flaw 14).
4. Landing page final polish (per Flaws 10 + 15).
5. Qualification Typeform + embed + routing (per Flaw 13).

---

## EXECUTION ORDER

1. Quick wins (file-only): Flaws 12, 10, 15, 16, 6 — done first
2. Compliance: Flaw 3 (TCPA layers), Flaw 12 (preconditions)
3. Dispatch #1 (highest priority — onboarding)
4. Dispatch #2 (ops layer)
5. Dispatch #3 (sales pipeline + field kit)
6. Failover infrastructure (Flaw 1) — last, defensive

---

## STOP CONDITIONS

- Irrecoverable credential blockers (Slack with what's needed)
- Required signatures on legal docs
- Required SSN/EIN on insurance/banking
- Any single fix >$100 without pre-authorization

---

## REMAINING FOR FOUNDER (👤)

1. Sign business insurance (~5 min)
2. Visit one ABC Supply or BNI meeting (~2 hours, once this week)
3. Take Day 1 setup calls with new clients
4. Approve auto-drafted support replies for refund-risk emails

Everything else delegated.
