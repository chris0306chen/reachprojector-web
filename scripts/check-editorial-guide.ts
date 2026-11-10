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
const sampleGuide = getBuyingGuide('projector-sample-acceptance-checklist')
assert.ok(sampleGuide, 'Sample acceptance guide must resolve publicly')
assert.equal(sampleGuide.audience, 'Business buyers')
assert.equal(sampleGuide.updatedAt, '2026-10-10')
assert.equal(sampleGuide.cta.href, '/contact')
assert.ok(JSON.stringify(sampleGuide).includes('no sample was tested'))
assert.ok(sampleGuide.sources.every((source) => source.url.startsWith('https://files.support.epson.com/')))
const regionalGuide = getBuyingGuide('international-projector-regional-version-checklist')
assert.ok(regionalGuide)
assert.equal(regionalGuide.publishedAt, '2026-09-03')
assert.equal(regionalGuide.updatedAt, '2026-10-19')
assert.equal(regionalGuide.cta.href, '/contact')
assert.equal(buyingGuides.filter((guide) => guide.slug === regionalGuide.slug).length, 1)
