const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

interface AttemptRecord {
  failures: number;
  resetAt: number;
}

const globalStore = globalThis as typeof globalThis & {
  __adminLoginAttempts?: Map<string, AttemptRecord>;
};

const attempts = globalStore.__adminLoginAttempts ?? new Map<string, AttemptRecord>();
globalStore.__adminLoginAttempts = attempts;

function currentRecord(key: string): AttemptRecord {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt <= now) {
    const fresh = { failures: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, fresh);
    return fresh;
  }
  return record;
}

export function isLoginBlocked(key: string): { blocked: boolean; retryAfterSeconds: number } {
  const record = currentRecord(key);
  return {
    blocked: record.failures >= MAX_FAILURES,
    retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - Date.now()) / 1000)),
  };
}

export function recordLoginFailure(key: string): void {
  const record = currentRecord(key);
  record.failures += 1;
}

export function clearLoginFailures(key: string): void {
  attempts.delete(key);
}
