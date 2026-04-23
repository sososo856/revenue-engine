# Google Form Apps Script — OAuth completion webhook

This script runs on form submit and POSTs a payload to Make Scenario B (`leadcatch_oauth_complete`).

**Do NOT modify the form's structure, questions, or existing OAuth flow.** Only add this script and one `stripe_customer_id` short-answer field if it doesn't already exist.

## Prerequisites

1. The Google Form already collects calendar OAuth (this is Dan's existing flow).
2. Add a short-answer question titled exactly `stripe_customer_id` if not already present. Mark it required.
3. Confirm URL prefill works: visit `<form_url>?usp=pp_url&entry.NNNNNNNNNN=test123` — it should prefill the field. Get the `entry.NNNNNNNNNN` id from the "Get pre-filled link" feature in the form's ⋯ menu and paste back the Scenario A email link with the right entry id.

## Script install steps

1. Open the Google Form in Google Forms.
2. `⋯` (three dots, top right) → `Script editor`.
3. Replace the default code with the script below.
4. Set the two constants at the top:
   - `WEBHOOK_URL`: paste Scenario B webhook URL (from Make, after creating Scenario B)
   - `STRIPE_FIELD_TITLE`: keep as `stripe_customer_id` unless you renamed the field
5. Set the two optional OAuth property keys if your existing form stores OAuth tokens in Script Properties (typical pattern). Otherwise the script will send empty strings for those fields and Scenario B will note it.
6. Save.
7. `Triggers` (left sidebar, clock icon) → `+ Add Trigger`:
   - Function: `onFormSubmit`
   - Deployment: `Head`
   - Event source: `From form`
   - Event type: `On form submit`
   - Failure notification: `Notify me immediately`
8. Save trigger. Google will ask for auth — authorize with the same Google account that owns the form.
9. Test: visit `<form_url>?stripe_customer_id=cus_TESTDUMMY` in a private window, submit with fake answers, confirm Webhook B fires in Make and the response arrives.

## Script

```javascript
/**
 * LeadCatch AI — Google Form submit handler.
 * Sends a webhook to Make Scenario B (leadcatch_oauth_complete) with the
 * customer's stripe_customer_id, calendar email, and any OAuth tokens
 * previously stashed in Script Properties.
 */

const WEBHOOK_URL = 'https://hook.us1.make.com/REPLACE_WITH_SCENARIO_B_WEBHOOK';
const STRIPE_FIELD_TITLE = 'stripe_customer_id';

// If your existing OAuth flow stores tokens in Script Properties, set the
// keys here. Leave empty strings to skip — Scenario B will handle missing
// tokens gracefully (they're not required for calendar booking if the
// customer re-authorizes via the Calendar integration later).
const OAUTH_TOKEN_PROP_KEY = 'oauth_access_token';
const OAUTH_REFRESH_PROP_KEY = 'oauth_refresh_token';

function onFormSubmit(e) {
  try {
    const responses = e.response.getItemResponses();
    const payload = {
      stripe_customer_id: '',
      calendar_email: '',
      oauth_token: '',
      oauth_refresh_token: '',
      form_responses: {},
      submitted_at: new Date().toISOString(),
      respondent_email: e.response.getRespondentEmail() || '',
    };

    responses.forEach(function (r) {
      const title = r.getItem().getTitle();
      const answer = r.getResponse();
      payload.form_responses[title] = answer;

      if (title === STRIPE_FIELD_TITLE) {
        payload.stripe_customer_id = String(answer || '').trim();
      }
      // Accept a variety of common titles for the calendar email field.
      if (/calendar.*email|google.*email|email.*calendar/i.test(title)) {
        payload.calendar_email = String(answer || '').trim();
      }
    });

    // Fall back to respondent email if the form didn't explicitly ask.
    if (!payload.calendar_email && payload.respondent_email) {
      payload.calendar_email = payload.respondent_email;
    }

    // Pull OAuth tokens from Script Properties if available.
    const props = PropertiesService.getScriptProperties();
    if (OAUTH_TOKEN_PROP_KEY) {
      payload.oauth_token = props.getProperty(OAUTH_TOKEN_PROP_KEY) || '';
    }
    if (OAUTH_REFRESH_PROP_KEY) {
      payload.oauth_refresh_token = props.getProperty(OAUTH_REFRESH_PROP_KEY) || '';
    }

    if (!payload.stripe_customer_id) {
      // Still POST so Scenario B can surface the error to Dan.
      payload.form_responses._error = 'missing_stripe_customer_id';
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const code = response.getResponseCode();
    if (code < 200 || code >= 300) {
      console.error('Webhook failed', code, response.getContentText().slice(0, 500));
    }
  } catch (err) {
    // Log and swallow — never let this throw and block form submission.
    console.error('onFormSubmit error:', err && err.stack ? err.stack : err);
  }
}
```

## Verification

After trigger is installed, submit the form once with `?stripe_customer_id=cus_TESTDUMMY`. In Make:
- Scenario B should receive the webhook.
- Record `cus_TESTDUMMY` (create it manually first with `onboarding_status: awaiting_oauth` to avoid Strict-Mode errors) should be updated to `awaiting_intake`.
- Intake email should arrive.

## If the Apps Script editor throws permission errors

You'll be prompted to "Review permissions". Pick the Google account that owns the form, click through "Advanced" -> "Go to (unsafe)" -> "Allow". This is normal for unverified scripts.
