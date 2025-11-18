// src/pages/SelectModel.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Model } from '../../api/types/catalog.types';

const SelectModel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brandId, categoryId, brandName } = location.state || {};
  
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');

  useEffect(() => {
    if (!brandId || !categoryId) {
      navigate('/');
      return;
    }
    loadModels();
  }, [brandId, categoryId]);

  useEffect(() => {
    filterModels();
  }, [searchQuery, priceRange, models]);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await catalogService.getModelsByBrandAndCategory(brandId, categoryId);
      // console.log('model data in tsx file : ', data);
      
      const activeModels = data.filter(m => m.id);
      setModels(activeModels);
      setFilteredModels(activeModels);
    } catch (error: any) {
      console.error('Failed to load models:', error);
      setError(error.message || 'Failed to load models. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterModels = () => {
    let filtered = [...models];

    // Search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(m => {
        const price = Number(m.base_price);
        if (priceRange === 'budget') return price < 10000;
        if (priceRange === 'mid') return price >= 10000 && price < 30000;
        if (priceRange === 'premium') return price >= 30000;
        return true;
      });
    }

    setFilteredModels(filtered);
  };

  const handleModelClick = (model: Model) => {
    navigate('/device-stepper', {
      state: {
        categoryId,
        brandId,
        modelId: model.id,
        brandName,
        modelName: model.name,
        model
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={48} />
          <p className="text-[#1C1C1B] text-lg md:text-xl font-semibold">Loading models...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#FF0000]/20"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#FF0000] text-2xl md:text-3xl">⚠</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1C1C1B] mb-2">Oops!</h2>
            <p className="text-gray-600 text-sm md:text-base">{error}</p>
          </div>
          <button
            onClick={loadModels}
            className="w-full py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition mb-3 text-sm md:text-base"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 border-2 border-[#1C1C1B] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#1C1C1B] hover:text-white transition text-sm md:text-base"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-4 md:py-8 lg:py-16">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1C1C1B] hover:text-[#FEC925] transition mb-4 md:mb-6 font-semibold text-sm md:text-base"
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
            Back
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1C1B] text-center mb-2">
            Select Your Model
          </h1>
          <p className="text-center text-gray-600 text-base sm:text-lg mb-1 md:mb-2">
            {brandName} Models
          </p>
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 md:mb-8">
            {models.length} models available
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-4 md:mb-6">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for your model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none text-sm md:text-lg font-medium transition"
            />
          </div>
        </motion.div>

        {/* Models Grid */}
        <AnimatePresence mode="wait">
          {filteredModels.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 md:py-16 px-4"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Search className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1C1C1B] mb-2">No models found</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition text-sm md:text-base"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-7xl mx-auto"
            >
              {filteredModels.map((model, index) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onClick={() => handleModelClick(model)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

interface ModelCardProps {
  model: Model;
  onClick: () => void;
  index: number;
}

// Update just the ModelCard component in SelectModel.tsx

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick, index }) => {
  const imageUrl = useImageCache(model.thumbnail);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group bg-white p-2.5 sm:p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl md:hover:shadow-2xl transition-all text-left border-2 border-transparent hover:border-[#FEC925] relative overflow-hidden w-full"
    >
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FEC925]/5 to-[#1B8A05]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Image Container - Larger image with minimal padding */}
        <div className="w-full aspect-square sm:h-32 md:h-36 lg:h-44 flex items-center justify-center mb-2 sm:mb-2.5 md:mb-3 bg-[#F5F5F5] rounded-lg md:rounded-xl overflow-hidden">
          {imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 border-3 md:border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin" />
              )}
              <img
                src={imageUrl}
                alt={model.name}
                className={`w-full h-full object-contain p-0.5 sm:p-1 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">📱</div>
          )}
        </div>

        {/* Model Info - Larger text */}
        <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-[#1C1C1B] mb-2 sm:mb-2.5 line-clamp-2 group-hover:text-[#1B8A05] transition leading-tight min-h-[36px] sm:min-h-[40px] md:min-h-[48px]">
          {model.name}
        </h3>

        {/* Base Price - Larger text */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-2.5 md:mt-3 pt-2 sm:pt-2.5 md:pt-3 border-t border-gray-200 gap-0.5 sm:gap-0">
          <span className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">Get Upto:</span>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#1B8A05]">
            ₹{Number(model.base_price).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Get Quote Badge - Larger text for desktop */}
        <div className="hidden sm:block mt-3 md:mt-4 py-2 md:py-2.5 px-3 md:px-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-lg font-bold text-center text-sm md:text-base lg:text-lg opacity-0 group-hover:opacity-100 transition-opacity">
          Get Instant Quote →
        </div>

        {/* Mobile-only CTA indicator - Larger text */}
        <div className="sm:hidden mt-2 flex items-center justify-center gap-1 text-[#1B8A05] text-xs font-bold">
          <span>Tap for quote</span>
          <span>→</span>
        </div>
      </div>
    </motion.button>
  );
};
export default SelectModel;