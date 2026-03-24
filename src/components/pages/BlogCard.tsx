import React from 'react';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BlogPost } from '../../api/types/blog.types';
import { resolveImageUrl } from '../../api/utils/blogUtils';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'full' | 'mini';
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'full' }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
    window.scrollTo(0, 0);
  };

  // Fixed: Always resolve the image URL
  const displayImage = resolveImageUrl(post.primary_image);

  if (variant === 'mini') {
    return (
      <div onClick={handleClick} className="group flex gap-4 items-start p-3 hover:bg-[#EAF6F4] rounded-2xl cursor-pointer transition-all duration-300">
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img 
            src={displayImage} 
            alt={post.primary_image_alt || post.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200"; }}
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-bold text-[#1B8A05] uppercase tracking-widest mb-1">{post.category?.name || "Insight"}</span>
          <h4 className="font-bold text-[#1C1C1B] leading-tight group-hover:text-[#FEC925] line-clamp-2 transition-colors">{post.title}</h4>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="bg-white group cursor-pointer border border-[#E0E0E0] rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
        <img 
          src={displayImage} 
          alt={post.primary_image_alt || post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-[#FEC925] text-[#1C1C1B] text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
            {post.category?.name || "Fintech"}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center text-[12px] font-bold text-[#9E9E9E] mb-4 gap-4 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#FEC925]" /> {new Date(post.updated_at || post.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#FEC925]" /> 5 MIN READ</span>
        </div>
        <h3 className="text-2xl font-black text-[#1C1C1B] mb-4 leading-tight group-hover:text-[#FEC925] transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-[#555555] text-sm leading-relaxed mb-8 line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-6 border-t border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF6F4] flex items-center justify-center text-[#1B8A05] font-black border-2 border-white">{post.author_name?.charAt(0) || 'F'}</div>
            <span className="text-xs font-black text-[#1C1C1B] uppercase tracking-widest">{post.author_name}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1C1C1B] text-white flex items-center justify-center group-hover:bg-[#FEC925] group-hover:text-[#1C1C1B] transition-all"><ArrowUpRight size={20} /></div>
        </div>
      </div>
    </div>
  );
};