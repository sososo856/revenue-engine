# Notion Pipeline Setup — 10 Minutes Flat

You're not building from scratch. `pipeline-import.csv` is already structured. Import it, configure 4 views, done.

---

## Step 1 — Import (3 minutes)

1. Open Notion → new page → type `/database` → pick **Database - Full page**
2. Click the `···` menu (top-right of the database) → **Merge with CSV**
3. Upload `/execution/pipeline-import.csv`
4. Notion auto-creates columns. Delete the "Example Prospect" row after you've seen it.

## Step 2 — Fix field types (4 minutes)

Notion imports everything as "Text". Convert these:

| Column | Change to |
|---|---|
| Stage | **Select** — add options: Prospect, Contacted, Engaged, Call Booked, Proposal Sent, Won, Lost / Nurture |
| Source | **Select** — Cold Audit, Warm Reactivation, Referral, Founder Call, Partnership, Inbound |
| Niche | **Select** — HVAC, Dental, Plumbing, Chiro, Law, Gym, Roofing, Auto, Salon, Other |
| Expected Package | **Select** — Starter, Growth, Scale, DFY |
| Entered Stage On | **Date** |
| Next Action Date | **Date** |
| Expected Deal Value | **Number** → format: Dollar |
| Loom Link | **URL** |

## Step 3 — Create the 4 views you actually use (3 minutes)

Click **+ Add view** four times:

### View 1: "Today" (Board, grouped by Stage)
- Filter: **Next Action Date** is on or before today
- Group by: Stage
- Sort: Next Action Date, ascending
- **Use this view every morning.** If it's empty, you have nothing to do — go prospect.

### View 2: "Pipeline" (Board, grouped by Stage)
- No filter
- Group by: Stage
- Sort: Entered Stage On, descending
- **This is your Kanban.** Drag cards as they move stages.

### View 3: "Stuck" (Table)
- Filter: Next Action Date is before today AND Stage is not "Won" AND Stage is not "Lost / Nurture"
- Sort: Next Action Date ascending
- **Check every Friday.** Anyone here for 7+ days = move to Lost or take the action.

### View 4: "This Week" (Table)
- Filter: Entered Stage On is in the last 7 days
- Sort: Entered Stage On descending
- **Weekly review material.** This is how you fill out the KPI scorecard.

## Step 4 — Add the KPI scorecard (30 seconds)

Above the database, add a **callout block** (`/callout`) with this text and update it every Friday:

```
WEEK OF: ___
Audits sent: __/50  |  Replies: __  |  Calls: __  |  Proposals: __  |  Closes: __
Setup cash: $__     |  New MRR: $__  |  Run-rate: $__ × 4 = $__
Weakest stage: ____ | Fix next week: ____
```

---

## That's it.

You now have a CRM that costs $0 and takes 5 minutes a day. When you hit 15+ active clients, graduate to HubSpot free or Pipedrive. Not before.

**Don't over-engineer it.** The number of fields I listed is the number you need. Do not add a "priority" field, a "temperature" field, an "industry vertical subcategory" field. Every field you add is one more field you'll stop updating, and a half-updated CRM is worse than no CRM.
