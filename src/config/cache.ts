const cache = new Map<string, { value: string; expiry: number }>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  // Refresh TTL on access
  entry.expiry = Date.now() + TTL_MS;
  return entry.value;
}

export function setCache(key: string, value: string): void {
  cache.set(key, { value, expiry: Date.now() + TTL_MS });
}

export function deleteCache(key: string): void {
  cache.delete(key);
}
