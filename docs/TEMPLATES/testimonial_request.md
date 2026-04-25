# Testimonial Request — Auto-sent at Day 7 with first booked appointment + first closed job

**Trigger:** Make scenario `Onboarding Gauntlet` Day-7 step, conditional on `30d_appointments >= 1 AND 30d_closed_jobs >= 1`.
**Sender:** `alex@leadcatch.homes` via Brevo
**Logged to:** Notion case study page `testimonial_status: requested` + timestamp
**Reply parsing:** Make scenario `4611742 — CRM Update — Inbound Reply Handler` (DO NOT MODIFY — addendum item 3)

---

**Subject:** Quick win to celebrate — and one ask

Hi {{first_name}},

Just saw {{business_name}} closed a job this week from a missed call LeadCatch booked. That's the loop working exactly how it's supposed to.

Two things:

1. I'm building case studies of contractors getting real ROI from this. Would you be willing to record a 60-second video on your phone — just owner-to-owner, what the system did for you in the first 30 days? Or, if video isn't your thing, a short written quote works too.

2. If you've got a referral in mind — a roofer in another market who'd benefit — I'll skip them ahead of the waitlist and waive the setup process for them.

No rush on either. Whichever feels easier.

— Dan
LeadCatch AI · the missed-call line for roofers
{{prefilled_roi_url}}

---

## Variant for clients hesitant about video

**Subject:** {{business_name}} — would a written quote work?

Hi {{first_name}},

Following up on the testimonial ask. If video feels like too much, a 2-3 sentence quote works fine — happens to be what most contractors send anyway. Something like:

> "We were missing 30+ calls a week. LeadCatch booked 14 estimates in the first month and 4 of those closed. Paid for itself twice over."
>
> — [Your name], [Business name]

If you can send a quick line, I'll write the rest. Just hit reply.

— Dan

---

## Variant for declined / no-response after 14 days

Drop. Do not send a third request. Mark `testimonial_status: declined` in the Notion case study page. Continue serving the client as normal.
