# Brevo Key Migration — Hide Plaintext API Key from Make Datastore

## Problem

The Brevo API key is stored as plaintext in Make datastore `88980` under key `brevo_api_key`. Anyone with Make workspace `2036038` access can read it via the datastore UI or API. Mitigations available without proxy migration are weak — Make datastores are not encrypted at rest. Currently only Dan has workspace access, but the key has been exposed in tool-result logs and chat transcripts during prior sessions.

## Plan

Move the actual key into Vercel env on `leadcatch-proxy` and route Make's Brevo calls through a new `/api/brevo` proxy endpoint. The Make datastore `brevo_api_key` value becomes a sentinel (`via_proxy_only`) — not a real key. Same shared-secret auth pattern as the existing `/api/claude` proxy.

## Steps

### 1. Code (DONE — committed in this batch)

- New file: `leadcatch-proxy/api/brevo.js` — mirror of `api/claude.js` pattern. Validates `x-proxy-secret`, reads `BREVO_API_KEY` from env, forwards POSTs to `api.brevo.com/v3/smtp/email`.

### 2. Vercel env (Dan action — 1 min)

Open the Vercel project for leadcatch-proxy, add an env var:

- `BREVO_API_KEY` — paste the current key from Make datastore 88980 record `brevo_api_key`. Set scope: Production + Preview + Development.

Then redeploy (or wait for next push to trigger redeploy).

### 3. Brevo key rotation (Dan action — 2 min, recommended)

Because the key has been visible in earlier tool-result logs:

1. Open https://app.brevo.com/ → Account → SMTP & API → API Keys
2. Generate a new API key (name it `leadcatch-proxy`, scope: Send transactional emails)
3. Paste the new key into the Vercel env var (overwriting step 2's value)
4. Revoke the old key in Brevo

### 4. Update Make scenarios that call Brevo (Claude Code action — staged below)

Audit scope: any scenario whose flow contains an HTTP module pointed at `https://api.brevo.com/v3/smtp/email`. Found in initial audit:

- `4681781` — SMS Closer (module 8: Brevo email to Dan after each SMS reply)
- Likely also: scenarios that send welcome emails, onboarding emails, weekly reports, etc. Full audit needed once the proxy is deployed and the new endpoint is verified working.

For each affected module, swap:

- URL: `https://api.brevo.com/v3/smtp/email` → `https://leadcatch-proxy.vercel.app/api/brevo`
- Headers: keep `Content-Type: application/json`. Replace the `api-key: {{50.value}}` (or whatever datastore reference holds the Brevo key) with `x-proxy-secret: {{51.value}}` (the existing proxy-secret reference). Body and response handling stay identical.

### 5. Replace datastore key value (Claude Code action — after scenarios migrated)

Once every Brevo-using scenario is migrated and verified, update the Make datastore record:

```
key: brevo_api_key
value: via_proxy_only
description: Sentinel — actual Brevo key lives in Vercel env BREVO_API_KEY on leadcatch-proxy. Do not put a real key here.
```

This removes the secret from Make permanently.

## Risk note

Step 4 cannot be safely batched until the proxy is deployed AND verified working with a test send. Otherwise, an in-flight scenario migration would silently fail to send emails.

## Tracking

- ✅ `leadcatch-proxy/api/brevo.js` written
- 🔧 Vercel env var setup — Dan
- 🔧 Brevo key rotation — Dan
- ⏸️ Scenario migration — deferred until proxy live + verified
- ⏸️ Datastore sentinel swap — last step
