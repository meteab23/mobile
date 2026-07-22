type CacheEntry<T> = { data: T; expires: number };

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60_000;

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs = CACHE_TTL_MS): void {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

export function parsePolygonError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    if (typeof e.error === "string") return e.error;
    if (typeof e.message === "string") return e.message;
  }
  return "Polygon API request failed";
}

export async function withPolygonFallback<T>(
  fn: () => Promise<T>,
  fallback: T,
  cacheKey?: string
): Promise<T> {
  if (cacheKey) {
    const cached = getCached<T>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await fn();
    if (cacheKey) setCache(cacheKey, data);
    return data;
  } catch (err) {
    if (cacheKey) {
      const stale = cache.get(cacheKey);
      if (stale) return stale.data as T;
    }
    console.warn("Polygon fallback:", parsePolygonError(err));
    return fallback;
  }
}
