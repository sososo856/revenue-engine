# Pre-Execution Corrections — Override FIX_PACKAGE.md

**This document has higher priority than FIX_PACKAGE.md.** When FIX_PACKAGE.md and this addendum conflict, this addendum wins. When this addendum conflicts with `docs/ONBOARDING_REBUILD.md`, the rebuild brief wins for onboarding-specific items only; this addendum wins for everything else.

## 1. Datastore corrections

- Datastore **90246** = client records (NOT SYSTEM_CONFIG)
- Datastore **88980** = API keys (Anthropic, Brevo, Apollo, OpenAI, etc.)
- `SYSTEM_CONFIG` is a **key inside datastore 90246**, not its own datastore
- Store all new API keys in datastore **88980**
- Read FIX_PACKAGE.md references to "datastore 90246 SYSTEM_CONFIG" as "key SYSTEM_CONFIG inside datastore 90246"

## 2. Onboarding rebuild takes priority

- `docs/ONBOARDING_REBUILD.md` is the source of truth for Dispatch Prompt #1, NOT FIX_PACKAGE.md's version
- Execute the existing rebuild brief, not a parallel rebuild
- Honor all archive/preserve/never-touch rules in that brief

## 3. Never-touch scenarios (regardless of FIX_PACKAGE instructions)

- **4611742** — CRM Update — Inbound Reply Handler (battle-tested)
- The "SMS Closer" referenced in Flaw 3 means scenario **4681781**, NOT 4611742. Confirm scenario ID before any audit.

## 4. Scenario 4709427 (Daily Auto Prospector) pre-fix

- This scenario has `isinvalid` flag set
- Before any Apollo migration, Slack founder asking him to manually open the scenario in Make UI and click **Save** to clear the flag
- Do not attempt automated edits until cleared

## 5. FAQ chatbot pause gate

- Originally specified: query Stripe for active "FAQ" or $207 subscriptions before pausing
- **Resolved by item 7 below** — no FAQ chatbot upsell exists; skip this gate

## 6. Conflict resolution

If any other conflict arises between this corrections block and FIX_PACKAGE.md, this block wins. If a conflict arises with `docs/ONBOARDING_REBUILD.md`, that document wins for onboarding-specific items only; this block wins for everything else.

## 7. Skip Flaw 9 entirely (added 2026-04-25)

- There is no FAQ chatbot upsell
- The offer is a single $2,997/mo all-inclusive package
- **Do not remove anything labeled "FAQ"** — there is nothing to remove
- Skip Flaw 9, move to Flaw 10
