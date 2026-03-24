import type { BlogPost, PaginatedResponse } from '../types/blog.types';
import { getBackendBaseUrl } from '../../api/utils/blogUtils';

const BASE_URL = `${getBackendBaseUrl()}/api/v1/blog`;

export const blogApi = {
  getPosts: async (categorySlug?: string): Promise<PaginatedResponse<BlogPost> | null> => {
    const url = categorySlug ? `${BASE_URL}/posts/?category=${categorySlug}` : `${BASE_URL}/posts/`;
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  },

  getPostDetail: async (slug: string): Promise<BlogPost | null> => {
    const response = await fetch(`${BASE_URL}/posts/${slug}/`);
    return response.ok ? await response.json() : null;
  },

  getTrending: async (): Promise<BlogPost[] | null> => {
    const response = await fetch(`${BASE_URL}/posts/trending/`);
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  },

  getRelated: async (slug: string): Promise<BlogPost[] | null> => {
    const response = await fetch(`${BASE_URL}/posts/${slug}/related/`);
    return response.ok ? await response.json() : null;
  }
};