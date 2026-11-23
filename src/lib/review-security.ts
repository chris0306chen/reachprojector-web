const windowMs = 10 * 60 * 1000
const maxRequestsPerWindow = 8
const attempts = new Map<string, { startedAt: number; count: number }>()

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

export function allowReviewSubmission(key: string): boolean {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || now - current.startedAt >= windowMs) {
    attempts.set(key, { startedAt: now, count: 1 })
    return true
  }
  if (current.count >= maxRequestsPerWindow) return false
  current.count += 1
  return true
}
