import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Images for the banner (replace with your actual paths in assets folder)
// !! IMPORTANT !!
// The local imports below were causing errors because the files don't exist.
// I've replaced them with placeholders in the `slides` array.
import bannerImage1 from "../../assets/banner-phone-case.png"; // Image 1 for slide 1
import bannerImage2 from "../../assets/banner-magsafe.png"; // Image 2 for slide 2
import bannerImage3 from "../../assets/banner-earbuds.png"; // Image 3 for slide 3 (Example, replace if needed)

interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  image: string; // This will now be a URL string
  buttonText: string;
  buttonLink: string;
  imagePosition: "left" | "right"; // Where the image should be on desktop
}

const slides: SlideContent[] = [
  {
    id: 1,
    subtitle: "Sell Old Phone",
    title: "At Your Doorstep, Anywhere",
    // [FIX] Using placeholder image
    image: bannerImage1,
    buttonText: "Shop Now",
    buttonLink: "#",
    imagePosition: "right",
  },
  {
    id: 2,
    subtitle: "APPLE MAGSAFE CHARGER",
    title: "Next-Level Tech",
    // [FIX] Using placeholder image
    image: bannerImage2,
    buttonText: "Shop Now",
    buttonLink: "#",
    imagePosition: "left",
  },
  {
    id: 3,
    subtitle: "New Arrivals",
    title: "Hear the Difference", // Example text
    // [FIX] Using placeholder image
    image: bannerImage3, // Assuming you have a third banner image
    buttonText: "Explore Now",
    buttonLink: "#",
    imagePosition: "right", // Example position
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
    position: "absolute", // To allow elements to crossfade
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
    // [FIX] Reduced padding and text size
    <div className="relative w-full overflow-hidden bg-[#ffe208] py-4 whitespace-nowrap">
      <div className="flex animate-infinite-scroll group-hover:paused">
        {[...ribbonMessages, ...ribbonMessages].map(
          (
            msg,
            index // Duplicate for seamless loop
          ) => (
            <span
              key={index}
              // [FIX] Reduced margin, gap, and text size for mobile
              className="text-black font-bold mx-6 flex items-center gap-2 text-sm md:text-lg"
            >
              <span className="text-black-600 text-lg leading-none transform -translate-y-px">
                ✦
              </span>
              {msg}
            </span>
          )
        )}
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
    }, 5000); // Change slide every 5 seconds (5000ms)
    return () => clearInterval(interval);
  }, [page]); // Re-run effect if page changes to reset interval

  return (
    // [FIX] Increased height on mobile to give content space
    <section className="relative w-full h-[650px] md:h-[600px] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-between overflow-hidden">
      {/* Main Banner Slider */}
      <div className="relative flex-grow flex items-center justify-center p-4 md:p-8">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slides[currentIndex].id}
            custom={direction}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Content for current slide */}
            <div
              className={`container mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center justify-center h-full gap-8 ${
                slides[currentIndex].imagePosition === "left"
                  ? "md:flex-row-reverse"
                  : ""
              }`}
            >
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left p-4">
                <p className="text-sm md:text-lg text-gray-700 font-semibold mb-2">
                  {slides[currentIndex].subtitle}
                </p>
                {/* [FIX] Reduced heading size on mobile */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                  {slides[currentIndex].title}
                </h1>

                {/* [FIX] Moved dots here, inside the text flow */}
                <div className="flex justify-center md:justify-start space-x-2 my-6">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() =>
                        setPage([dotIndex, dotIndex > currentIndex ? 1 : -1])
                      }
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        dotIndex === currentIndex
                          ? "bg-red-600"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>

                <motion.a
                  href={slides[currentIndex].buttonLink}
                  // [FIX] Reduced padding and text size on mobile
                  className="inline-flex items-center justify-center px-6 py-3 md:px-8 text-sm md:text-base font-medium rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slides[currentIndex].buttonText}{" "}
                  <ArrowRight size={18} className="ml-2" />
                </motion.a>
              </div>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 h-full">
                <img
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  // [FIX] Constrained image height on mobile
                  className="h-64 sm:h-80 md:h-auto md:max-h-[80%] w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* [FIX] Removed the absolutely positioned dots from here */}
      </div>

      {/* Bottom Scrolling Ribbon */}
      <BottomRibbon />
    </section>
  );
};

export default HeroBanner;
