import type { BlogPost, PaginatedResponse } from '../types/blog.types.ts';
import { getBackendBaseUrl } from '../../api/utils/blogUtils';

const BASE_URL = getBackendBaseUrl();

// const getBaseUrl = (): string => {
//   const isProd = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
//   return isProd ? 'https://flend.flipcash.com/api/v1' : 'http://localhost:8000/api/v1';
// };

// const BASE_URL = getBaseUrl();

export const blogApi = {
  getPosts: async (categorySlug?: string): Promise<PaginatedResponse<BlogPost> | null> => {
    const url = categorySlug ? `${BASE_URL}/blog/posts/?category=${categorySlug}` : `${BASE_URL}/blog/posts/`;
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  },

  getPostDetail: async (slug: string): Promise<BlogPost | null> => {
    const response = await fetch(`${BASE_URL}/blog/posts/${slug}/`);
    return response.ok ? await response.json() : null;
  },

  getTrending: async (): Promise<BlogPost[] | null> => {
    const response = await fetch(`${BASE_URL}/blog/posts/trending/`);
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  },

  getRelated: async (slug: string): Promise<BlogPost[] | null> => {
    const response = await fetch(`${BASE_URL}/blog/posts/${slug}/related/`);
    return response.ok ? await response.json() : null;
  }
};