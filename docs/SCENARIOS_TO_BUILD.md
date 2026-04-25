# Make Scenarios To Build — Phase 4 / Dispatch #2 (Ops Layer)

**Status:** Notion DBs live (see IDs below). Scenarios specced here for Dan or follow-up session. Make `scenarios_create` API works (verified 2026-04-25 with scenario 4862804, since deleted), but assembling complex multi-module blueprints via API is fragile — recommended path is build in Make UI using these specs.

## Notion DB targets

| DB | URL | Data Source ID |
|---|---|---|
| 📈 Client Health Dashboard | notion.so/b3d7afbf84664722a0f02f632204e68d | `827a1803-624b-4c19-b1e5-1b8e53921af9` |
| 📥 Support Inbox | notion.so/557de9c15c5f4a049c4ff2aa60e3a9b0 | `d2e9c75e-05f4-426c-823e-a188a524ed87` |
| 🛤️ Onboarding Gauntlet | notion.so/a3fbed063a814ffb8c2bdacbbd659c0c | `36b1714e-0bce-45d4-a678-c0eb25366b7d` |
| 📊 Weekly Ops Report | notion.so/c1a18696d8594f26a18b2d919b094ae1 | `db1315f6-21d5-4491-b16d-939f42e965c4` |

---

## Scenario 1 — Client Health Updater

**Purpose:** Hourly job that aggregates per-client metrics and upserts rows into the Client Health Dashboard DB.

**Trigger:** Schedule, every 1 hour.

**Flow:**
1. **Iterator:** loop datastore 90246 records (clients).
2. **For each client:**
   - **Twilio: list calls** received in last 7 days where `to == client.tracking_number`. Count → `calls_received_7d`.
   - **Twilio: list SMS** sent in last 7 days where `from == client.tracking_number`. Count → `sms_sent_7d`.
   - **Google Calendar: list events** in last 7 days on `client.calendar_email` matching booking pattern. Count → `appointments_booked_7d`.
   - **Stripe: subscription retrieve** by `client.stripe_customer_id` → compute `days_until_renewal` from `current_period_end`.
   - **Make scenarios: list executions** filtered by `client.stripe_customer_id` over last 7 days where `status == error`. First match → `last_failed_event` (truncate to 200 chars).
   - **Compute refund_risk_score** (0–100):
     - +30 if `appointments_booked_7d == 0`
     - +20 if `calls_received_7d < 15`
     - +20 if `last_failed_event` not null
     - +10 if `sms_sent_7d == 0`
     - +20 if `days_until_renewal < 7` AND `appointments_booked_7d < 2`
   - **Notion: search-or-create** in Client Health Dashboard DB by `Stripe Customer ID`. Then **update page** with all fields including `Last Updated = now()`.

**Filters:** Skip clients with `status == churned` or `archived == true`.

**Estimated build time in Make UI:** 25 min.

---

## Scenario 2 — Support Routing

**Purpose:** Watch `support@leadcatch.homes` Gmail inbox, classify each new thread, draft AI reply, route to founder.

**Trigger:** Gmail watch (new email in inbox), every 5 minutes.

**Flow:**
1. **Gmail: watch emails** in inbox.
2. **Parse:** extract `from`, `subject`, `body_plaintext`, `thread_id`.
3. **Match sender to client:** lookup `from` email in datastore 90246 (clients). If match, save `linked_client_url` (Notion page URL of that client in Client Health Dashboard).
4. **Claude classify** (use existing leadcatch-proxy `/api/claude`): prompt with subject + body. Output strict JSON `{type: "technical"|"billing"|"sales"|"refund_risk"|"general", refund_risk_score: 0-100, summary: "...", suggested_reply: "..."}`.
5. **Notion: create page** in Support Inbox DB with:
   - Subject = email subject
   - From Email = sender
   - Type = parsed type
   - Linked Client = relation to Client Health Dashboard row (if matched)
   - Status = "draft_ready" if technical/sales, "awaiting_approval" if refund_risk/billing, "new" otherwise
   - AI Draft Reply = parsed `suggested_reply`
   - Refund Risk Score = parsed score
   - Gmail Thread ID = thread_id
6. **Router:**
   - If `type == refund_risk` OR `type == billing` → **Slack DM Dan** with link to the new Notion page + 1-line summary + [Approve & Send] button (button = Slack interaction trigger that fires Scenario 2b).
   - Else → no Slack ping (founder reviews draft on schedule via Notion).

**Filters:** Skip emails where `from` matches `noreply@`, `mailer-daemon@`, automation senders.

**Estimated build time in Make UI:** 35 min (Claude classify is the trickiest module — copy from existing CRM Claude pattern in scenario 4611742).

---

## Scenario 2b — Support Reply Sender (companion)

**Purpose:** When founder approves a Slack draft, send the AI reply via Gmail.

**Trigger:** Slack interaction webhook on the [Approve & Send] button.

**Flow:**
1. Parse Slack payload → extract `notion_page_id`.
2. **Notion: fetch page** by ID → read `AI Draft Reply`, `Gmail Thread ID`, `From Email`, `Subject`.
3. **Gmail: send reply in thread** with the AI draft body.
4. **Notion: update page** Status = "sent".
5. **Slack: respond** with confirmation in original thread.

**Estimated build time in Make UI:** 15 min.

---

## Scenario 3 — Weekly Ops Report Generator

**Purpose:** Every Monday 8am CT (13:00 UTC), aggregate the past 7 days into a single row in Weekly Ops Report DB and Slack the founder a summary.

**Trigger:** Schedule, weekly at `13:00 UTC` Mondays.

**Flow:**
1. **Notion: query** Client Health Dashboard for all rows where `Status` in [`active`, `at_risk`].
2. **Aggregations:**
   - Count active clients → `active_clients`
   - Sum each `$2,997` per active → `mrr`
   - Stripe: count subscriptions created in last 7 days → `new_clients_this_week`
   - Stripe: count subscriptions canceled in last 7 days → `churned_this_week`, sum amount → `churn_dollars`
   - Sort by `Refund Risk Score` desc, take top 3 → `top_risk_1/2/3` (format: "Client Name — score N — last_failed_event excerpt")
   - Sort by `Appointments Booked 7d` desc, take top 3 → `top_win_1/2/3` (format: "Client Name — N appointments booked")
   - Notion: query Support Inbox where `Status` not in [`sent`, `resolved`] → count → `open_support_tickets`
   - Notion: query Support Inbox where `Type == refund_risk` AND created in last 7 days → count → `refund_risks_flagged`
   - Notion: query Onboarding Gauntlet where `Overall Health == on_track` → count → `gauntlet_on_track`
   - Notion: query Onboarding Gauntlet where `Overall Health == at_risk` → count → `gauntlet_at_risk`
3. **Notion: create page** in Weekly Ops Report DB with `Week Of = "Week of YYYY-MM-DD"` and all aggregated values.
4. **Slack: send to founder DM** Markdown summary:

```
📊 *Week of {{date}}* — LeadCatch Ops Report

• Active clients: {{active_clients}}  |  MRR: ${{mrr}}
• New: {{new_clients}}  |  Churned: {{churned}} (${{churn_dollars}})
• Open support: {{open_support_tickets}}  |  Refund risks: {{refund_risks_flagged}}

🚨 Top Risks:
1. {{top_risk_1}}
2. {{top_risk_2}}
3. {{top_risk_3}}

🏆 Top Wins:
1. {{top_win_1}}
2. {{top_win_2}}
3. {{top_win_3}}

Onboarding Gauntlet: {{gauntlet_on_track}} on track / {{gauntlet_at_risk}} at risk

Full report: https://www.notion.so/c1a18696d8594f26a18b2d919b094ae1
```

**Estimated build time in Make UI:** 30 min.

---

## Scenario 4 — Onboarding Gauntlet Triggers

**Purpose:** Daily 9am CT job that advances each Onboarding Gauntlet row through Day 1/3/7/14/21/28 milestones.

**Trigger:** Schedule, daily at `14:00 UTC` (9am CT).

**Flow:**
1. **Notion: query** Onboarding Gauntlet DB where `Overall Health != "completed"`.
2. **Iterator:** for each row, compute `current_day = today - Started On`.
3. **Switch on current_day:**
   - **Day 1:** if `Day 1 — Setup Call == pending`, **Brevo: send email** to client (`{{client.email}}`) with setup-call booking link. Update field → `scheduled`.
   - **Day 3:** if `Day 3 — Missed-Call Test == pending`, **Twilio: place test call** to client tracking number (1 ring then hang up). 30 min later check Twilio recordings for inbound webhook hit. If hit, mark `done`. Else mark `missed` AND Slack Dan.
   - **Day 7:** if `Day 7 — First Booked Celebration == pending`, query Client Health for that client's `appointments_booked_7d`. If ≥1, **Brevo: send celebration email** + mark `sent`. Else mark `no_booking_yet` AND Slack Dan.
   - **Day 14:** if `Day 14 — ROI Report == pending`, generate ROI report (Claude API: input client metrics, output formatted PDF or Notion page) → **Brevo: send email** with link → mark `sent`. If ROI < 5x, also Slack Dan with churn-risk warning.
   - **Day 21:** if `Day 21 — Check-in Call == pending`, **Brevo: send email** offering 15-min check-in → Calendly link → mark `scheduled`. If no booking by Day 23, Slack Dan.
   - **Day 28:** if `Day 28 — Renewal Conversation == pending`, **Brevo: send email** previewing Day 30 renewal → mark `scheduled`. **Slack Dan** with link to the upcoming renewal touchpoint.
4. **Update Overall Health** based on field states:
   - All `done`/`sent` → `completed`
   - Any `missed` → `at_risk`
   - Day 28 done AND no churn → `completed`

**Estimated build time in Make UI:** 45 min.

---

## Build order recommendation

1. **Scenario 1 first** — Client Health Updater is dependency for everything else.
2. **Scenario 2 + 2b** — Support Routing (most immediate ROI: every email gets handled).
3. **Scenario 4** — Onboarding Gauntlet (only fires when first paying client signs up; can defer until then).
4. **Scenario 3** — Weekly Ops Report (only useful once 1+ clients exist).

## Failure considerations

- All Notion writes should set Notion API rate limit retry (3 retries, exponential backoff).
- Twilio call volume queries on free Twilio trial account = limited; budget aware.
- Stripe API queries are unlimited but charged per request — the hourly Client Health Updater could spam if not idempotent.
