import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Star, TrendingUp, Smartphone, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Category, Brand, Model } from '../../api/types/catalog.types';
import { useNavigate } from 'react-router-dom';
interface CategoryWithCount extends Category {
  models_count?: number;
}

interface BrandWithCount extends Brand {
  models_count?: number;
}

// Image component with cache and fallback
const CachedImage: React.FC<{ 
  src: string | null | undefined; 
  alt: string; 
  className?: string;
  fallback?: React.ReactNode;
}> = ({ src, alt, className, fallback }) => {
  const cachedSrc = useImageCache(src);
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
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

const SellOldDevice: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [brands, setBrands] = useState<BrandWithCount[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch categories on mount
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
      // Show featured models from this category
      loadFeaturedModelsForCategory(selectedCategory);
    }
  }, [selectedCategory, selectedBrand]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await catalogService.getCategories();
      setCategories(data as CategoryWithCount[]);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Failed to load categories');
      // Set fallback data for better UX
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate('/select-brand', { state: { categoryId } });
  };

  const loadBrands = async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await catalogService.getBrandsByCategory(categoryId);
      
      // Sort by models_count and get top 4
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
    try {
      setLoading(true);
      setError(null);
      const data = await catalogService.getModelsByBrandAndCategory(brandId, categoryId);
      
      // Get top 4 models
      setModels(data.slice(0, 4));
    } catch (err: any) {
      console.error('Failed to load models:', err);
      setError(err.message || 'Failed to load models');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedModels = async () => {
    try {
      const data = await catalogService.getFeaturedModels();
      setFeaturedModels(data.slice(0, 4));
    } catch (err) {
      console.error('Failed to load featured models:', err);
      setFeaturedModels([]);
    }
  };

  const loadFeaturedModelsForCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      // Get all brands for this category first
      const brandsData = await catalogService.getBrandsByCategory(categoryId);
      
      if (brandsData.length > 0) {
        // Get models from first brand
        const modelsData = await catalogService.getModelsByBrandAndCategory(
          brandsData[0].id,
          categoryId
        );
        setModels(modelsData.slice(0, 4));
      } else {
        setModels([]);
      }
    } catch (err: any) {
      console.error('Failed to load category models:', err);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      // Reset to current selection
      if (selectedCategory && selectedBrand) {
        loadModels(selectedCategory, selectedBrand);
      } else if (selectedCategory) {
        loadFeaturedModelsForCategory(selectedCategory);
      }
      return;
    }

    try {
      setSearchLoading(true);
      const results = await catalogService.searchModels(query);
      setModels(results.slice(0, 4));
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setError(null);
  };

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    setSearchQuery('');
    setError(null);
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchQuery('');
    setModels([]);
    setBrands([]);
    setError(null);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const selectedBrandData = brands.find(b => b.id === selectedBrand);

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
        <div className="max-w-2xl mx-auto mb-8">
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
        </div>

        {/* Breadcrumb */}
        {(selectedCategory || selectedBrand) && (
          <div className="max-w-4xl mx-auto mb-6 flex items-center gap-2 text-sm bg-white rounded-lg px-4 py-3 shadow-sm">
            <button
              onClick={resetSelection}
              className="text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors"
            >
              All Categories
            </button>
            {selectedCategoryData && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <button
                  onClick={() => {
                    setSelectedBrand(null);
                    setModels([]);
                  }}
                  className={`font-medium transition-colors ${
                    selectedBrand 
                      ? 'text-teal-600 hover:text-teal-700 hover:underline' 
                      : 'text-gray-700'
                  }`}
                >
                  {selectedCategoryData.name}
                </button>
              </>
            )}
            {selectedBrandData && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-700 font-medium">
                  {selectedBrandData.name}
                </span>
              </>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-700 font-medium">Unable to load data</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    if (selectedCategory && selectedBrand) {
                      loadModels(selectedCategory, selectedBrand);
                    } else if (selectedCategory) {
                      loadBrands(selectedCategory);
                    } else {
                      loadCategories();
                    }
                  }}
                  className="text-red-700 hover:text-red-800 text-sm font-medium mt-2 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="text-center py-16">
            <Loader2 className="inline-block animate-spin text-teal-600 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Loading devices...</p>
          </div>
        )}

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
                  onClick={() =>  handleCategoryClick(category.id)}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-500 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <CachedImage
                      src={category.icon_url}
                      alt={category.title}
                      className="w-16 h-16 mb-4 object-contain group-hover:scale-110 transition-transform duration-300"
                      fallback={<Smartphone className="text-teal-400" size={32} />}
                    />
                    <h4 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.title}
                    </h4>
                    {category.models_count !== undefined && (
                      <p className="text-sm text-gray-500">
                        {category.models_count} models
                      </p>
                    )}
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

        {/* Brands Grid */}
        {!loading && selectedCategory && !selectedBrand && brands.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>Select Brand</span>
              <span className="text-sm text-gray-500 font-normal">(Top {brands.length})</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.id)}
                  className="bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-500"
                >
                  <div className="flex flex-col items-center text-center">
                    <CachedImage
                      src={brand.logo}
                      alt={brand.name}
                      className="w-20 h-20 mb-4 object-contain"
                      fallback={
                        <div className="w-20 h-20 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-400">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      }
                    />
                    <h4 className="font-bold text-gray-800 mb-1">{brand.name}</h4>
                    {brand.models_count !== undefined && (
                      <p className="text-sm text-gray-500">
                        {brand.models_count} models
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Models Grid */}
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
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-teal-500 group"
                >
                  {/* Model Image */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-48 flex items-center justify-center overflow-hidden">
                    <CachedImage
                      src={(model as any).thumbnail}
                      alt={model.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      fallback={<Smartphone className="text-gray-300" size={64} />}
                    />
                    {model.is_featured && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star size={12} fill="currentColor" />
                        Hot
                      </div>
                    )}
                  </div>

                  {/* Model Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CachedImage
                        src={(model as any).brand_logo}
                        alt={(model as any).brand_name || 'Brand'}
                        className="w-6 h-6 object-contain"
                        fallback={null}
                      />
                      <span className="text-xs text-gray-500 font-medium">
                        {(model as any).brand_name}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                      {model.name}
                    </h4>
                    
                    {/* Storage Options */}
                    {model.storage_options && model.storage_options.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {model.storage_options.slice(0, 3).map((storage, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium"
                          >
                            {storage}
                          </span>
                        ))}
                        {model.storage_options.length > 3 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{model.storage_options.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Up to</p>
                        <p className="text-xl font-bold text-teal-600">
                          ₹{parseFloat(model.base_price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg">
                        Get Exact Price
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Models - Show when nothing selected */}
        {!loading && !selectedCategory && featuredModels.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-teal-600" size={24} />
                <span>Trending Devices</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-gradient-to-br from-white to-teal-50 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-teal-200 hover:border-teal-500 group"
                >
                  <div className="relative bg-gradient-to-br from-teal-50 to-white p-6 h-48 flex items-center justify-center">
                    <CachedImage
                      src={(model as any).thumbnail}
                      alt={model.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      fallback={<Smartphone className="text-teal-300" size={64} />}
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      Trending
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">
                      {model.name}
                    </h4>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Up to</p>
                        <p className="text-xl font-bold text-teal-600">
                          ₹{parseFloat(model.base_price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all text-sm font-medium shadow-md hover:shadow-lg">
                        Get Exact Price
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedCategory && models.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
            <div className="text-gray-300 mb-4">
              <TrendingUp size={64} className="mx-auto" />
            </div>
            <p className="text-gray-600 text-lg mb-2 font-medium">
              {searchQuery ? 'No devices found for your search' : 'No devices available'}
            </p>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Check back soon for new devices'
              }
            </p>
            <button
              onClick={searchQuery ? () => setSearchQuery('') : resetSelection}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {searchQuery ? 'Clear Search' : 'Back to Categories'}
            </button>
          </div>
        )}

        {/* No Categories State */}
        {!loading && !selectedCategory && categories.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-600 text-lg mb-2 font-medium">
              Unable to load device categories
            </p>
            <p className="text-gray-500 mb-6">
              Please check your connection and try again
            </p>
            <button
              onClick={loadCategories}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SellOldDevice;