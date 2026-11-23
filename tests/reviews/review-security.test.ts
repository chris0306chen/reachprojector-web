import assert from 'node:assert/strict'
import test from 'node:test'
import { createReviewInvitationToken, hashReviewInvitationToken } from '../../src/lib/reviews'
import { allowReviewSubmission } from '../../src/lib/review-security'
import { reviewSubmissionSchema } from '../../src/lib/review-validation'

test('invitation tokens are random and only hashes are persisted', () => {
  const first = createReviewInvitationToken()
  const second = createReviewInvitationToken()
  assert.notEqual(first, second)
  assert.equal(hashReviewInvitationToken(first).length, 64)
  assert.notEqual(hashReviewInvitationToken(first), first)
})

test('review submission rate limiter blocks the ninth request in a window', () => {
  const key = `test-${Date.now()}-${Math.random()}`
  for (let index = 0; index < 8; index += 1) assert.equal(allowReviewSubmission(key), true)
  assert.equal(allowReviewSubmission(key), false)
})

test('review validation rejects invalid invitations and ratings', () => {
  const result = reviewSubmissionSchema.safeParse({
    token: 'short', review_type: 'product', product_rating: 6, service_rating: null,
    title: 'x', body: 'too short', display_name: 'A', country: 'U',
  })
  assert.equal(result.success, false)
})

test('company reviews require service rating, not product rating', () => {
  const result = reviewSubmissionSchema.safeParse({
    token: '12345678901234567890', review_type: 'company', product_rating: null, service_rating: null,
    title: 'Service feedback', body: 'A sufficiently detailed customer review.', display_name: 'Customer', country: 'US',
  })
  assert.equal(result.success, false)
})
