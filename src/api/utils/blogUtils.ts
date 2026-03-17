/**
 * Resolves the backend base URL based on the environment.
 */
export const getBackendBaseUrl = (): string => {
  const isProd = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  return isProd ? 'https://flend.flipcash.com' : 'http://localhost:8000';
};

/**
 * Prepends the backend host to relative paths (e.g., /media/...) 
 * to ensure images load from the Django server.
 */
export const resolveImageUrl = (path: string | null | undefined): string => {
  if (!path) return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800";
  
  // If the path is already an absolute URL, return it
  if (path.startsWith('http')) return path;
  
  // Prepend the host for relative media paths
  return `${getBackendBaseUrl()}${path}`;
};