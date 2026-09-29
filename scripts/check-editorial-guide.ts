import assert from 'node:assert/strict'
import { buyingGuides, getBuyingGuide } from '../src/lib/guides'

const slug = 'projector-distance-for-100-inch-screen'
const draft = buyingGuides.find((guide) => guide.slug === slug)
assert.ok(draft, 'Priority guide must exist in the public collection')
assert.equal(getBuyingGuide(slug), draft, 'Published guide must resolve through public lookup')
assert.ok(buyingGuides.some((guide) => guide.slug === slug), 'Published guide must be in the list used by routes and sitemap')
assert.equal(new Set(buyingGuides.map((guide) => guide.slug)).size, buyingGuides.length, 'Guide slugs must be unique')
assert.equal(draft.cta.href, '/contact')
assert.ok(draft.sections.some((section) => section.paragraphs?.some((paragraph) => paragraph.includes('multi-room project'))), 'Keep the business procurement path')

const width = 100 * 0.0254 * 16 / Math.sqrt(337)
const examples = [[0.5, '1.11', '3.63'], [1, '2.21', '7.26'], [1.2, '2.66', '8.72'], [1.5, '3.32', '10.89'], [2, '4.43', '14.53']] as const
const copy = JSON.stringify(draft)
for (const [ratio, metres, feet] of examples) {
  assert.equal((width * ratio).toFixed(2), metres)
  assert.equal((width * ratio / 0.3048).toFixed(2), feet)
  assert.ok(copy.includes(`${metres} metres (${feet} feet)`))
}
console.log('Editorial checks passed: published lookup, unique slugs, business CTA and distance calculations.')

