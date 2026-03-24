/**
 * Resolves the backend base URL based on the environment.
 * Local: http://localhost:8000
 * Production: https://flend.flipcash.in
 */
export const getBackendBaseUrl = (): string => {
  const isProd = 
    window.location.hostname !== 'localhost' && 
    !window.location.hostname.includes('127.0.0.1') &&
    !window.location.hostname.startsWith('10.'); // Handle local IP testing

  // Use .in as per Django settings.py ALLOWED_HOSTS
  return isProd ? 'https://flend.flipcash.in' : 'http://localhost:8000';
};

/**
 * Prepends the backend host to relative paths (e.g., /media/...) 
 * to ensure images load from the Django server.
 */
export const resolveImageUrl = (path: string | null | undefined): string => {
  if (!path) return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"; // Fallback image
  
  // If the path is already an absolute URL, return it
  if (path.startsWith('http')) return path;
  
  // Prepend the backend host (e.g., http://localhost:8000/media/...)
  return `${getBackendBaseUrl()}${path}`;
};