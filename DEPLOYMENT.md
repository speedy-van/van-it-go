# Deploying VanItGo on Vercel

This guide prepares the project for deployment on [Vercel](https://vercel.com).

## Prerequisites

- Vercel account
- GitHub/GitLab/Bitbucket repo connected (or use Vercel CLI)
- Neon (or other) PostgreSQL database with **connection pooler** recommended for serverless

## 1. Connect the repository

- Push your code to GitHub/GitLab/Bitbucket.
- In [Vercel Dashboard](https://vercel.com/dashboard), **Add New Project** and import your repo.
- Vercel will detect Next.js and use the project’s `vercel.json` and `package.json` scripts.

## 2. Environment variables

In the Vercel project: **Settings → Environment Variables**. Add these for **Production** (and optionally Preview):

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (use pooler URL for Neon/serverless). |
| `NEXTAUTH_URL` | Yes | Full app URL, e.g. `https://your-app.vercel.app`. |
| `NEXTAUTH_SECRET` | Yes | Random secret for session signing (e.g. `openssl rand -base64 32`). |
| `NEXT_PUBLIC_APP_URL` | Yes | Same as `NEXTAUTH_URL` for links and redirects. |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_live_...` or `sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret (`whsec_...`) for production URL. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox public access token. |
| `RESEND_API_KEY` | Yes | Resend API key for transactional email. |
| `EMAIL_FROM` | No | Sender email (defaults to `noreply@vanitgo.com`). |
| `GROQ_API_KEY` | No | Groq API key for AI volume estimation. |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID (if using social login). |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret. |
| `ECOLOGI_API_KEY` | No | Ecologi API key for carbon offset. |
| `NEXT_PUBLIC_BRAND_NAME` | No | Brand name (default: VanItGo). |

**Important:**

- Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your **production URL** (e.g. `https://your-app.vercel.app`) for Production. For Preview deployments you can use `VERCEL_URL` (see below).
- Do **not** commit `.env.local`; ensure `.env.local` and `.env*.local` are in `.gitignore`.

### Using Vercel’s preview URL for Auth (optional)

For Preview deployments, you can set in Vercel:

- **Key:** `NEXTAUTH_URL`  
- **Value:** `https://$VERCEL_URL`  
- **Environment:** Preview  

And similarly use `https://$VERCEL_URL` for `NEXT_PUBLIC_APP_URL` in Preview if your app uses it for redirects.

## 3. Build and migrations

- **Default build:** Vercel runs `next build` (from `package.json`). No migrations run during build.

- **Run migrations** when needed (first deploy and after schema changes), using the same `DATABASE_URL` as in Vercel (e.g. from local `.env.local` or CI):

  ```bash
  npm run db:migrate
  ```

- **Optional — run migrations during deploy:** In Vercel go to **Settings → General → Build & Development Settings** and set **Build Command** to:

  ```bash
  npm run db:migrate
  npm run build
  ```

  (Use two lines or a single line with `;` between commands.) This requires `DATABASE_URL` to be set in Vercel so migrations can run at build time.

## 4. Stripe webhook (production)

1. In [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks), add an endpoint.
2. **URL:** `https://your-app.vercel.app/api/payments/webhook`
3. Select the events your app handles (e.g. `checkout.session.completed`, `payment_intent.succeeded`).
4. Copy the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET` in Vercel (Production).

## 5. Node version

The project targets Node 18+. Vercel’s default is compatible. To pin in the project, add to `package.json`:

```json
"engines": {
  "node": ">=18"
}
```

## 6. Post-deploy checks

- Open `https://your-app.vercel.app` and confirm the app loads.
- Test auth: login, register, password reset.
- Test booking flow and payment (test mode first).
- Confirm emails (Resend) and Stripe webhooks (Dashboard → Webhooks → recent deliveries).

## 7. Region

`vercel.json` sets `"regions": ["lhr1"]` (London) for lower latency in the UK. Change or remove `regions` in `vercel.json` if you want a different edge.

---

**Security reminder:** Keep `.env.local` and all secrets out of the repo. Use only Vercel (and/or CI) environment variables for production and preview.
