# API Reference

ImpactMojo exposes a small set of endpoints for authentication, token minting, and premium resource access.

**Base URL:** `https://www.impactmojo.in/.netlify/functions` (Netlify Functions)
**Supabase URL:** `https://<project>.supabase.co/functions/v1` (Edge Functions)

---

## Endpoints

### Authentication

ImpactMojo uses Supabase Auth. See the [Supabase Auth API docs](https://supabase.com/docs/reference/javascript/auth-signup) for signup, login, and session management.

### mint-resource-token

**`POST`** `/functions/v1/mint-resource-token`

Generates a short-lived JWT for accessing premium tools.

**Headers:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "resource_id": "rq-builder"
}
```

**Success response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "url": "https://rq-builder.impactmojo.in/?token=eyJhbGciOiJIUzI1NiIs..."
}
```

**Error response (403):**
```json
{
  "error": "Your subscription tier does not include this resource"
}
```

**Token claims:**
| Claim | Description |
|-------|-------------|
| `sub` | User ID (UUID) |
| `resource` | Resource name (e.g., `rq-builder`) |
| `tier` | User's subscription tier |
| `exp` | Expiration (5 minutes from issue) |

---

### auth-gate (Edge Function)

**Runs on each premium tool site.** Not called directly — intercepts all requests to the tool.

**Validation flow:**
1. Check existing `resource_session` cookie
2. If no cookie, verify `?token=` query parameter JWT signature
3. Confirm resource claim matches site's `RESOURCE_NAME` environment variable
4. Set 24-hour `resource_session` cookie on success
5. Redirect unauthenticated users to login

---

## Resource IDs

| Resource ID | Tool | Minimum Tier |
|------------|------|-------------|
| `rq-builder` | Research Question Builder Pro | Practitioner |
| `code-convert` | Statistical Code Converter Pro | Professional |
| `qual-insights` | Qualitative Insights Lab Pro | Professional |
| `vaniscribe` | VaniScribe AI Transcription | Professional |
| `devdata` | DevData Practice | Professional |
| `viz-cookbook` | Viz Cookbook | Professional |
| `devecon-toolkit` | DevEconomics Toolkit | Professional |

---

## Database Schema

### Profiles Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (matches Supabase auth user ID) |
| `email` | text | User email |
| `full_name` | text | Display name |
| `subscription_tier` | enum | `explorer`, `practitioner`, `professional`, `organization` |
| `subscription_status` | enum | `active`, `expired`, `cancelled` |
| `organization_id` | UUID | Foreign key to organizations table (nullable) |

### Organizations Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | text | Organisation name |
| `admin_id` | UUID | Foreign key to profiles |
| `max_seats` | integer | Maximum team members |

**Row-Level Security:** All tables enforce RLS. Users can only view and modify their own records.

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Supabase Auth | 30 requests/minute per IP |
| mint-resource-token | Supabase Edge Function limits (500K invocations/month free) |
| Premium tool access | No limit once authenticated (24-hour session) |

---

## Example: Full Access Flow

```bash
# 1. Login via Supabase
curl -X POST https://<project>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Mint a resource token
curl -X POST https://<project>.supabase.co/functions/v1/mint-resource-token \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"resource_id": "rq-builder"}'

# 3. User is redirected to tool URL with token parameter
# The auth-gate Edge Function validates and sets a session cookie
```
