import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import BlogDefaultImg from "../../assets/BlogDefault.png";
// --- Data Types ---
interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  href: string;
}

// --- Mock Data ---
// Using placeholders for images. Replace with your actual asset paths.
const blogData: Blog[] = [
  {
    id: 1,
    title: "How to Sell Old Phones Easily",
    description: "Learn how to get the best price for your used phones, laptops, and gadgets with our simple step-by-step process.",
    image: BlogDefaultImg,
    date: "Sep 5, 2025",
    author: "Admin",
    href: "#"
  },
  {
    id: 2,
    title: "Top 5 Tips for Buying Refurbished Laptops",
    description: "Buying a refurbished laptop can save money. Here's what you should check before making the purchase.",
    image: BlogDefaultImg,
    date: "Aug 25, 2025",
    author: "Admin",
    href: "#"
  },
  {
    id: 3,
    title: "Why Recycling Electronics is Important",
    description: "E-waste is a growing problem. Discover how recycling your old gadgets helps the environment.",
    image: BlogDefaultImg,
    date: "Aug 15, 2025",
    author: "Admin",
    href: "#"
  },
  {
    id: 4,
    title: "The Ultimate Guide to Smart Home Devices",
    description: "Transform your living space with the latest smart home technology. From lights to locks, we cover it all.",
    image: BlogDefaultImg,
    date: "Jul 30, 2025",
    author: "Admin",
    href: "#"
  },
  {
    id: 5,
    title: "Maximizing Your Device's Battery Life",
    description: "Tired of your battery dying? Follow these simple tips to get the most out of your phone, tablet, and laptop.",
    image: BlogDefaultImg,
    date: "Jul 21, 2025",
    author: "Admin",
    href: "#"
  },
  {
    id: 6,
    title: "What to Look for in a Gaming Phone",
    description: "Mobile gaming is bigger than ever. We break down the key features you need: refresh rate, processors, and more.",
    image: BlogDefaultImg,
    date: "Jul 10, 2025",
    author: "Admin",
    href: "#"
  },
];

// --- Blog Card Sub-Component ---
const BlogCard: React.FC<{ post: Blog }> = ({ post }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
    {/* Image Container with Date */}
    <div className="relative">
      <a href={post.href} className="block">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-56 object-cover"
        />
      </a>
      <span 
        className="absolute bottom-4 left-4 bg-white/90 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full"
      >
        {post.date}
      </span>
    </div>
    
    {/* Content Container */}
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        <a href={post.href} className="hover:text-blue-600 transition-colors">
          {post.title}
        </a>
      </h3>
      <p className="text-gray-600 text-sm mb-6 flex-grow">
        {post.description}
      </p>
      
      {/* Card Footer */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <span className="flex items-center text-sm text-gray-500">
          <User size={16} className="mr-2 text-orange-500" />
          {post.author}
        </span>
        <a 
          href={post.href} 
          className="inline-flex items-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Read More
          <ArrowRight size={16} className="ml-2" />
        </a>
      </div>
    </div>
  </div>
);

// --- Main Blog Section Component ---
const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Blogs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with useful tips, guides, and news about gadgets & recycling.
          </p>
        </div>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

