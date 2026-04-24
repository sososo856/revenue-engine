/**
 * Google Form OAuth Completion → Make Webhook B
 *
 * PASTE THIS into your existing OAuth Google Form:
 *   Extensions → Apps Script → replace default code with this script → save.
 *   Then: Triggers (clock icon) → Add Trigger → function: onFormSubmit,
 *   event source: From form, event type: On form submit. Authorize when prompted.
 *
 * Assumes your form has a short-answer field literally titled "stripe_customer_id"
 * (or any variant containing "stripe_customer_id"). Prefill the field via URL param:
 *   <form-url>?stripe_customer_id=cus_abc123
 *
 * Any field titled "email" or containing "@" is sent as calendar_email.
 */

var WEBHOOK_B_URL = "https://hook.us2.make.com/p4twy6homsddyuu3aigocqygn3iwbfro";

function onFormSubmit(e) {
  try {
    var itemResponses = e.response.getItemResponses();
    var payload = {};

    for (var i = 0; i < itemResponses.length; i++) {
      var r = itemResponses[i];
      var title = (r.getItem().getTitle() || "").toLowerCase().trim();
      var key = title.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      var answer = r.getResponse();
      payload[key] = Array.isArray(answer) ? answer.join(", ") : answer;

      if (title.indexOf("stripe_customer_id") !== -1) {
        payload.stripe_customer_id = answer;
      }
      if (title === "email" || title.indexOf("email") !== -1 || String(answer).indexOf("@") !== -1) {
        if (!payload.calendar_email) payload.calendar_email = answer;
      }
    }

    payload.respondent_email = e.response.getRespondentEmail() || payload.calendar_email || "";
    payload.submitted_at = new Date().toISOString();

    if (!payload.stripe_customer_id) {
      Logger.log("ERROR: stripe_customer_id missing from form submission. Payload: " + JSON.stringify(payload));
      MailApp.sendEmail("somtooputa4@gmail.com", "[Apps Script] stripe_customer_id missing on OAuth form submit", JSON.stringify(payload, null, 2));
      return;
    }

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(WEBHOOK_B_URL, options);
    Logger.log("Webhook B status: " + response.getResponseCode() + " body: " + response.getContentText());
  } catch (err) {
    Logger.log("Apps Script error: " + err);
    MailApp.sendEmail("somtooputa4@gmail.com", "[Apps Script] OAuth form handler crashed", String(err));
  }
}
