import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Laptop, Tablet, Watch, ChevronRight, Loader2, TrendingUp } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Category } from '../../api/types/catalog.types';

const SellProductSection: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await catalogService.getCategories();
      setCategories(data.filter(cat => cat.is_active));
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      setError(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    navigate('/choose-brand', { 
      state: { 
        categoryId: category.id,
        categoryName: category.name 
      } 
    });
  };

  const iconMap: Record<string, any> = {
    phone: Smartphone,
    mobile: Smartphone,
    smartphone: Smartphone,
    laptop: Laptop,
    tablet: Tablet,
    ipad: Tablet,
    watch: Watch,
    smartwatch: Watch,
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#F0F7F6] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
            <p className="text-xl text-[#1C1C1B] font-semibold">Loading categories...</p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#F0F7F6] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-[#FF0000] text-4xl">⚠</span>
            </div>
            <h3 className="text-3xl font-bold text-[#1C1C1B] mb-4">Unable to Load Categories</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={loadCategories}
              className="px-8 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#F0F7F6] via-white to-[#EAF6F4] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FEC925]/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1B8A05]/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] rounded-full shadow-lg">
              <div className="flex items-center gap-2 text-[#1C1C1B] font-bold">
                <TrendingUp size={20} />
                <span>Best Prices Guaranteed</span>
              </div>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#1C1C1B] mb-6">
            Sell Your Old Device
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get <span className="text-[#1B8A05] font-bold">instant cash</span> for your used electronics.
            <br />
            <span className="text-[#FEC925] font-bold">Free pickup</span> • <span className="text-[#1B8A05] font-bold">Best prices</span> • <span className="text-[#FEC925] font-bold">Instant payment</span>
          </p>
        </motion.div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                icon={iconMap[category.slug] || Smartphone}
                onClick={() => handleCategoryClick(category)}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { icon: '🚚', title: 'Free Doorstep Pickup', desc: 'We come to your location' },
            { icon: '💰', title: 'Instant Payment', desc: 'Get paid immediately' },
            { icon: '🔒', title: 'Safe & Secure', desc: 'Data wiping guaranteed' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-[#FEC925]/20 hover:shadow-xl transition"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#1C1C1B] mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  category: Category;
  icon: any;
  onClick: () => void;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, icon: Icon, onClick, index }) => {
  const imageUrl = useImageCache(category.image_url);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileHover={{ scale: 1.08, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#FEC925] overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FEC925]/10 to-[#1B8A05]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon/Image Container */}
        <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-[#FEC925]/20 to-[#1B8A05]/20 rounded-2xl group-hover:scale-110 transition-transform">
          {imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="w-12 h-12 border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin" />
              )}
              <img
                src={imageUrl}
                alt={category.name}
                className={`w-20 h-20 object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <Icon size={64} className="text-[#1B8A05]" />
          )}
        </div>

        {/* Category Name */}
        <h3 className="text-2xl font-bold text-center text-[#1C1C1B] mb-3 group-hover:text-[#1B8A05] transition">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-center text-gray-600 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center justify-center gap-2 text-[#FEC925] font-bold group-hover:gap-4 transition-all">
          <span>Sell Now</span>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FEC925] to-[#1B8A05] opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity" />
    </motion.div>
  );
};

export default SellProductSection;