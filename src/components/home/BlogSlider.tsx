import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { blogApi } from "../../api/services/blogService";
import type { BlogPost } from "../../api/types/blog.types";
import { BlogCard } from "../pages/BlogCard";


const BlogSlider: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    blogApi.getTrending().then(data => { if (data) setBlogs(data); });
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector("div")?.clientWidth || 320;
      scrollContainerRef.current.scrollBy({ left: (cardWidth + 24) * (direction === "left" ? -1 : 1), behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-[#FEC925]" size={24} />
              <span className="text-[10px] font-black text-[#1B8A05] uppercase tracking-[0.3em]">Trending Now</span>
            </div>
            <h2 className="text-4xl font-black text-[#1C1C1B] tracking-tight">Financial Trends 2024</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleScroll("left")} className="w-12 h-12 rounded-full border border-[#E0E0E0] bg-white flex items-center justify-center hover:bg-[#FEC925] transition-all"><ChevronLeft size={24} /></button>
            <button onClick={() => handleScroll("right")} className="w-12 h-12 rounded-full border border-[#E0E0E0] bg-white flex items-center justify-center hover:bg-[#FEC925] transition-all"><ChevronRight size={24} /></button>
          </div>
        </div>
        <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="w-80 md:w-[28rem] flex-shrink-0 snap-start">
               <BlogCard post={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSlider;