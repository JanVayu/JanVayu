# Environment Variables

ImpactMojo uses environment variables for Supabase credentials, JWT signing, and email delivery.

---

## Main Site

The main site (impactmojo.in) is fully static and requires **no server-side environment variables**. Supabase client credentials are embedded in the frontend JavaScript (these are public anon keys, not secrets).

---

## Supabase Edge Functions

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `JWT_SECRET` | Yes | HMAC-SHA256 secret for signing resource tokens |

---

## Premium Tool Sites (Netlify Edge Functions)

Each premium tool site needs:

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Must match the secret used by `mint-resource-token` |
| `RESOURCE_NAME` | Yes | Identifier for this tool (e.g., `rq-builder`, `qual-lab`) |

---

## Email Notifications (Resend)

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com) |
| `RESEND_FROM` | Yes | Verified sender email address |

**Example:** `hello@impactmojo.in`

---

## Example `.env` File

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT Token Signing
JWT_SECRET=your-256-bit-secret

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM=hello@impactmojo.in
```

---

## Security Notes

- **Never commit `.env` files** — they are in `.gitignore`
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — use only in server-side functions
- `JWT_SECRET` must be identical across the token minting function and all tool auth gates
- `SUPABASE_ANON_KEY` is safe to expose client-side (enforces RLS)
