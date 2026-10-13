export function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // crypto.randomUUID only exists on secure pages (https or localhost).
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}
