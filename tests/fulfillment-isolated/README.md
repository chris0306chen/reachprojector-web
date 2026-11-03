# Isolated fulfillment acceptance

Run from the repository root with Docker Desktop and installed pnpm dependencies:

```powershell
docker compose -p reach-fulfillment-acceptance -f tests/fulfillment-isolated/compose.yml up -d --wait
pnpm test:fulfillment:isolated
docker compose -p reach-fulfillment-acceptance -f tests/fulfillment-isolated/compose.yml down
```

The suite uses fixed loopback ports 55467 (PostgreSQL) and 55468 (PostgREST), a dedicated database with synthetic orders, and temporary in-memory database storage. It never reads application environment files or production credentials. Use only the supplied compose project. The test truncates its synthetic `orders` table between cases. Stopping the stack discards test data.

The actual route handler source, transition helper, Supabase query builder, PostgREST and PostgreSQL execute. A test adapter removes the Supabase gateway path and placeholder Authorization header for standalone PostgREST. HTTP requests are restricted to the fixed loopback origin and redirects are rejected. A read barrier controls when a second database connection commits a refund/payment change or lets two requests race.

The email module is never imported: its function is replaced with an in-memory counter, including all recipient and BCC behavior. Nothing is sent. The test is not an end-to-end verification of Next.js middleware, authentication, production RLS/schema, the Supabase gateway, or email delivery. No real refund or payment provider is called.

## Acceptance matrix — executed 2026-11-02

| Group | Inputs / schedule | Expected / observed |
| --- | --- | --- |
| Full-payment blocking | B2B and B2C; unpaid, partial, refunded; all three endpoints | 409; status and tracking unchanged; no notification calls |
| Paid shipment | B2B and B2C; preparing + paid; all three endpoints | 200; shipped; payment remains paid; notification counters match endpoint behavior |
| Refund/payment race | Commit refund or partial-payment state after handler reads, before handler writes | 409; committed refund/payment state preserved; no tracking write or notification |
| Concurrent duplicates | Two requests read the same row before either writes; all endpoints; generic tracking also covers already-shipped orders with null/existing tracking | Exactly one 200 and one 409; only one notification call for shipment endpoints |
| Sequential duplicates | Submit the same request twice | Generic tracking/status: 200 then 200; dedicated ship: 200 then 409; no additional notification |
| Terminal protection | cancelled, completed, refunded; all three endpoints | 409; terminal status preserved; no notification |

Result: **6/6 database acceptance groups passed**, plus **21/21 unit/route regression groups passed**. The duplicate test first reproduced two successful writes/notification calls for an already-shipped order. Generic tracking updates now also compare the previously read tracking number (`IS NULL` or equality) atomically with status and payment status.

These results satisfy the requested isolated business-flow acceptance matrix. Human PR review and current checks are still required before merge; no merge or production deployment is performed by these commands.
