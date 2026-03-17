import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { BlogCard } from './BlogCard';
import type { BlogPost } from '../../api/types/blog.types';
import { blogApi } from '../../api/services/blogService';

export const RecentBlogsSidebar: React.FC<{ limit?: number }> = ({ limit = 5 }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getTrending().then(data => {
      if (data) setBlogs(data.slice(0, limit));
      setLoading(false);
    });
  }, [limit]);

  if (loading || !blogs.length) return null;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E0E0E0] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="text-[#FEC925]" size={24} />
        <h3 className="text-xl font-black text-[#1C1C1B] uppercase tracking-tighter">Recent Updates</h3>
      </div>
      <div className="space-y-6">
        {blogs.map(post => <BlogCard key={post.id} post={post} variant="mini" />)}
      </div>
    </div>
  );
};

export const RelatedBlogsFooter: React.FC<{ slug: string }> = ({ slug }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    blogApi.getRelated(slug).then(data => {
      if (data) setBlogs(data);
    });
  }, [slug]);

  if (!blogs.length) return null;

  return (
    <section className="bg-[#EAF6F4] py-24 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-lg">
            <span className="text-[10px] font-black text-[#1B8A05] uppercase tracking-[0.3em] mb-4 block">Recommended for you</span>
            <h2 className="text-4xl font-black text-[#1C1C1B] tracking-tight leading-none">Related Articles</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogs.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>
    </section>
  );
};