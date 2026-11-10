import assert from 'node:assert/strict';
import test from 'node:test';
import { generateProductSchema } from '../../src/lib/seo';

const product = {
  name: 'Projector', brand: 'Reach', description: 'Test product', image: '/projector.jpg',
  price: 100, currency: 'USD', sku: 'RP-1', category: 'Projectors', availability: 'in_stock' as const,
};

test('omits review markup when no verified customer reviews are provided', () => {
  const schema = generateProductSchema(product);
  assert.equal('review' in schema, false);
  assert.equal('aggregateRating' in schema, false);
  assert.equal(schema.offers.priceCurrency, 'USD');
  assert.equal(schema.offers.availability, 'https://schema.org/InStock');
  assert.equal(schema.brand.name, 'Reach');
  assert.equal(schema.sku, 'RP-1');
});

test('includes review markup only when review data is provided', () => {
  const schema = generateProductSchema({
    ...product,
    reviews: [{ author: 'Verified customer', datePublished: '2026-11-01', reviewBody: 'Works as described.', rating: 5 }],
  });
  assert.equal(schema.review.length, 1);
  assert.equal(schema.review[0].reviewRating.ratingValue, 5);
});
