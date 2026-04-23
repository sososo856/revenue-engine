# Deploying the Intake Form — Dan's Manual Steps

Claude scaffolded the full Next.js app under `intake-form/` in this repo but can't:
- create the new `sososo856/leadcatch-intake` GitHub repo (scope-restricted)
- deploy to Vercel (no Vercel MCP/CLI in the sandbox)
- add the CNAME (only you can access your DNS provider)

These are the steps you need to run.

## 1. Create the new GitHub repo

Option A — from phone / browser:
1. Go to https://github.com/new
2. Owner: `sososo856`
3. Name: `leadcatch-intake`
4. Visibility: Private
5. Do NOT initialize with README/gitignore/license — we'll push them from the `intake-form/` folder.
6. Create.

## 2. Push the intake-form code to the new repo

From a terminal (laptop or `git clone` of this repo in a cloud shell):

```bash
# from the root of revenue-engine (the branch onboarding-rebuild must have been merged or checked out first)
cd intake-form/
git init -b main
git add .
git commit -m "initial scaffold: LeadCatch intake form"
git remote add origin https://github.com/sososo856/leadcatch-intake.git
git push -u origin main
```

## 3. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import `sososo856/leadcatch-intake`.
3. Framework preset: Next.js (auto-detected).
4. Root directory: `./` (the repo is the project).
5. Before clicking Deploy, click **Environment Variables** and add:
   - Name: `MAKE_INTAKE_WEBHOOK_URL`
   - Value: paste Scenario C's Make webhook URL (from `leadcatch_intake`)
   - Environments: Production, Preview, Development
6. Click **Deploy**. You'll get a `leadcatch-intake-xxxxx.vercel.app` URL once it finishes.
7. Test: `https://leadcatch-intake-xxxxx.vercel.app/?stripe_customer_id=cus_TESTDUMMY` — the form should load. Submitting should return a 200.

## 4. Add the custom domain

1. In the Vercel project → **Settings** → **Domains** → **Add**.
2. Domain: `intake.leadcatch.homes`
3. Vercel will show you the exact DNS record to add. It's typically:
   - Type: `CNAME`
   - Name: `intake`
   - Value: `cname.vercel-dns.com`
4. Add that record at your DNS provider (see `docs/DNS_SETUP.md`).
5. Wait for DNS propagation (usually seconds to minutes, sometimes an hour).
6. Vercel auto-issues a TLS cert.

## 5. Smoke test

Visit `https://intake.leadcatch.homes/?stripe_customer_id=cus_TESTDUMMY`:
- Page loads
- Form accepts input
- Submit fires Make Scenario C (check Make's scenario history)

## 6. Paste the final intake URL into Scenario B's email template

In Scenario B module 5 body, the URL is already written as `https://intake.leadcatch.homes/?stripe_customer_id={{1.stripe_customer_id}}` — just verify it matches the domain you set up.

## 7. Update STATE.md

Fill in the "Deployed URLs" section with:
- Intake form URL: `https://intake.leadcatch.homes`
- GitHub repo: `https://github.com/sososo856/leadcatch-intake`
