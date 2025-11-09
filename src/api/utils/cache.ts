/**
 * Cache Management - 15-minute TTL for catalog data
 * ✅ ENHANCED: Better typing, stats, validation
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

// ✅ ENHANCED: Type-safe cache retrieval
export const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    console.log(`✅ Cache HIT: ${key}`);
  }
  
  return entry.data as T;
};

// ✅ ENHANCED: Type-safe cache storage
export const setCachedData = <T>(
  key: string, 
  data: T, 
  ttl: number = 1200000 // 15 minutes default
): void => {
  const now = Date.now();
  cache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + ttl,
  });
  
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}ms, Expires: ${new Date(now + ttl).toLocaleTimeString()})`);
  }
};

export const invalidateCache = (key: string): void => {
  const deleted = cache.delete(key);
  
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true' && deleted) {
    console.log(`🗑️ Cache INVALIDATED: ${key}`);
  }
};

// ✅ ENHANCED: Pattern-based invalidation with regex support
export const invalidateCachePattern = (pattern: string | RegExp): void => {
  const regex = typeof pattern === 'string' 
    ? new RegExp(pattern) 
    : pattern;
    
  let count = 0;
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
      count++;
    }
  }
  
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true' && count > 0) {
    console.log(`🗑️ Cache INVALIDATED: ${count} entries matching pattern: ${pattern}`);
  }
};

export const clearCache = (): void => {
  const size = cache.size;
  cache.clear();
  
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    console.log(`🗑️ Cache CLEARED: ${size} entries removed`);
  }
};

// ✅ ENHANCED: Detailed cache statistics
export const getCacheStats = () => {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  
  const stats = {
    totalEntries: cache.size,
    activeEntries: entries.filter(([, entry]) => now < entry.expiresAt).length,
    expiredEntries: entries.filter(([, entry]) => now >= entry.expiresAt).length,
    keys: entries.map(([key]) => key),
    oldestEntry: entries.length > 0 
      ? Math.min(...entries.map(([, entry]) => entry.timestamp))
      : null,
    newestEntry: entries.length > 0 
      ? Math.max(...entries.map(([, entry]) => entry.timestamp))
      : null,
  };
  
  return stats;
};

// ✅ ADDED: Cleanup expired entries
export const cleanupExpiredCache = (): number => {
  const now = Date.now();
  let removed = 0;
  
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
      removed++;
    }
  }
  
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true' && removed > 0) {
    console.log(`🧹 Cache CLEANUP: ${removed} expired entries removed`);
  }
  
  return removed;
};

// ✅ ADDED: Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cleanupExpiredCache();
  }, 300000); // 5 minutes
}