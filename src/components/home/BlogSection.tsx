import React, { useState, useEffect } from 'react';
import { blogApi } from '../../api/services/blogService';
import type { BlogPost } from '../../api/types/blog.types';
import { BlogCard } from '../pages/BlogCard';


const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getPosts().then(data => {
      if (data && data.results) setBlogs(data.results.slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="py-24 flex justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-[#1B8A05] uppercase tracking-[0.3em] mb-4 block">Knowledge Hub</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1B] mb-6 tracking-tight">Latest Blogs</h2>
          <div className="h-1.5 w-20 bg-[#FEC925] mx-auto rounded-full mb-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;