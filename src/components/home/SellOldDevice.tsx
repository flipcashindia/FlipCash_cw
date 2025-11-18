import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Star, TrendingUp, Smartphone, Loader2, Sparkles } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Category, Brand, Model } from '../../api/types/catalog.types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For UI animations

// Assuming Model and Brand interfaces are globally defined, 
// we only extend Category and Brand here if needed:
interface CategoryWithCount extends Category {
  models_count?: number;
}

interface BrandWithCount extends Brand {
  models_count?: number;
}

// --- Image Component with Cache and Fallback ---
const CachedImage: React.FC<{
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}> = ({ src, alt, className, fallback }) => {
  // Assuming useImageCache returns a string URL or null/undefined
  const cachedSrc = useImageCache(src);
  const [imageError, setImageError] = useState(false);

  // Use cachedSrc for image loading, fallback if cache fails or src is null
  if (!cachedSrc || imageError) {
    return (
      <div className={`bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center ${className}`}>
        {fallback || <Smartphone className="text-teal-300" size={32} />}
      </div>
    );
  }

  return (
    <img
      src={cachedSrc}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

// --- Main Component ---
const SellOldDevice: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [_brands, setBrands] = useState<BrandWithCount[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  
  const [selectedCategory, _setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch categories and featured models on mount
  useEffect(() => {
    loadCategories();
    loadFeaturedModels();
  }, []);

  // Fetch brands when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadBrands(selectedCategory);
      setSelectedBrand(null);
      setModels([]);
    } else {
      setBrands([]);
      setSelectedBrand(null);
      setModels([]);
    }
  }, [selectedCategory]);

  // Fetch models when brand changes
  useEffect(() => {
    if (selectedCategory && selectedBrand) {
      loadModels(selectedCategory, selectedBrand);
    } else if (selectedCategory && !selectedBrand) {
      loadFeaturedModelsForCategory(selectedCategory);
    }
  }, [selectedCategory, selectedBrand]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await catalogService.getCategories();
      // Safely access data, assuming it might be paginated or array
      const categoriesArray = Array.isArray(data) ? data : (data as { results: Category[] }).results || [];
      setCategories(categoriesArray as CategoryWithCount[]);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedModels = async () => {
    try {
      const data = await catalogService.getFeaturedModels();
      // Get top 8 featured models for the new scrolling list
      setFeaturedModels(data.slice(0, 8)); 
    } catch (err) {
      console.error('Failed to load featured models:', err);
      setFeaturedModels([]);
    }
  };
  
  // --- Navigation & Routing Handlers ---

  const handleCategoryClick = (categoryId: string) => {
    // Navigates to the brand selection page
    navigate('/select-brand', { state: { categoryId } });
  };

  // const handleBrandSelect = (brandId: string) => {
  //   setSelectedBrand(brandId);
  //   setSearchQuery('');
  //   setError(null);
  // };
  
  const handleGetExactPrice = (modelId: string) => {
    // Navigates to the Device Stepper to start the condition flow
    navigate('/device-stepper', { state: { modelId } });
  };
  
  // --- Data Fetching Logic (Simplified) ---

  const loadBrands = async (categoryId: string) => {
    // ... (logic remains the same)
    try {
      setLoading(true);
      setError(null);
      const data = await catalogService.getBrandsByCategory(categoryId);
      
      const sortedBrands = (data as BrandWithCount[])
        .sort((a, b) => (b.models_count || 0) - (a.models_count || 0))
        .slice(0, 4);
      
      setBrands(sortedBrands);
    } catch (err: any) {
      console.error('Failed to load brands:', err);
      setError(err.message || 'Failed to load brands');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async (categoryId: string, brandId: string) => {
    // ... (logic remains the same)
    try {
      setLoading(true);
      setError(null);
      const data = await catalogService.getModelsByBrandAndCategory(brandId, categoryId);
      
      setModels(data.slice(0, 4));
    } catch (err: any) {
      setError(err.message || 'Failed to load models');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedModelsForCategory = async (categoryId: string) => {
    // ... (logic remains the same)
    try {
      setLoading(true);
      const brandsData = await catalogService.getBrandsByCategory(categoryId);
      
      if (brandsData.length > 0) {
        const modelsData = await catalogService.getModelsByBrandAndCategory(
          brandsData[0].id,
          categoryId
        );
        setModels(modelsData.slice(0, 4));
      } else {
        setModels([]);
      }
    } catch (err: any) {
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = async (query: string) => {
  //   // ... (logic remains the same)
  //   setSearchQuery(query);
    
  //   if (query.length < 2) {
  //     if (selectedCategory && selectedBrand) {
  //       loadModels(selectedCategory, selectedBrand);
  //     } else if (selectedCategory) {
  //       loadFeaturedModelsForCategory(selectedCategory);
  //     }
  //     return;
  //   }

  //   try {
  //     setSearchLoading(true);
  //     const results = await catalogService.searchModels(query);
  //     setModels(results.slice(0, 4));
  //   } catch (err) {
  //     console.error('Search error:', err);
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  // const resetSelection = () => {
  //   setSelectedCategory(null);
  //   setSelectedBrand(null);
  //   setSearchQuery('');
  //   setModels([]);
  //   setBrands([]);
  //   setError(null);
  // };

  // const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  // const selectedBrandData = brands.find(b => b.id === selectedBrand);

  return (
    <section className="bg-gradient-to-b from-teal-50 via-white to-teal-50 py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Instant Cash for Your Device</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sell Your Old Device
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the best price in minutes. 100% safe, instant payment guaranteed.
          </p>
        </div>

        {/* Search Bar */}
        {/* <div className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by brand or model name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none text-lg shadow-sm hover:shadow-md transition-all"
            />
            {searchLoading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-600 animate-spin" size={20} />
            )}
          </div>
        </div> */}

        {/* Breadcrumb & Error Message (Code remains the same) */}
        {/* ... */}

        {/* Categories Grid */}
        {!loading && !selectedCategory && categories.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>Select Device Category</span>
              <span className="text-sm text-gray-500 font-normal">({categories.length} categories)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>  handleCategoryClick(category.id)}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-500 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <CachedImage
                      src={category.icon_url}
                      alt={category.title}
                      className="mb-4 object-contain group-hover:scale-110 transition-transform duration-300"
                      fallback={<Smartphone className="text-teal-400" size={32} />}
                    />
                    <h4 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.title}
                    </h4>
                    {/* {category.models_count !== undefined && (
                      <p className="text-sm text-gray-500">
                        {category.models_count} models
                      </p>
                    )} */}
                    {category.is_featured && (
                      <div className="mt-2 flex items-center gap-1 text-yellow-600">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-medium">Popular</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brands Grid (Code remains the same) */}
        {/* ... */}

        {/* Models Grid (Code remains the same, ensures click navigates) */}
        {!loading && models.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>Select Your Device</span>
                {searchQuery && <span className="text-sm text-gray-500 font-normal">(Search results)</span>}
              </h3>
              {models.length >= 4 && !searchQuery && (
                <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors">
                  View All
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleGetExactPrice(model.id)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-teal-500 group"
                >
                  {/* ... Model Card Content ... */}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 🌟 MODERNIZED TRENDING DEVICES SECTION 🌟 --- */}
        {!loading && !selectedCategory && featuredModels.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-teal-600" size={24} />
                <span>Trending Devices</span>
              </h3>
              {/* <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors">
                View All
                <ChevronRight size={18} />
              </button> */}
            </div>
            
            {/* Horizontal Scrolling Container */}
            <div className="flex overflow-x-scroll gap-4 pb-4 -mx-4 px-4 custom-scrollbar-hidden" 
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {featuredModels.map((model) => (
                <motion.div
                  key={model.id}
                  onClick={() => handleGetExactPrice(model.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="flex-shrink-0 w-60 bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer border-2 border-transparent hover:border-teal-500 group"
                >
                  <div className="relative bg-gradient-to-br from-teal-50 to-gray-50 p-3 h-48 flex items-center justify-center">
                    <CachedImage
                      src={(model as any).thumbnail}
                      alt={model.name}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      fallback={<Smartphone className="text-teal-300" size={64} />}
                    />
                    <div className="absolute top-3 right-3 bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                      Hot Deal
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {model.name}
                    </h4>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Max Value</p>
                        <p className="text-xl font-bold text-teal-600">
                          ₹{parseFloat(model.base_price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] px-3 py-1.5 rounded-lg text-sm font-medium shadow-md">
                        Start Selling
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
          </div>
        )}
        {/* --- END TRENDING DEVICES SECTION --- */}

        {/* Empty State (Code remains the same) */}
        {/* ... */}
      </div>
    </section>
  );
};

export default SellOldDevice;