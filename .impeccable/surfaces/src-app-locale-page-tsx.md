---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: []
---

# Homepage Surface Brief

## Scope and authority

This is a **Persuade** surface and an established-world refinement, not a rebrand. The root `DESIGN.md` remains the authority for REACH PROJECTOR's global visual system; this brief records only durable homepage decisions evidenced by the shipped implementation.

## Direction contract

- **THESIS:** A global projector showroom with a clear retail and business split, refusing the generic centered electronics hero.
- **OWN-WORLD:** Deep slate viewing-room surfaces, warm projection orange, precise lines, and quiet white product plinths.
- **STORY:** Choose a route, see real product categories and applications, then shop or start a qualified business conversation.
- **FIRST VIEWPORT:** A left-aligned value proposition and paired retail/business actions sit beside a full-height projection-room image and compact route rail.
- **FORM:** An asymmetric showroom composition with restrained motion, built as an extension of the incumbent identity.

## Durable composition

- The first viewport separates retail browsing from OEM/business inquiry immediately. Preserve one clear action for each journey in both the main CTA pair and the compact route rail.
- The hero is image-led and asymmetric: text occupies the left side while the scene extends through the right side on wide screens. On smaller screens, the image becomes a full-bleed backdrop and the content remains legible through a deep-slate overlay.
- The page progresses from category orientation to products, real-world solutions, service capability, partnership reasons, supporting application and delivery content, and a final business CTA. Preserve this funnel when refining individual sections.
- Use verified project and scenario imagery as the primary content material. Category and solution groups use image-backed tiles with bottom-anchored copy, not generic icon-card grids.
- Alternate quiet white and slate-50 product-plinth sections with a deep-slate solutions band. Reserve the full orange field for the final business conversion moment.

## Layout and hierarchy

- Content uses a centered `max-w-7xl` frame with responsive horizontal padding of 1rem, 1.5rem, and 2rem.
- Major sections use generous vertical rhythm: 5rem on compact layouts and 7rem on large screens. Section introductions stay left-aligned with restrained line lengths (approximately 54-65 characters).
- Display hierarchy is strong but compact: the hero reaches 4.5rem on large screens with a near-solid line height and tight tracking; section headings top out at 2.25rem.
- Category tiles form an alternating 7/5-column showroom mosaic on large screens and collapse to two columns, then one. Solution tiles use one tall anchor image with three shorter supporting images.
- Business-detail sections use asymmetric two-column relationships rather than equal card grids. The partnership rationale is presented as a ruled list for scanability.

## Components and interaction

- Primary actions are orange on dark surfaces; secondary business actions in the hero use a translucent deep-slate surface with a visible light border. Dark buttons are used on pale or orange surfaces.
- Buttons share a 3rem minimum height, gently curved corners, semibold labels, and an active one-pixel downward response.
- Image tiles use gently curved 0.75rem corners, deep bottom gradients, restrained 4% image zoom on hover, and orange link accents. Keep overlays functional for contrast rather than decorative.
- Inline navigation links use orange with an offset underline. Arrow icons move horizontally on hover to reinforce direction.
- Keyboard focus remains explicit with two-pixel outlines and visible offsets; inset outlines are used only where the route rail cannot accept an external ring.
- Motion stays quiet and state-driven. Image zoom uses a slow 700ms ease-out; ordinary controls use short transitions. Reduced-motion preferences collapse transitions and animations to effectively instantaneous behavior.

## Responsive behavior

- At phone widths, CTA pairs stack, mosaics become a single column, and all essential copy and actions remain in source order.
- At medium widths, image mosaics may use two columns and paired actions may sit inline.
- At large widths, the hero becomes a two-part asymmetric composition, category and solution mosaics gain their uneven spans, and text/media capability sections become offset columns.
- Decorative image overlap in the content-studio section remains secondary to the copy and must not obscure or reorder the inquiry action.

## Guardrails

- Do preserve visibly distinct retail and business paths without splitting them into separate visual brands.
- Do use orange sparingly for conversion, directional cues, and focus; deep slate and neutral plinths carry most of the page.
- Do keep real products, applications, and service evidence ahead of decorative technology effects.
- Don't turn the homepage into a centered SaaS hero followed by repetitive equal-sized cards.
- Don't introduce unverified certification, factory, customer, volume, logistics, or performance claims through visual copy.
- Don't broaden these homepage composition rules into global system rules; sibling surfaces continue to follow `DESIGN.md` and their own task needs.
