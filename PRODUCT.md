# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Retail customers comparing projectors, laser TVs, screens, mounts, and related electronics for home or small-business use.
- Business buyers evaluating bulk supply, global delivery, engineering support, and OEM/ODM cooperation.
- Internal administrators maintaining products, inquiries, orders, shipping templates, and staff access.

## Product Purpose

Reach Projector is a multilingual B2B and B2C commerce site for discovering products, requesting business quotes, and completing retail purchases. Success means helping retail visitors reach a suitable product and checkout while helping business visitors reach a qualified inquiry path.

## Positioning

The site combines an international electronics catalog with projector-focused selection, B2B sourcing, DDP delivery messaging, and engineering or OEM inquiry paths in one storefront.

## Operating Context

- Customers browse categories, product listings, and product details before purchasing or contacting sales.
- Retail checkout supports PayPal and an optionally enabled Stripe flow.
- Business customers use contact, WhatsApp, and wholesale inquiry routes.
- Product, order, inquiry, shipping, and user data are administered through the existing admin application.

## Capabilities and Constraints

- Preserve the existing Next.js App Router, Supabase data access, next-intl localization, Tailwind CSS, and shadcn/Radix component foundation.
- Preserve product identifiers, slugs, prices, quantities, query parameters, API request and response contracts, checkout URLs, payment callbacks, webhooks, order persistence, admin permissions, environment variables, SEO URLs, canonical metadata, sitemap behavior, and analytics identifiers.
- Visual work must be staged in an isolated branch and Vercel preview before production release.
- Payment, product, order, and admin integrations are protected boundaries and may not be changed as a side effect of visual work.
- Existing uncommitted payment and product work in the production checkout is user-owned and must not be overwritten.

## Brand Commitments

- Product name: REACH PROJECTOR.
- Existing identity uses deep slate, white, and orange, with a precise projector-showroom character.
- B2B and B2C journeys must remain visibly distinct while belonging to one brand.
- The interface should build trust and product clarity rather than use generic technology-site effects.

## Evidence on Hand

- Existing product records and category data in Supabase.
- Existing product, category, scenario, shipping, logo, and case-study image files under `public/images`.
- Existing homepage, product, checkout, wholesale, contact, and admin implementations.
- Existing `DESIGN.md` documenting the incumbent visual system.
- Certification, authorization, factory, logistics, warranty, sales-volume, partner-count, and customer claims require verifiable source material before being added or strengthened. AI-generated imagery may not be represented as product, factory, certification, or customer evidence.

## Product Principles

1. Protect transaction integrity before improving presentation.
2. Let verified products and evidence carry the experience.
3. Give retail buying and business inquiry equally clear next steps.
4. Improve through reversible, independently releasable stages.
5. Preserve discoverability, localization, accessibility, and performance during every visual change.

## Accessibility & Inclusion

Maintain keyboard access, visible focus states, readable contrast, reduced-motion behavior, responsive layouts, accurate alternative text, and multilingual content support.
