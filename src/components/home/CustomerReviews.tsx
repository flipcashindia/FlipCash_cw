import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";

// --- Data Types ---
interface Product {
  name: string;
  price: string;
  deviceType?: string;
}

interface Review {
  id: number;
  customerName: string;
  isVerified: boolean;
  rating: number;
  reviewText: string;
  product: Product;
  soldDate?: string;
}

// --- Mock Data ---
const reviewData: Review[] = [
  {
    id: 1,
    customerName: "Rajesh K.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Sold my old iPhone in just 2 hours! The instant price quote was accurate and the pickup was seamless. Got the best value for my device.",
    product: {
      name: "iPhone 12 Pro",
      price: "₹42,500",
      deviceType: "Smartphone",
    },
    soldDate: "2 days ago",
  },
  {
    id: 2,
    customerName: "Priya S.",
    isVerified: true,
    rating: 5,
    reviewText:
      "FlipCash made selling my laptop so easy! No hassle, fair pricing, and instant payment. Highly recommend for anyone looking to sell their gadgets.",
    product: {
      name: "MacBook Air M1",
      price: "₹58,000",
      deviceType: "Laptop",
    },
    soldDate: "1 week ago",
  },
  {
    id: 3,
    customerName: "Amit M.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Best platform to sell old electronics! The verification process was quick, payment was instant, and their team was super professional.",
    product: {
      name: "Samsung Galaxy S21",
      price: "₹28,500",
      deviceType: "Smartphone",
    },
    soldDate: "3 days ago",
  },
  {
    id: 4,
    customerName: "Sneha R.",
    isVerified: true,
    rating: 5,
    reviewText:
      "I was skeptical at first, but FlipCash exceeded my expectations. Got a fair price for my old tablet and the entire process took less than 30 minutes!",
    product: {
      name: "iPad Air 4th Gen",
      price: "₹35,000",
      deviceType: "Tablet",
    },
    soldDate: "5 days ago",
  },
  {
    id: 5,
    customerName: "Vikram T.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Smooth transaction from start to finish. The doorstep pickup service is convenient and payment was credited immediately after verification.",
    product: {
      name: "OnePlus 9 Pro",
      price: "₹31,200",
      deviceType: "Smartphone",
    },
    soldDate: "1 week ago",
  },
  {
    id: 6,
    customerName: "Neha P.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Finally found a trustworthy platform to sell my gadgets! No hidden charges, transparent pricing, and quick payment. Will definitely use again!",
    product: {
      name: "Apple Watch Series 6",
      price: "₹22,800",
      deviceType: "Smartwatch",
    },
    soldDate: "4 days ago",
  },
  {
    id: 7,
    customerName: "Arjun V.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Impressed with the professionalism! Sold my gaming laptop at a great price. The pickup executive was courteous and the process was hassle-free.",
    product: {
      name: "Dell G15 Gaming Laptop",
      price: "₹48,500",
      deviceType: "Laptop",
    },
    soldDate: "6 days ago",
  },
  {
    id: 8,
    customerName: "Kavya D.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Quick, reliable, and transparent! Sold my old phone and got instant payment. The customer support team was very helpful throughout the process.",
    product: {
      name: "Xiaomi Mi 11X",
      price: "₹19,500",
      deviceType: "Smartphone",
    },
    soldDate: "2 days ago",
  },
  {
    id: 9,
    customerName: "Rohit B.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Best decision to sell through FlipCash! Got more than I expected for my old device. The entire experience was smooth and professional.",
    product: {
      name: "iPad Pro 11-inch",
      price: "₹52,000",
      deviceType: "Tablet",
    },
    soldDate: "1 week ago",
  },
];

// --- Star Rating Component ---
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < rating ? "currentColor" : "none"} 
        strokeWidth={2}
      />
    ))}
  </div>
);

// --- Single Review Card Component ---
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <motion.div 
    className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-7"
    whileHover={{ y: -5 }}
  >
    {/* Header */}
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FEC925] to-[#1B8A05] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
            {review.customerName ? review.customerName[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-base truncate">
              {review.customerName || 'User'}
            </p>
            {review.soldDate && (
              <p className="text-xs text-gray-500 mt-0.5">{review.soldDate}</p>
            )}
          </div>
        </div>
        {review.isVerified && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-500 px-3 py-1.5 rounded-full shadow-sm flex-shrink-0 ml-2">
            <CheckCircle size={13} strokeWidth={2.5} />
            Verified Seller
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={review.rating} />
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed">
        "{review.reviewText}"
      </p>
    </div>

    {/* Product Info */}
    <div className="border-t border-gray-100 mt-5 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">
            {review.product.deviceType || 'Device'} Sold
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {review.product.name}
          </p>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="text-xs text-gray-500 mb-1">Received</p>
          <p className="text-xl font-bold text-green-600">
            {review.product.price}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main Carousel Component ---
const CustomerReviews: React.FC = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Responsive reviews per page
  const [reviewsPerPage, setReviewsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setReviewsPerPage(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setReviewsPerPage(2); // Tablet
      } else {
        setReviewsPerPage(3); // Desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const numPages = Math.ceil(reviewData.length / reviewsPerPage);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [page, numPages]);

  const handleNext = () => {
    setDirection(1);
    setPage((prevPage) => (prevPage + 1) % numPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setPage((prevPage) => (prevPage - 1 + numPages) % numPages);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > page ? 1 : -1);
    setPage(index);
  };

  // Animation variants
  const variants = {
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
    }),
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Happy Sellers
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust FlipCash to sell their devices
            </p>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="relative min-h-[480px] sm:min-h-[420px] md:min-h-[400px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                >
                  {reviewData
                    .slice(page * reviewsPerPage, (page + 1) * reviewsPerPage)
                    .map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-10"
            aria-label="Previous reviews"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-10"
            aria-label="Next reviews"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
          {[...Array(numPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`transition-all duration-300 rounded-full ${
                i === page
                  ? "w-8 h-2.5 bg-gradient-to-r from-[#FEC925] to-[#1B8A05]"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to review page ${i + 1}`}
              aria-current={i === page ? "true" : "false"}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">50K+</p>
            <p className="text-xs md:text-sm text-gray-600">Devices Sold</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">4.8★</p>
            <p className="text-xs md:text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">30 Min</p>
            <p className="text-xs md:text-sm text-gray-600">Quick Process</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">100%</p>
            <p className="text-xs md:text-sm text-gray-600">Secure Payment</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;