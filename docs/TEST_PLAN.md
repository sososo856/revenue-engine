# Phase 6 — End-to-End Live Test

**Do not skip. No scenario goes active until this passes.** Run with all three new scenarios in test/run-once mode and the old scenarios still archived.

## Prerequisites

- [ ] Scenarios A, B, C created in Make, `isActive: false` (test mode).
- [ ] Twilio provisioner (4719941) patched per `docs/make/scenario-twilio-provisioner-patch.md`, `isActive: false`.
- [ ] Intake form deployed at `https://intake.leadcatch.homes` (or preview URL).
- [ ] Apps Script installed on the Google Form, trigger armed.
- [ ] Stripe webhook endpoint pointing at Scenario A URL (can be the test-mode endpoint).
- [ ] Cleanup: no residual `cus_TEST*` records in datastore 90246.

## Test 1 — Happy path

1. Create a $1 test-mode product in Stripe if one doesn't exist.
2. In a private browser, check out with:
   - Email: a real inbox Dan controls
   - Phone: a real number Dan controls
3. Complete payment. **Expected:**
   - [ ] Scenario A runs (check Make execution history)
   - [ ] Datastore 90246 has new record keyed on `cus_...` with `onboarding_status: awaiting_oauth`
   - [ ] OAuth invite email arrives at test inbox within 60s
   - [ ] Internal email arrives at `somtooputa4@gmail.com`
4. Click OAuth link from email. Complete the Google Form (including any calendar OAuth).
5. Submit form. **Expected:**
   - [ ] Scenario B runs
   - [ ] Record updated: `onboarding_status: awaiting_intake`, `calendar_email` set
   - [ ] Intake invite email arrives
   - [ ] Internal email arrives
6. Click intake link. Fill in all required fields. Submit.
7. **Expected:**
   - [ ] Scenario C runs
   - [ ] Record transitions: `provisioning` → `active`
   - [ ] Twilio Provisioner invocation shows success in Make
   - [ ] New Twilio number appears in Twilio console
   - [ ] Welcome SMS arrives at Dan's phone from the new number
   - [ ] Welcome email arrives at the customer email
   - [ ] "Client ACTIVATED" internal email arrives at `somtooputa4@gmail.com`

## Test 2 — Forced failure (Scenario A error branch)

1. Temporarily change the `brevo_api_key` record in datastore 88980 to an invalid value.
2. Fire a Stripe `checkout.session.completed` test event.
3. **Expected:**
   - [ ] Scenario A creates the record (module 3 succeeds — doesn't need Brevo)
   - [ ] Module 4 (Brevo send) fails
   - [ ] Error branch fires: record updates to `onboarding_status: failed_stripe_handler`, `last_error` set
   - [ ] Dan receives `[LeadCatch ERROR] Stripe handler failed` email via a different channel (Make's own error notification — since Brevo is broken, this alert arrives via Make's built-in error notifications OR via a fallback: if you also wired a Gmail/other send in the error branch, it arrives there)
4. Restore the correct Brevo key.
5. Delete the `failed_stripe_handler` test record.

> If Brevo is the only alerting channel and it's broken, Dan won't see the alert. For MVP this is acceptable — Make's internal "scenario failed" notifications go to the team's email and are a second-layer alert. Future hardening: add a secondary notifier (Slack webhook, SendGrid fallback).

## Test 3 — Forced failure (Twilio provisioner timeout)

1. Temporarily set Scenario C module 8's URL to an invalid endpoint.
2. Complete a full happy-path run-once flow with `cus_TEST_TWILIOFAIL`.
3. **Expected:**
   - [ ] Scenario C runs up through module 8, which fails
   - [ ] Error branch: record updates to `failed_twilio_provisioning`
   - [ ] Dan receives error alert email
   - [ ] No Twilio number is purchased
   - [ ] No welcome SMS sent
4. Restore module 8 URL.
5. Delete test record.

## Test 4 — Race condition safety

Run two identical run-once flows against Scenario C for the same `cus_TEST_RACE` (after seeding record to `awaiting_intake`) 0-2 seconds apart.

**Expected:**
- [ ] `sequential: true` prevents concurrent execution
- [ ] First run provisions a number and marks `active`
- [ ] Second run either:
  - (a) runs after first completes, sees `active`, and its datastore update is a no-op, OR
  - (b) fails because Twilio can't purchase a second number for the same customer (Twilio returns a distinct number regardless — so actually both may purchase, which is a bug). 

> If (b): add a guard at Scenario C start: `datastore:GetRecord` → if `onboarding_status == active`, exit early via a filter. **Add this guard before going to production.**

## Cleanup

- [ ] Release any test Twilio numbers in Twilio console.
- [ ] Delete all `cus_TEST*` records from datastore 90246.
- [ ] Confirm no test emails stuck in queue.

## Gate

Only after all four tests pass, proceed to Phase 7 (cutover).
