# Stripe + Vercel setup

Add these environment variables in Vercel for **Preview** and **Production**. Never commit values to Git.

- `NEXT_PUBLIC_SITE_URL` — production canonical origin, e.g. `https://www.reachprojector.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET` (if PayPal remains enabled)

In Stripe Workbench, add a webhook endpoint:

`https://www.reachprojector.com/api/stripe/webhook`

Subscribe to `checkout.session.completed`. Copy Stripe's generated signing secret into `STRIPE_WEBHOOK_SECRET`.

Before production release, use Stripe test mode to complete one card payment and verify:
1. the user reaches the success page;
2. an order is recorded in Supabase;
3. the Stripe dashboard event reports a successful 2xx webhook delivery.
