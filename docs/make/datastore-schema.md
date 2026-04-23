# Datastore 90246 — Client Record Schema

Primary key: `stripe_customer_id` (raw, e.g. `cus_NffrFeUfNV2Hib`).

| Field | Type | Set by | Stage |
|-------|------|--------|-------|
| `stripe_customer_id` | string | Scenario A | paid |
| `email` | string | Scenario A | paid |
| `name` | string | Scenario A | paid |
| `amount` | number | Scenario A | paid |
| `onboarding_status` | enum | all | paid / awaiting_oauth / awaiting_intake / provisioning / active / failed_* |
| `created_at` | datetime | Scenario A | paid |
| `last_updated` | datetime | all | every update |
| `activated_at` | datetime | Scenario C | active |
| `oauth_completed` | boolean | Scenario B | awaiting_intake |
| `calendar_email` | string | Scenario B | awaiting_intake |
| `oauth_token` | string | Scenario B | awaiting_intake |
| `oauth_refresh_token` | string | Scenario B | awaiting_intake |
| `business_name` | string | Scenario C | provisioning |
| `phone` | string (E.164) | Scenario C | provisioning |
| `hours` | string | Scenario C | provisioning |
| `service_area` | string | Scenario C | provisioning |
| `state` | string (2-letter) | Scenario C | provisioning |
| `zip` | string (5-digit) | Scenario C | provisioning |
| `services` | string | Scenario C | provisioning |
| `calendar_preference` | enum | Scenario C | provisioning |
| `timezone` | string (IANA) | Scenario C | provisioning |
| `decline_types` | string | Scenario C | provisioning |
| `ai_greeting` | string | Scenario C | provisioning |
| `twilio_number` | string (E.164) | Twilio Provisioner (4719941) | provisioning -> active |
| `twilio_number_sid` | string | Twilio Provisioner | provisioning -> active |
| `twilio_number_status` | enum | Twilio Provisioner | `provisioned` |
| `twilio_provisioned_at` | datetime | Twilio Provisioner | provisioning -> active |
| `twilio_messaging_service_sid` | string | Twilio Provisioner | provisioning -> active |
| `a2p_registered` | boolean | Twilio Provisioner | provisioning -> active |
| `last_error` | string | any error branch | on failure |
| `last_error_stage` | string | any error branch | on failure |

## State machine

```
paid (A.3)
  -> awaiting_oauth (A.5)
    -> awaiting_intake (B.3)
      -> provisioning (C.5)
        -> active (C.11)
          \-> failed_stripe_handler | failed_oauth_handler | failed_intake_handler
              | failed_twilio_provisioning | failed_sms_send | failed_activation
```

Status transitions only go forward or to a `failed_*` terminal. A `failed_*` record requires manual intervention (see `../FAILURE_RECOVERY.md`).
