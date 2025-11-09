/**
 * Image Cache - Cache images from API URLs in localStorage
 * ✅ ENHANCED: Better error handling, size limits, cleanup
 */

interface ImageCacheEntry {
  dataUrl: string;
  timestamp: number;
  expiresAt: number;
  size: number;
}

const CACHE_PREFIX = 'img_cache_';
const DEFAULT_TTL = 100000; // 15 minutes 900000
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB max total cache size
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB max per image

// ✅ ENHANCED: Type-safe retrieval
export const getCachedImage = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  try {
    const cacheKey = CACHE_PREFIX + btoa(url).substring(0, 50);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const entry: ImageCacheEntry = JSON.parse(cached);
    const now = Date.now();
    
    if (now > entry.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return entry.dataUrl;
  } catch (error) {
    console.warn('Failed to get cached image:', error);
    return null;
  }
};

// ✅ ENHANCED: Size-aware caching
export const setCachedImage = (
  url: string, 
  dataUrl: string, 
  ttl: number = DEFAULT_TTL
): boolean => {
  if (!url || !dataUrl) return false;
  
  try {
    const size = dataUrl.length;
    
    // Check if image is too large
    if (size > MAX_IMAGE_SIZE) {
      console.warn(`Image too large to cache: ${(size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }
    
    // Check total cache size and cleanup if needed
    const totalSize = getImageCacheSize();
    if (totalSize + size > MAX_CACHE_SIZE) {
      clearOldestImages(size);
    }
    
    const cacheKey = CACHE_PREFIX + btoa(url).substring(0, 50);
    const now = Date.now();
    
    const entry: ImageCacheEntry = {
      dataUrl,
      timestamp: now,
      expiresAt: now + ttl,
      size,
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(entry));
    return true;
  } catch (error) {
    console.warn('Failed to cache image:', error);
    return false;
  }
};

// ✅ ENHANCED: Better error handling and fallback
export const fetchAndCacheImage = async (url: string): Promise<string> => {
  const cached = getCachedImage(url);
  if (cached) return cached;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Check blob size before converting
    if (blob.size > MAX_IMAGE_SIZE) {
      console.warn('Image too large to cache, returning original URL');
      return url;
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCachedImage(url, dataUrl);
        resolve(dataUrl);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read image blob'));
      };
      
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to fetch and cache image:', error);
    return url; // Fallback to original URL
  }
};

export const clearImageCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    let removed = 0;
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
        removed++;
      }
    });
    
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🗑️ Image cache cleared: ${removed} images removed`);
    }
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
};

// ✅ ENHANCED: Detailed size calculation
export const getImageCacheSize = (): number => {
  try {
    let size = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          size += item.length;
        }
      }
    });
    
    return size;
  } catch (error) {
    console.error('Failed to calculate cache size:', error);
    return 0;
  }
};

// ✅ ADDED: Clear oldest images to make space
const clearOldestImages = (requiredSpace: number): void => {
  try {
    const keys = Object.keys(localStorage);
    const entries: Array<{ key: string; entry: ImageCacheEntry }> = [];
    
    // Get all cache entries with timestamps
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const entry: ImageCacheEntry = JSON.parse(item);
            entries.push({ key, entry });
          } catch {}
        }
      }
    });
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a.entry.timestamp - b.entry.timestamp);
    
    // Remove oldest until we have enough space
    let freedSpace = 0;
    for (const { key, entry } of entries) {
      if (freedSpace >= requiredSpace) break;
      localStorage.removeItem(key);
      freedSpace += entry.size;
    }
    
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🧹 Cleared ${entries.length} old images to free ${(freedSpace / 1024).toFixed(2)}KB`);
    }
  } catch (error) {
    console.error('Failed to clear old images:', error);
  }
};

// ✅ ADDED: Cleanup expired images
export const cleanupExpiredImages = (): number => {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    let removed = 0;
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const entry: ImageCacheEntry = JSON.parse(item);
            if (now > entry.expiresAt) {
              localStorage.removeItem(key);
              removed++;
            }
          } catch {
            // Invalid entry, remove it
            localStorage.removeItem(key);
            removed++;
          }
        }
      }
    });
    
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true' && removed > 0) {
      console.log(`🧹 Cleaned up ${removed} expired images`);
    }
    
    return removed;
  } catch (error) {
    console.error('Failed to cleanup expired images:', error);
    return 0;
  }
};

// ✅ ENHANCED: React hook with loading state
export const useImageCache = (url: string | null | undefined): string => {
  if (!url) return '';
  
  const cached = getCachedImage(url);
  if (cached) return cached;
  
  // Trigger async fetch (don't await)
  fetchAndCacheImage(url).catch(err => {
    console.error('Image cache fetch failed:', err);
  });
  
  return url; // Return original URL while loading
};

// ✅ ADDED: Cache statistics
export const getImageCacheStats = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
  const totalSize = getImageCacheSize();
  const now = Date.now();
  
  let expired = 0;
  keys.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        const entry: ImageCacheEntry = JSON.parse(item);
        if (now > entry.expiresAt) expired++;
      } catch {}
    }
  });
  
  return {
    totalImages: keys.length,
    activeImages: keys.length - expired,
    expiredImages: expired,
    totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    maxSize: MAX_CACHE_SIZE,
    maxSizeMB: (MAX_CACHE_SIZE / 1024 / 1024).toFixed(2),
    usagePercent: ((totalSize / MAX_CACHE_SIZE) * 100).toFixed(1),
  };
};

// ✅ ADDED: Auto cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cleanupExpiredImages();
  }, 600000); // 10 minutes
}




