// ImageCache.ts

import * as React from 'react';

/**
 * Image Cache Entry Interface
 */
interface ImageCacheEntry {
  dataUrl: string;
  timestamp: number;
  expiresAt: number;
  size: number;
}

const CACHE_PREFIX = 'img_cache_';
// Default TTL is 15 minutes (900,000 milliseconds)
const DEFAULT_TTL = 1200000; 
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB max total cache size
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB max per image

// --- Helper Functions (Internal) ---

/**
 * Generates a unique, collision-resistant cache key for a given URL.
 * Uses Base64 of the URL, truncated to 128 chars for size safety and uniqueness.
 * @param url The image URL.
 */
const generateCacheKey = (url: string): string => {
  // Using 128 characters provides a much higher guarantee of uniqueness 
  // than the original 50 characters, mitigating collision risk.
  return CACHE_PREFIX + btoa(url).substring(0, 128);
};

/**
 * Calculates the total size of all cached images in localStorage.
 */
export const getImageCacheSize = (): number => {
  try {
    let size = 0;
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          // localStorage stores strings, so we use string length as size proxy
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

/**
 * Clears the oldest images to free up the required space. (Least Recently Saved eviction)
 * @param requiredSpace The minimum number of bytes to free.
 */
const clearOldestImages = (requiredSpace: number): void => {
  try {
    const keys = Object.keys(localStorage);
    const entries: Array<{ key: string; entry: ImageCacheEntry }> = [];

    // 1. Get all cache entries with timestamps
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const entry: ImageCacheEntry = JSON.parse(item);
            entries.push({ key, entry });
          } catch (e) { /* Ignore invalid JSON */ }
        }
      }
    });

    // 2. Sort by timestamp (oldest first)
    entries.sort((a, b) => a.entry.timestamp - b.entry.timestamp);

    // 3. Remove oldest until we have enough space
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


// --- Public API Functions ---

/**
 * Retrieves a cached image Data URL. Automatically removes expired entries.
 * @param url The image URL to look up.
 * @returns The Data URL string if found and valid, otherwise null.
 */
export const getCachedImage = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  try {
    const cacheKey = generateCacheKey(url);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const entry: ImageCacheEntry = JSON.parse(cached);
    const now = Date.now();
    
    // Check for expiration (TTL)
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

/**
 * Stores an image Data URL in the cache, performing size and capacity checks.
 * @param url The original image URL.
 * @param dataUrl The base64-encoded image data.
 * @param ttl The Time-To-Live for the entry in milliseconds.
 * @returns true if successful, false otherwise.
 */
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
    
    const cacheKey = generateCacheKey(url);
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

/**
 * Fetches an image from a URL, converts it to Data URL, and caches it.
 * Falls back to the original URL on any failure (fetch error, size limit, read error).
 * @param url The URL of the image to fetch.
 * @returns A Promise resolving to the Data URL or the original URL (on failure/size limit).
 */
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
      return url; // Fallback to original URL
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


/**
 * Clears all image cache entries.
 */
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

/**
 * Cleans up all images that have passed their expiration time (TTL).
 * @returns The number of images removed.
 */
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
            // Invalid entry found, remove it
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

/**
 * React Hook for lazy loading and caching an image.
 * @param url The image URL.
 * @returns The Data URL if cached, or the original URL while loading/on failure.
 */
export const useImageCache = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // 1. Check synchronously for cached image
  const cached = getCachedImage(url);
  if (cached) return cached;
  
  // 2. If not cached, trigger async fetch and cache (don't await)
  fetchAndCacheImage(url).catch(err => {
    console.error('Image cache fetch failed:', err);
  });
  
  // 3. Return original URL immediately to display a placeholder or initiate loading
  return url; 
};

/**
 * Returns statistics about the current cache usage.
 */
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

// --- Setup ---

/**
 * Automatically cleans up expired images every 10 minutes when running in a browser environment.
 */
if (typeof window !== 'undefined') {
  setInterval(() => {
    cleanupExpiredImages();
  }, 600000); // 10 minutes (10 * 60 * 1000)
}