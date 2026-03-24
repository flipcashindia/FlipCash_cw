/**
 * Resolves the backend base URL based on the environment.
 */
export const getBackendBaseUrl = (): string => {
  const isProd = 
    window.location.hostname !== 'localhost' && 
    !window.location.hostname.includes('127.0.0.1') &&
    !window.location.hostname.startsWith('10.'); // Handle local IP testing

  // Use .in to match your Django settings.py ALLOWED_HOSTS
  return isProd ? 'https://flend.flipcash.in' : 'http://localhost:8000';
};

/**
 * Ensures images load from the Django server by prepending the host.
 */
export const resolveImageUrl = (path: string | null | undefined): string => {
  if (!path) return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800";
  
  if (path.startsWith('http')) return path;
  
  // Prepend the host to relative media paths like /media/...
  return `${getBackendBaseUrl()}${path}`;
};