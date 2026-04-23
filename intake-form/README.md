# leadcatch-intake

Next.js 14 intake form for LeadCatch AI onboarding. Deploys to Vercel at `intake.leadcatch.homes`.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Server-side API route that proxies submissions to Make.com Scenario C

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local with your Make Scenario C webhook URL
npm run dev
```

Visit `http://localhost:3000/?stripe_customer_id=cus_test123` to test.

## Environment variables

| Name | Required | Description |
|------|----------|-------------|
| `MAKE_INTAKE_WEBHOOK_URL` | yes | Custom webhook URL for Make.com Scenario C (`leadcatch_intake`). Set in Vercel dashboard. |

## Deployment

1. Import this repo into Vercel.
2. Set `MAKE_INTAKE_WEBHOOK_URL` in Vercel project → Settings → Environment Variables.
3. Add custom domain `intake.leadcatch.homes` in Vercel project → Settings → Domains.
4. Vercel will surface the exact CNAME to set at your DNS provider (typically `cname.vercel-dns.com`).
5. Deploy.

## Form contract

Submissions POST this JSON shape to `MAKE_INTAKE_WEBHOOK_URL`:

```json
{
  "stripe_customer_id": "cus_...",
  "business_name": "Acme Roofing",
  "phone": "+15551234567",
  "hours": "Mon-Fri 8am-6pm",
  "service_area": "Austin, TX metro",
  "state": "TX",
  "zip": "78701",
  "services": "...",
  "calendar_preference": "Google Calendar",
  "calendar_email": "owner@acme.com",
  "timezone": "America/Chicago",
  "decline_types": "..."
}
```

Anything that's not a valid stripe customer id (missing, empty, or not starting with `cus_`) shows the "invalid link" screen and does not submit.
