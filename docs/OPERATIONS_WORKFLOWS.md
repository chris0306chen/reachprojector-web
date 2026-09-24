# Reach Projector operating workflows

This file is the hand-off map for recurring store operations. Each workflow has one owner, one source of truth, and one release gate.

| Workflow | Source of truth | Cadence | Release gate | Current tool |
| --- | --- | --- | --- | --- |
| Product publishing | Reach admin + Supabase | Per SKU | Draft review, images, regional version, sale mode | Existing admin |
| Product-page quality | Product detail template | With every SKU | Mobile/desktop review and smoke test | Playwright |
| SEO and buying guides | Next.js content | Weekly | Verified claims, metadata, internal links | Existing site + Lighthouse CI |
| Social publishing | `content/social` | Weekly | Human approval before public posting | Meta Business Suite + manual LinkedIn/YouTube |
| B2B inquiries | Reach admin inquiries | Daily | Lead owner and next follow-up date | Existing admin; evaluate Twenty later |
| Shipping and orders | Supabase shipping tables | When rates change | DDP/DAP boundary tests and checkout verification | Existing admin |
| Technical monitoring | GitHub Actions | Daily and after `main` pushes | Storefront smoke test and SEO threshold | Playwright + Lighthouse CI |

## Product publication checklist

1. Confirm SKU, model name, brand and category.
2. Classify the product as retail, retail-and-bulk, or quote-only.
3. Record only verified specifications and group them by display, optical, system, connectivity, power, dimensions and package.
4. Record market version, languages, streaming path, plug/voltage, warranty territory and duty terms.
5. Upload up to eight main images, two real product photos, twenty detail images and twelve logistics images.
6. Check image order, alternative text and duplicate images.
7. Review price, stock, package weight and shipping eligibility.
8. Save as a draft, review the public preview on desktop and mobile, then publish.

## Tool adoption order

1. Playwright and Lighthouse CI: active in this repository.
2. PostHog Cloud: add after a project key is available; track only the agreed conversion events.
3. Twenty CRM: pilot separately only if the existing inquiry workflow cannot cover ownership, pipeline and reminders.
4. Postiz: deploy only when four or more channels or several posts per week make manual publishing inefficient.
5. n8n: connect stable workflows last; do not automate an unsettled process.
