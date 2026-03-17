import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Facebook, Twitter, Link2, Mail } from 'lucide-react';
import type { BlogPost } from '../../api/types/blog.types';
import { blogApi } from '../../api/services/blogService';
import { RecentBlogsSidebar, RelatedBlogsFooter } from './RecentAndReleted';



const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      blogApi.getPostDetail(slug).then(data => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black">LOADING...</div>;
  if (!post) return <div className="p-20 text-center">Post Not Found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-[#555555] font-black text-[10px] uppercase tracking-widest mb-10">
          <ArrowLeft size={14} /> Back to Hub
        </button>
        <h1 className="text-4xl md:text-6xl font-black text-[#1C1C1B] leading-[1.1] mb-10">{post.title}</h1>
        <div className="flex items-center justify-between py-10 border-y border-[#F5F5F5] mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FEC925] flex items-center justify-center font-black">{post.author_name.charAt(0)}</div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">{post.author_name}</p>
              <p className="text-xs text-[#9E9E9E]">{new Date(post.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-[#F5F5F5] rounded-lg hover:bg-[#FEC925]"><Facebook size={18} /></button>
            <button className="p-2 bg-[#F5F5F5] rounded-lg hover:bg-[#FEC925]"><Twitter size={18} /></button>
            <button className="p-2 bg-[#F5F5F5] rounded-lg hover:bg-[#FEC925]"><Link2 size={18} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mb-20">
        <img src={post.primary_image} alt={post.primary_image_alt} className="w-full rounded-[3rem] shadow-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <main className="lg:col-span-8">
          {post.sections?.map(section => (
            <div key={section.id} className="mb-12">
              {section.heading && <h2 className="text-3xl font-black mb-6">{section.heading}</h2>}
              {section.image && <img src={section.image} alt={section.image_alt} className="w-full rounded-[2rem] mb-8" />}
              <div className="prose prose-lg md:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: section.content_html }} />
            </div>
          ))}
        </main>
        <aside className="lg:col-span-4 sticky top-24 h-fit">
          <RecentBlogsSidebar />
          <div className="mt-8 bg-[#1C1C1B] p-10 rounded-[2rem] text-white">
            <Mail className="text-[#FEC925] mb-4" />
            <h3 className="text-xl font-black mb-2">Join the list.</h3>
            <p className="text-white/50 text-xs mb-6">Weekly insights for business leaders.</p>
            <input type="text" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl mb-4" placeholder="Email" />
            <button className="w-full py-4 bg-[#FEC925] text-[#1C1C1B] font-black uppercase tracking-widest rounded-xl">Subscribe</button>
          </div>
        </aside>
      </div>

      {slug && <RelatedBlogsFooter slug={slug} />}
    </div>
  );
};

export default BlogDetailPage;