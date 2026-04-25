# Field Outreach Kit — Tennessee Local Market (Flaw 14)

**Audience:** Roofing contractors in Franklin TN + 60-mile radius (Nashville, Murfreesboro, Brentwood, Spring Hill, Columbia).

**Goal:** 3 in-person plays per week → 1 demo booked per week → 1 client closed per month from local channel.

---

## Play 1 — BNI Visitor Drop-Ins

### What BNI is

Business Networking International — weekly breakfast/lunch meetings of one professional per category per chapter. Roofers attend. Visitors get a 60-second slot to introduce themselves.

### How to find chapters within 30 miles

1. Go to https://www.bni.com → "Find a Chapter"
2. Enter zip 37064 (Franklin) → list local chapters and meeting times
3. Email the chapter visitor host 48h ahead asking to attend as a guest (free for first visit)

### 60-second intro script

> "Hey everyone, I'm Alex with LeadCatch AI. We solve one specific problem for roofers: missed calls.
>
> The average roofing contractor misses 30% of inbound calls — calls that turn into $8K jobs. That's $30,000+ a month walking out the door, every month.
>
> What we built is an AI that picks up the phone in under 60 seconds when you can't, qualifies the caller, and books the estimate straight to your calendar. You wake up to your day already booked.
>
> Most contractors who use us recover their entire monthly fee in the first booked job.
>
> If anyone in the room knows a roofer who's losing calls, I'd love a 5-minute conversation with them. I'll bring the ROI math. That's it — thanks for the time."

**Tips:**
- Wear LeadCatch polo + name tag
- Hand a business card to anyone who lingers afterward
- Follow up the same day with a short "great meeting you" Slack/text

### Success metric

- 8 BNI visits → 3 referrals → 1 demo booked

---

## Play 2 — Roofing Supply House Drops

### Why this works

ABC Supply, Beacon Building Products, SRS Distribution — these are where every working roofer in the area goes for materials. The store managers know who's busy, who's growing, who's struggling.

### Targets within 60 miles of Franklin TN

> _Pull live list to `revenue-engine/data/tn-supply-houses.csv` via Apollo or Google Maps once Apollo signup is done. Manually scoutable in the meantime via Google Maps "ABC Supply near Franklin TN"._

Reference list anchor (verify each before driving):
- **ABC Supply Co. — Nashville** (multiple branches)
- **Beacon Building Products — Nashville/Murfreesboro/Spring Hill**
- **SRS Distribution / Heritage Roofing Supply — Nashville**

### Drop-in script

> "Hey [Manager Name] — I'm Alex from LeadCatch AI. We help roofing contractors in this area not lose missed calls. I'm not selling to you — I just want to leave 5 of these handouts and 5 cards. If a roofer comes in complaining about being slammed or losing leads, would you mind passing one along?"

Hand them: 1-page ROI handout (Play 4) + business cards.

### Success metric

- 12 supply house drops → 1 referred lead/week within 30 days

---

## Play 3 — TN Home Builders Association Events

### Why

Roofers attend HBAMT (Home Builders Association of Middle Tennessee) events — monthly luncheons, golf, awards. Shoulder-to-shoulder access.

### How to find next 60 days of events

- HBAMT calendar: https://hbamt.com/events/
- Pull event list to `revenue-engine/data/tn-hba-events.csv` weekly via Gemini or manual

### Tactic

- Buy a single-event guest ticket (most are $40–$100)
- Bring 30 cards + 30 handouts
- Ask host to introduce you to "any roofer in the room"
- 3 conversations per event, no more — quality > quantity

### Success metric

- 1 event/month → 1 demo booked per event

---

## Play 4 — 1-Page Handout PDF

**File location:** Store final PDF at `revenue-engine/assets/leadcatch-handout-v1.pdf`. Source content below — design in Canva or Gamma, save as A4 PDF, then save to file.

### Content (one side, large readable font)

```
═══════════════════════════════════
  LEADCATCH AI
  for roofing contractors
═══════════════════════════════════

  STOP LOSING $30K/MONTH
  TO MISSED CALLS

  THE MATH:
  ─────────────────────────────────
  Avg. roofing contractor:
  • 60 calls/week
  • 30% missed (busy / off-hours)
  • $8,000 avg. job value
  • 25% close rate

  Lost revenue/month:
  60 × 0.30 × 4 weeks × $8K × 0.25
  = $36,000 lost every month

  ─────────────────────────────────

  WHAT LEADCATCH DOES:
  • Picks up missed calls in <60s
  • Texts the caller, qualifies them
  • Books the estimate to your calendar
  • You wake up to your day booked

  ─────────────────────────────────

  THREE TEXT EXCHANGES (real):

  Caller: "Need a quote for a metal roof"
  AI: "What's your address? I can grab a satellite shot
       for the estimator."
  Caller: "1234 Main St"
  AI: "Got it. Best day this week for a 30-min walk-around?"
  Caller: "Tuesday"
  AI: "Booked you for Tuesday 10am. Your estimator will text
       you a confirm. Anything else?"

  ─────────────────────────────────

  PRICING:
  $2,997/mo all-inclusive
  30-day money-back performance guarantee*
  *conditions apply — see leadcatch.homes/refund

  ─────────────────────────────────

  See your loss → leadcatch.homes
  Book a 15-min audit:  alex@leadcatch.homes
                        [QR code → contact form]

```

**Design notes:** Single color (LeadCatch brand red #c41e3a + black). Bold the dollar amounts. QR code links to `leadcatch.homes/audit` (or `#contact` anchor). Print 250 copies on heavy stock.

### Production options

- **Vistaprint** (currently blocked — Mercury LLC card not active)
- **Local print shop** (cash) — Franklin Print, Spring Hill Quick Print
- **Canva print-on-demand** with personal card

---

## Play 5 — Direct outreach via SMS to local roofers

**Status:** ⏸️ Deferred — TCPA opt-out compliance must be locked in (SMS Closer 4681781 + Opt-Out Handler 4775406) before any cold SMS to a list. After opt-out is wired, this becomes a high-leverage Apollo-driven play.

---

## Tracking sheet — `revenue-engine/data/tn-field-outreach-log.csv`

Columns:
```
date, play_type, location, contact_name, role, follow_up_due, notes, demo_booked
```

Manual update after each drop-in.

---

## Founder commitment

Pick **2 of 5 plays per week**, show up. The first 90 days, presence > polish.
