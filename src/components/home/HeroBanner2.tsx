import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Images for the banner
import bannerImage1 from "../../assets/banner1.jpeg";
import bannerImage2 from "../../assets/banner2.jpeg";
import bannerImage3 from "../../assets/banner3.jpeg";

interface SlideContent {
  id: number;
  image: string;
  link: string;
}

const slides: SlideContent[] = [
  {
    id: 1,
    image: bannerImage1,
    link: "/",
  },
  {
    id: 2,
    image: bannerImage2,
    link: "/",
  },
  {
    id: 3,
    image: bannerImage3,
    link: "/",
  },
];

// Animation variants for Framer Motion
const bannerVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
  }),
};

// Auto-scrolling ribbon at the bottom of the banner
const BottomRibbon: React.FC = () => {
  const ribbonMessages = [
    "50% Off On Selected Items",
    "New Arrival",
    "Limited-Time Offer",
    "Free Shipping on All Orders",
  ];

  return (
    <div className="relative z-20 w-full overflow-hidden bg-[#ffe208] py-4 whitespace-nowrap shadow-md">
      <div className="flex animate-infinite-scroll group-hover:paused">
        {[...ribbonMessages, ...ribbonMessages].map((msg, index) => (
          <span
            key={index}
            className="text-black font-bold mx-6 flex items-center gap-2 text-sm md:text-lg"
          >
            <span className="text-black-600 text-lg leading-none transform -translate-y-px">
              ✦
            </span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

const HeroBanner: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentIndex = Math.abs(page % slides.length);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <section className="relative w-full flex flex-col justify-between overflow-hidden bg-gray-100">
      
      {/* Main Banner Slider Area - Responsive Heights */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slides[currentIndex].id}
            custom={direction}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The entire slide acts as a link */}
            <a 
              href={slides[currentIndex].link} 
              className="block w-full h-full cursor-pointer group"
              aria-label={`Go to slide ${slides[currentIndex].id} promotional link`}
            >
              {/* Full Image */}
              <img
                src={slides[currentIndex].image}
                alt={`Banner image ${slides[currentIndex].id}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </a>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={(e) => {
                e.preventDefault(); 
                setPage([dotIndex, dotIndex > currentIndex ? 1 : -1]);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
                dotIndex === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Scrolling Ribbon */}
      <BottomRibbon />
    </section>
  );
};

export default HeroBanner;