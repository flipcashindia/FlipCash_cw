export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface PostSection {
  id: number;
  order: number;
  heading?: string;
  content_html: string;
  image?: string;
  image_alt?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  category?: Category;
  primary_image?: string;
  primary_image_alt?: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
  updated_at: string;
  created_at: string;
  sections?: PostSection[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}