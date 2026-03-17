import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { BlogPost } from '../../api/types/blog.types';
import { blogApi } from '../../api/services/blogService';
import { BlogCard } from './BlogCard';
import { RecentBlogsSidebar } from './RecentAndReleted';



const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getPosts().then(data => {
      if (data) setPosts(data.results);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <header className="relative py-24 px-6 overflow-hidden bg-[#EAF6F4]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-[#1C1C1B] mb-8">FlipCash <span className="text-[#FEC925]">Insights.</span></h1>
          <p className="text-[#555555] max-w-2xl mx-auto text-lg mb-10">Your guide to business growth and financial intelligence.</p>
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={20} />
            <input type="text" placeholder="Search insights..." className="w-full pl-16 pr-8 py-5 bg-white rounded-full shadow-lg outline-none" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-20">
        <main className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
        </main>
        <aside className="lg:col-span-4">
          <RecentBlogsSidebar />
        </aside>
      </div>
    </div>
  );
};

export default BlogListPage;