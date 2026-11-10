# Editorial record — not published

Integration note (2026-09-28): the edited implementation is in `src/lib/guides.ts` → `draftBuyingGuides`, using the existing `BuyingGuide` type. This Markdown remains the research draft. The typed version removes repetitive FAQ, converts the distance table to a checklist and adds multi-room project requirements to the contact path. It is excluded from public lookup, listings and sitemap. BenQ and Epson web sources were rechecked on this date; no product test was performed.

- Status: ready for factual/editorial review; no human approval recorded.
- Prepared: 2026-09-24. Audience: home buyers. Type: Buying Guide.
- Primary query: projector distance for 100 inch screen.
- Proposed URL: `/en/guides/projector-distance-for-100-inch-screen`.
- SEO title: Projector Distance for a 100-Inch Screen | Reach Projector
- Meta description: Calculate projector distance for a 100-inch screen, compare example throw ratios, and check the room measurements you need before buying.
- Source method: manufacturer guidance plus original geometry calculations; no hands-on testing or product recommendation.

---

# How Far Should a Projector Be from a 100-Inch Screen?

A 100-inch 16:9 image is approximately 2.214 metres (87.2 inches) wide. Multiply that width by your projector's throw ratio to estimate the required throw distance. For example, a 1.2:1 ratio gives approximately 2.66 metres (8.72 feet). Confirm the final position with the exact model's installation instructions before buying or mounting it.

## Start with image width, not diagonal

Screen sizes usually describe the diagonal. Throw-ratio calculations use the image width. [BenQ defines throw ratio as throw distance divided by image width](https://www.benq.com/en-me/knowledge-center/knowledge/projector-installation-calculator.html).

For a 16:9 image, you can calculate the dimensions yourself:

- Width = diagonal × 16 ÷ √337.
- Height = diagonal × 9 ÷ √337.

A 100-inch diagonal therefore gives an image about 87.2 inches wide and 49.0 inches high: approximately 221.4 × 124.5 cm. These are calculated image dimensions, not the outside dimensions of a screen frame. Use the screen manufacturer's drawing when checking wall space.

If your image uses a different aspect ratio, recalculate its width. A 100-inch diagonal alone is not enough information to determine throw distance.

## Example distances for a 100-inch 16:9 image

Distance = image width × throw ratio.

| Example throw ratio | Calculated distance in metres | Calculated distance in feet |
|---|---:|---:|
| 0.5:1 | 1.11 | 3.63 |
| 1.0:1 | 2.21 | 7.26 |
| 1.2:1 | 2.66 | 8.72 |
| 1.5:1 | 3.32 | 10.89 |
| 2.0:1 | 4.43 | 14.53 |

These are rounded calculations using hypothetical ratios, not tested mounting positions or promises that a particular projector supports this image size. Use the actual model's supported screen sizes, lens specification and installation drawing for the final decision.

## Measure the available projection distance

For conventional front-lens projectors, check the lens-to-screen distance described in the manual. Room depth and the gap between the rear wall and screen are not automatically usable throw distance: the projector body, connections and required ventilation occupy space too. [BenQ's installation manual illustrates lens-to-screen geometry and the effect of zoom settings](https://esupportdownload.benq.com/esupport/PROJECTOR/UserManual/LU9750/LU9750_UM_EN_211108155601.pdf).

Imagine your planned lens position is 3.00 metres from the image surface. For a 100-inch 16:9 image, the required ratio is approximately 3.00 ÷ 2.214 = 1.36:1. This gives you a specification to check against candidate models. It does not establish that a model meets your brightness, resolution or installation requirements.

Keep a simple room note with the intended image width and height, possible lens position, available mounting space and typical viewing light. Our [room-first buying guide](/en/guides/how-to-choose-a-projector-for-your-room) covers the wider selection process.

## Use the exact model calculator before fixing the mount

Where a projector offers an optical zoom range, confirm the position against the documented range for the intended image size. [Epson's positioning guidance](https://epson.com/projector-guide-how-to-buy-a-projector-throw-distance-and-positioning) and the [BenQ projection calculator](https://projectorcalculator.benq.com/) are starting points for their respective products.

Record the selected model, lens where applicable, image size, aspect ratio and resulting distance. Do not transfer a distance from a similarly named model without checking it. Before permanent installation, verify the image position with the actual unit and its manual.

## What changes with an ultra-short-throw projector?

For an ultra-short-throw installation, use the manufacturer's placement drawing to establish cabinet and screen positions. Do not treat a calculated optical throw distance as the gap from the back of the projector to the wall. The dimensions needed for furniture planning must come from the exact model's drawing.

Use our [UST cabinet and placement checklist](/en/guides/ust-projector-cabinet-placement-checklist) to record cabinet depth, screen height and the surrounding equipment before selecting furniture.

## Questions to settle before ordering

- Is the target image definitely 100 inches at 16:9?
- Does the exact model support that image size at the available position?
- Have you allowed for the screen frame and the projector's documented installation clearances?
- Does the installation drawing match your shelf, ceiling mount or cabinet plan?
- Have you separately checked image brightness, source compatibility and regional version?

### Is viewing distance the same as throw distance?

No. Viewing distance describes where you sit. Throw distance describes the projector's optical placement relative to the image surface. Record both when planning your room.

### Can every projector make a 100-inch image from the same position?

No. Check the exact model's throw ratio, supported image-size range and installation limits. The calculations above explain the geometry; they do not replace those specifications.

### Should I order the screen first?

Check the screen dimensions and projector placement together before committing to either. Include the frame and mounting arrangement in your room measurements.

**Planning your setup?** [Send your room measurements](/en/contact), target image size and candidate model so the placement requirements can be checked together.

---

## Reviewer evidence and release checks — internal only

Sources checked through official search results or page access on 2026-09-24. No manufacturer model has been selected or tested.

| Claim | Evidence / method | Limitation |
|---|---|---|
| Throw ratio = distance / width | BenQ installation-calculator article linked above | General optical relationship |
| Lens-to-screen distance and zoom affect image size | BenQ LU9750 manual linked above | Example manual; do not reuse model-specific distances |
| Exact model planning needs manufacturer calculator | Epson positioning page; BenQ calculator | Final manual and actual installation govern |
| 100-inch dimensions and table | Original 16:9 geometry; inches × 0.0254; metres / 0.3048 | Rounded; no frame dimensions |
| 3 m example | 3 / (100 × 0.0254 × 16 / √337) ≈ 1.36 | Hypothetical, not product suitability |

Before release: verify all internal and external links in the rendered page; preserve the hypothetical-example labels; obtain editorial approval; confirm table/formula rendering; omit this internal record from public content. Populate author and dates accurately. Keep the existing room guide as the broad pillar and use this page only for distance calculation intent.
