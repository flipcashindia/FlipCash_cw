import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import DefaultUser from "../../assets/User.png";

// --- Data Types ---
interface Product {
  name: string;
  price: string;
  image: string;
}

interface Review {
  id: number;
  customerName: string;
  isVerified: boolean;
  rating: number;
  reviewText: string;
  product: Product;
}

// --- Mock Data ---
// Using placeholders for images. Replace with your actual asset paths.
const reviewData: Review[] = [
  {
    id: 1,
    customerName: "Emily T.",
    isVerified: true,
    rating: 5,
    reviewText:
      "The quality of the electronics exceeded my expectations. Every device feels premium, and the performance is outstanding. I'm absolutely impressed.",
    product: {
      name: "Instax Mini 12 Camera",
      price: "$130.00",
      image: DefaultUser,
    },
  },
  {
    id: 2,
    customerName: "Jessica M.",
    isVerified: true,
    rating: 5,
    reviewText:
      "I was pleasantly surprised by how fast my order arrived. The customer service team was helpful and friendly. Great shopping experience!",
    product: {
      name: "Wi-Fi Video Doorbell",
      price: "$150.00",
      image: DefaultUser,
    },
  },
  {
    id: 3,
    customerName: "Lisa P.",
    isVerified: true,
    rating: 5,
    reviewText:
      "The customer service team was helpful and friendly. Great shopping experience! I was pleasantly surprised by how fast my order arrived.",
    product: {
      name: "Amazfit Bip 5 Smartwatch 46mm",
      price: "$120.00",
      image: DefaultUser,
    },
  },
  {
    id: 4,
    customerName: "David R.",
    isVerified: true,
    rating: 5,
    reviewText:
      "Found exactly what I was looking for at a great price. The website is easy to navigate and the checkout process was a breeze.",
    product: {
      name: "Wireless Earbuds Pro",
      price: "$99.00",
      image: DefaultUser,
    },
  },
  {
    id: 5,
    customerName: "Sarah K.",
    isVerified: true,
    rating: 5,
    reviewText:
      "My refurbished laptop looks and works like new. Flipcash is my new go-to for all my tech needs. Highly recommend!",
    product: {
      name: 'Refurbished Laptop 14"',
      price: "$450.00",
      image: DefaultUser,
    },
  },
  {
    id: 6,
    customerName: "Mike B.",
    isVerified: false,
    rating: 5,
    reviewText:
      "Incredible value. The 'sell my device' process was simple and I got a fair price. Used the credit to buy a new tablet.",
    product: {
      name: "Galaxy Tab S9",
      price: "$620.00",
      image: DefaultUser,
    },
  },
  {
    id: 7,
    customerName: "ALpha B.",
    isVerified: false,
    rating: 3,
    reviewText:
      "Incredible value. The 'sell my device' process was simple and I got a fair price. Used the credit to buy a new tablet.",
    product: {
      name: "Galaxy Tab S10",
      price: "$680.00",
      image: DefaultUser,
    },
  },
  {
    id: 8,
    customerName: "Bate B.",
    isVerified: false,
    rating: 4,
    reviewText:
      "Incredible value. The 'sell my device' process was simple and I got a fair price. Used the credit to buy a new tablet.",
    product: {
      name: "Sansung S9",
      price: "$450.00",
      image: DefaultUser,
    },
  },
  {
    id: 9,
    customerName: "Ponk B.",
    isVerified: false,
    rating: 5,
    reviewText:
      "Incredible value. The 'sell my device' process was simple and I got a fair price. Used the credit to buy a new tablet.",
    product: {
      name: "Galaxy H9",
      price: "$690.00",
      image: DefaultUser,
    },
  },
];

// --- Star Rating Component ---
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={18} fill={i < rating ? "currentColor" : "none"} />
    ))}
  </div>
);

// --- Single Review Card Component ---
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
    <div>
      <div className="flex items-center gap-2 mb-3">
        {/* <div className="px-4 py-4 bg-gradient-to-r from-[#F0F7F6] to-[#EAF6F4] border-b-2 border-[#FEC925]/20"> */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] rounded-full flex items-center justify-center text-[#1C1C1B] font-bold text-xl">
              {review.customerName ? review.customerName[0].toUpperCase() : review.customerName[0] || 'U'}
            </div>
            <div>
              <p className="font-bold text-[#1C1C1B]">
                {review.customerName || 'User'}
              </p>
            </div>
          </div>
        {/* </div> */}
        <div></div>
        {/* <h3 className="font-semibold text-gray-900">{review.customerName}</h3> */}
        {review.isVerified && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle size={14} /> Verified Buyer
          </span>
        )}
      </div>
      <StarRating rating={review.rating} />
      <p className="text-gray-600 text-md leading-relaxed mt-4">
        {review.reviewText}
      </p>
    </div>
    <div className="border-t border-gray-200 mt-6 pt-4">
      <div className="flex items-center gap-4">
        {/* <img
          src={review.product.image}
          alt={review.product.name}
          className="w-14 h-14 rounded-lg bg-gray-50 object-contain"
        /> */}
        <div>
          <p className="text-md font-medium text-gray-800">
            Item purchased:<span className="font-bold"> {review.product.name} </span>
          </p>
          <p className="text-xl font-bold text-green-600 mt-1">
            {review.product.price}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Carousel Component ---
const CustomerReviews: React.FC = () => {
  // We use 3 cards per page on desktop, 2 on tablet, 1 on mobile
  const [page, setPage] = useState(0);

  // Calculate total pages needed
  // This logic is simple for demonstration. A real-world app might use a library.
  // We'll just group them into pages of 3.
  const reviewsPerPage = 3;
  const numPages = Math.ceil(reviewData.length / reviewsPerPage);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prevPage) => (prevPage + 1) % numPages);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [numPages]);

  // Animation variants for the whole page/group
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
      position: "absolute",
    }),
  };

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Happy Customers
        </h2>

        {/* Carousel Container */}
        <div className="relative h-[420px] md:h-[380px]">
          <AnimatePresence initial={false} custom={page}>
            <motion.div
              key={page}
              custom={page}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="absolute w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reviewData
                .slice(page * reviewsPerPage, (page + 1) * reviewsPerPage)
                .map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[...Array(numPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === page ? "w-6 bg-red-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to review page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
