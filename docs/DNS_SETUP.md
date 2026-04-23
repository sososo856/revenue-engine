# DNS — `intake.leadcatch.homes`

Vercel requires one CNAME record pointing your subdomain at its edge.

## Exact record to add

| Field | Value |
|-------|-------|
| Type | `CNAME` |
| Name / Host | `intake` |
| Value / Target / Points to | `cname.vercel-dns.com` |
| TTL | Default (auto, 3600s, whatever your provider shows) |
| Proxy / Cloud status | If Cloudflare, set to **DNS only** (grey cloud). Orange cloud breaks Vercel's cert issuance. |

The final FQDN will resolve to `intake.leadcatch.homes`.

## Verification

```bash
dig intake.leadcatch.homes CNAME +short
# expected: cname.vercel-dns.com.
```

Or use https://dnschecker.org with hostname `intake.leadcatch.homes`, record type `CNAME`.

## Common gotchas

- **Cloudflare proxy on:** Vercel cert issuance stalls. Set to DNS only.
- **Apex vs subdomain:** `intake.leadcatch.homes` is a subdomain, so CNAME works. Don't try to point the apex `leadcatch.homes` to Vercel this way — use an ALIAS / ANAME / Vercel's own apex record there.
- **Propagation:** Usually fast (<1m) on modern registrars. If after 15 min Vercel still shows "DNS not configured", recheck the record in your DNS provider and verify no stale record exists (old A, AAAA, or CNAME at `intake`).

## If you're using a registrar that doesn't support CNAME flattening at apex

Not applicable here — `intake` is a subdomain, so CNAME works everywhere.
