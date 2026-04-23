# Make.com Scenario Blueprints

These specs describe the three new onboarding scenarios (A/B/C) and the patch to the existing Twilio provisioner (4719941). Since the Make.com MCP was not available during the build, these are delivered as **human-readable module-by-module build specs** rather than importable blueprint JSON.

Dan's options to create the scenarios:

1. **Build manually in Make UI** following each `scenario-*.md` file step by step. Recommended — gives full visibility into the mapping.
2. **Re-invoke Claude Code with Make.com MCP enabled** and say "Read `docs/make/scenario-a-stripe-handler.md` and create the scenario in Make team 2036038." Claude will then produce the blueprint JSON directly via MCP.

Either way, every field/mapping/URL is fully specified in these docs.

## Files

| File | Purpose |
|------|---------|
| `scenario-a-stripe-handler.md` | Scenario A — Stripe `checkout.session.completed` -> create record + send OAuth email |
| `scenario-b-oauth-completion.md` | Scenario B — Google Form OAuth webhook -> update record + send intake email |
| `scenario-c-intake-provisioning.md` | Scenario C — Vercel intake form -> provision Twilio number + welcome SMS + activate |
| `scenario-twilio-provisioner-patch.md` | Diff spec for modifying scenario 4719941 |
| `datastore-schema.md` | Final field list for datastore 90246 records |

## Global conventions (apply to A, B, C)

- **Team:** `2036038`
- **Datastore for client records:** `90246`
- **Datastore for secrets:** `88980`
- **Primary key everywhere:** `stripe_customer_id` (raw, no prefix, e.g. `cus_NffrFeUfNV2Hib`)
- **Every HTTP module:** `handleErrors: true`, `maxErrors: 3`
- **Scenario metadata:** `sequential: true`, DLQ enabled
- **Error branches:** on any module failure, `datastore:UpdateRecord` with `onboarding_status: failed_{stage}`, then Brevo email to `somtooputa4@gmail.com` with `{{error}}` and `{{stripe_customer_id}}` in subject.
