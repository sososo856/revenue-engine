# Stripe Webhook Endpoint — Setup

Scenario A (`leadcatch_stripe`) needs Stripe to POST `checkout.session.completed` to its webhook URL.

## Steps

1. Create Scenario A in Make (see `docs/make/scenario-a-stripe-handler.md`). Copy its custom webhook URL (shown in the webhook module's details, looks like `https://hook.us1.make.com/xxxx`).
2. Open Stripe Dashboard → **Developers** → **Webhooks**.
3. If a webhook already points at the old Stripe Delivery scenario (`4611743`), select it and click **Update endpoint**; otherwise click **+ Add endpoint**.
4. **Endpoint URL:** paste the Make Scenario A webhook URL.
5. **Events to send:** click **+ Select events**. Add only:
   - `checkout.session.completed`
6. Click **Add endpoint**.
7. Copy the **Signing secret** (starts with `whsec_...`).
8. Open Make → datastore `88980` → Add/update a record with:
   - Key: `stripe_webhook_secret`
   - Value: `whsec_...`
   - Comment: "For future signature verification in Scenario A. Not consumed in MVP."
9. Save.

## Optional: MVP signature verification (recommended within 30 days of go-live)

Scenario A MVP accepts any POST to its webhook URL — fine for a private URL but anyone who learns the URL could submit fake payments. To tighten:

1. Insert a new module 2 in Scenario A: `tools:SetVariable`
   - Name: `stripe_sig`
   - Value: `{{1.headers.stripe-signature}}` (the header name Make uses depends on how you set up the webhook; inspect a live call to confirm)
2. Insert module 3: `datastore:GetRecord` on datastore 88980, key `stripe_webhook_secret`
3. Insert module 4: a `crypto:HMACSHA256` helper to verify the signature (Stripe uses a timestamped `t=...,v1=...` format — see Stripe docs). If mismatch, filter/stop.

This is tracked as a TODO in the final architecture doc, not blocking MVP launch.

## Old webhook — do not delete yet

Leave the old endpoint (if any) pointing at the old scenario **disabled**, not deleted, until the new system has been live-tested (Phase 6 passes) and run a real customer through end-to-end once.
