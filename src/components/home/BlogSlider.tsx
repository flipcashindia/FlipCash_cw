import React, {
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import BlogDefaultImg from "../../assets/BlogDefault.png"; // Placeholder image
// --- Data Types ---
interface Blog {
  id: number;
  title: string;
  image: string;
  href: string;
}

// --- Mock Data ---
// Using placeholders for images. Replace with your actual asset paths.
const blogData: Blog[] = [
  {
    id: 1,
    title: "Tech Trends 2025: Must-Have Gadgets & Innovations",
    image: BlogDefaultImg,
    href: "#",
  },
  {
    id: 2,
    title: "Cutting-Edge Tech: Top Electronics to Watch This Year",
    image: BlogDefaultImg,
    href: "#",
  },
  {
    id: 3,
    title: "Next-Gen Gadgets: The Hottest Tech Trends of the Year",
    image: BlogDefaultImg,
    href: "#",
  },
  {
    id: 4,
    title: "The Ultimate Guide to Smart Home Devices",
    image: BlogDefaultImg,
    href: "#",
  },
  {
    id: 5,
    title: "From Phones to Drones: What's New in Tech",
    image: BlogDefaultImg,
    href: "#",
  },
];

// --- Blog Card Sub-Component ---
const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => (
  <div className="w-96 md:w-[30rem] flex-shrink-0 snap-start">
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      <a href={blog.href} className="block group">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </a>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 h-14 overflow-hidden">
          <a href={blog.href} className="hover:text-red-600 transition-colors">
            {blog.title}
          </a>
        </h3>
        <a
          href={blog.href}
          className="mt-auto inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
        >
          Read more <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  </div>
);

// --- Navigation Button Sub-Component ---
const SliderButton: React.FC<{
  onClick: () => void;
  direction: "left" | "right";
}> = ({ onClick, direction }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10
                w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ffe208] shadow-md
                flex items-center justify-center text-black
                hover:bg-yellow-300 transition-colors duration-200
                ${
                  direction === "left"
                    ? "left-0 md:-left-6"
                    : "right-0 md:-right-6"
                }`}
    aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
  >
    {direction === "left" ? (
      <ChevronLeft size={24} />
    ) : (
      <ChevronRight size={24} />
    )}
  </button>
);

// --- Main Blog Slider Component ---
const BlogSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State for manual drag-to-scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector("div")?.clientWidth || 320;
      const scrollAmount = (cardWidth + 40) * (direction === "left" ? -1 : 1);// card width + gap

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // *2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // *2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Latest Tips & Trends
        </h2>

        <div className="relative px-4 md:px-0">
          <SliderButton onClick={() => handleScroll("left")} direction="left" />

          <div
            ref={scrollContainerRef}
            className={`
              flex gap-6 overflow-x-auto cursor-grab
              snap-x snap-mandatory scroll-smooth
              scrollbar-hide
              ${isDragging ? "cursor-grabbing" : ""}
            `}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          <SliderButton
            onClick={() => handleScroll("right")}
            direction="right"
          />
        </div>
      </div>
    </section>
  );
};

export default BlogSlider;
