import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Facebook, Twitter, Link2, Mail, Calendar } from 'lucide-react';
import type { BlogPost } from '../../api/types/blog.types';
import { blogApi } from '../../api/services/blogService';
import { RecentBlogsSidebar, RelatedBlogsFooter } from './RecentAndReleted';
import { resolveImageUrl } from '../../api/utils/blogUtils';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      blogApi.getPostDetail(slug).then(data => {
        setPost(data);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load post:", err);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!post) return <div className="p-20 text-center font-black text-2xl">POST NOT FOUND</div>;

  return (
    <div className="bg-white min-h-screen selection:bg-[#FEC925] selection:text-[#1C1C1B]">
      {/* --- Header Section --- */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <button 
          onClick={() => navigate('/blog')} 
          className="flex items-center gap-3 text-[#555555] hover:text-[#1C1C1B] font-black text-[10px] uppercase tracking-[0.2em] mb-12 group transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>

        <div className="flex gap-3 mb-8">
           <span className="px-4 py-1.5 bg-[#EAF6F4] text-[#1B8A05] text-[10px] font-black rounded-full uppercase tracking-widest">
             {post.category?.name || "FINANCE"}
           </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-[#1C1C1B] leading-[1.1] mb-10 tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-8 py-10 border-y border-[#F5F5F5] mb-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FEC925] flex items-center justify-center text-[#1C1C1B] text-xl font-black border-4 border-white shadow-xl">
              {post.author_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-black text-[#1C1C1B] uppercase tracking-widest">{post.author_name}</p>
              <div className="flex items-center gap-2 text-xs text-[#9E9E9E] font-medium mt-1">
                <Calendar size={12} className="text-[#FEC925]" />
                {new Date(post.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="w-10 h-10 rounded-xl bg-[#F5F5F5] text-[#1C1C1B] flex items-center justify-center hover:bg-[#FEC925] transition-all"><Facebook size={18} /></button>
             <button className="w-10 h-10 rounded-xl bg-[#F5F5F5] text-[#1C1C1B] flex items-center justify-center hover:bg-[#FEC925] transition-all"><Twitter size={18} /></button>
             <button className="w-10 h-10 rounded-xl bg-[#F5F5F5] text-[#1C1C1B] flex items-center justify-center hover:bg-[#FEC925] transition-all"><Link2 size={18} /></button>
          </div>
        </div>
      </div>

      {/* --- Main Featured Image (Uses resolveImageUrl) --- */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-[#F5F5F5]">
          <img 
            src={resolveImageUrl(post.primary_image)} 
            alt={post.primary_image_alt || post.title} 
            className="w-full h-auto object-cover max-h-[600px]" 
          />
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
        <main className="lg:col-span-8">
          {post.sections?.map((section) => (
            <section key={section.id} className="mb-16">
              {section.heading && (
                <h2 className="text-3xl font-black text-[#1C1C1B] mb-8 leading-tight tracking-tight">
                  {section.heading}
                </h2>
              )}
              {/* --- Section Image (Uses resolveImageUrl) --- */}
              {section.image && (
                <div className="mb-10 group rounded-[2rem] overflow-hidden shadow-lg border border-gray-100">
                  <img 
                    src={resolveImageUrl(section.image)} 
                    alt={section.image_alt || "Section visual"} 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              )}
              <div 
                className="prose prose-lg md:prose-xl max-w-none 
                  prose-headings:text-[#1C1C1B] prose-headings:font-black 
                  prose-p:text-[#555555] prose-p:leading-relaxed
                  prose-strong:text-[#1C1C1B] prose-strong:font-black
                  prose-a:text-[#1B8A05] prose-a:no-underline hover:prose-a:text-[#FEC925]
                  prose-li:text-[#555555] prose-blockquote:border-[#FEC925]
                  prose-blockquote:bg-[#FAFAFA] prose-blockquote:p-6 prose-blockquote:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: section.content_html }}
              />
            </section>
          ))}
        </main>

        {/* --- Sidebar --- */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-12">
            <RecentBlogsSidebar />

            <div className="bg-[#1C1C1B] p-10 rounded-[2.5rem] text-white shadow-2xl">
              <Mail className="text-[#FEC925] mb-6" size={32} />
              <h3 className="text-2xl font-black mb-4 leading-tight">Insight newsletter.</h3>
              <p className="text-white/50 text-xs mb-8">Weekly financial strategies and growth tips delivered to your inbox.</p>
              <input 
                type="email" 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl mb-4 text-white outline-none focus:ring-1 focus:ring-[#FEC925]" 
                placeholder="Email Address" 
              />
              <button className="w-full py-4 bg-[#FEC925] text-[#1C1C1B] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* --- Footer Related Section --- */}
      {slug && <RelatedBlogsFooter slug={slug} />}
    </div>
  );
};

export default BlogDetailPage;