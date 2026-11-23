import assert from 'node:assert/strict'
import test from 'node:test'
import { createReviewInvitationToken, hashReviewInvitationToken } from '../../src/lib/reviews'
import { allowReviewSubmission } from '../../src/lib/review-security'

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
