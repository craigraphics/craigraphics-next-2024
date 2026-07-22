# Contact Form Spam Protection

The contact form is protected by two layers, both nearly invisible to real users:

1. **Honeypot field** — a hidden `company` input real users never see. Bots auto-fill it; the server silently drops those submissions (returns a success-looking `200` so bots don't learn they were caught). Zero third-party script, zero user friction.
2. **Cloudflare Turnstile** (managed mode) — a lightweight, privacy-friendly captcha that auto-resolves in the background for real users. Verified server-side so it can't be bypassed by POSTing directly to the API. Free at unlimited volume.

## Where it lives

- Client widget + honeypot: `components/Contact.tsx`
- Server-side honeypot check + Turnstile verification + input validation: `app/api/send-email/route.ts`

## Setup

### 1. Create a free Turnstile site

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Turnstile**.
2. Add a widget. Set **Widget Mode** to **Managed** (least intrusive).
3. Add your domains: `craigraphics.com`, plus `localhost` and `127.0.0.1` for local dev.
4. Copy the generated **Site Key** (public) and **Secret Key** (private).

### 2. Set environment variables

Add to `.env.local` (local) and your Vercel project env (production):

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...your_site_key
TURNSTILE_SECRET_KEY=0x...your_secret_key
```

| Variable                          | Visibility | Used by                          |
| --------------------------------- | ---------- | -------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`  | Public     | Client widget in `Contact.tsx`   |
| `TURNSTILE_SECRET_KEY`            | Private    | Server verification in the route |

### 3. Local development / testing

Cloudflare provides official test keys that don't require a registered domain. `.env.local` ships with the **always-pass** pair by default:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Other useful test keys:

- **Always blocks:** site `2x00000000000000000000AB`, secret `2x0000000000000000000000000000000AA`
- **Forces interactive challenge:** site `3x00000000000000000000FF`

Replace with real keys before production.

## Behaviour notes

- If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, the widget doesn't render and the submit button stays enabled — but the server still requires a valid token, so submissions fail with `400`. Always set both keys.
- The Turnstile token is single-use; the form resets the widget after each submit (success or error) so users can retry.
- The server returns `400 Captcha verification failed` on a missing/invalid token, and `400 Email and message are required` on empty input.
