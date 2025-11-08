import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2, Filter } from 'lucide-react';
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
      console.log('model data in tsx file : ', data);
      
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
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading models...</p>
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
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#FF0000]/20"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#FF0000] text-3xl">⚠</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1C1C1B] mb-2">Oops!</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={loadModels}
            className="w-full py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition mb-3"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 border-2 border-[#1C1C1B] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#1C1C1B] hover:text-white transition"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1C1C1B] hover:text-[#FEC925] transition mb-6 font-semibold"
          >
            <ArrowLeft size={24} />
            Back
          </button>

          <h1 className="text-3xl md:text-5xl font-bold text-[#1C1C1B] text-center mb-2">
            Select Your Model
          </h1>
          <p className="text-center text-gray-600 text-lg mb-2">
            {brandName} Models
          </p>
          <p className="text-center text-sm text-gray-500 mb-8">
            {models.length} models available
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search for your model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none text-lg font-medium transition"
            />
          </div>

          {/* Price Range Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Filter size={20} className="text-[#1C1C1B]" />
              <span className="font-semibold text-[#1C1C1B]">Filter by Price:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'all', label: 'All Models' },
                { value: 'budget', label: 'Under ₹10K' },
                { value: 'mid', label: '₹10K - ₹30K' },
                { value: 'premium', label: 'Above ₹30K' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setPriceRange(filter.value as any)}
                  className={`py-3 px-4 rounded-xl font-semibold transition ${
                    priceRange === filter.value
                      ? 'bg-[#FEC925] text-[#1C1C1B] shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#FEC925]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
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
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1C1B] mb-2">No models found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
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

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick, index }) => {
  const imageUrl = useImageCache(model.thumbnail);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left border-2 border-transparent hover:border-[#FEC925] relative overflow-hidden"
    >
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FEC925]/5 to-[#1B8A05]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Image Container */}
        <div className="w-full h-40 flex items-center justify-center mb-4 bg-[#F5F5F5] rounded-xl overflow-hidden">
          {imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="w-12 h-12 border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin" />
              )}
              <img
                src={imageUrl}
                alt={model.name}
                className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="text-6xl">📱</div>
          )}
        </div>

        {/* Model Info */}
        <h3 className="font-bold text-lg text-[#1C1C1B] mb-2 line-clamp-2 group-hover:text-[#1B8A05] transition">
          {model.name}
        </h3>

        {/* Base Price */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 font-semibold">Base Price:</span>
          <span className="text-xl font-bold text-[#1B8A05]">
            ₹{Number(model.base_price).toLocaleString()}
          </span>
        </div>

        {/* Get Quote Badge */}
        <div className="mt-4 py-2 px-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-lg font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
          Get Instant Quote →
        </div>
      </div>
    </motion.button>
  );
};

export default SelectModel;