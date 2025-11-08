import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Brand } from '../../api/types/catalog.types';

const ChooseBrand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!categoryId) {
      navigate('/');
      return;
    }
    loadBrands();
  }, [categoryId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brands]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await catalogService.getBrandsByCategory(categoryId);
      const activeBrands = data.filter(b => b.is_active);
      setBrands(activeBrands);
      setFilteredBrands(activeBrands);
    } catch (error: any) {
      console.error('Failed to load brands:', error);
      setError(error.message || 'Failed to load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brand: Brand) => {
    navigate('/select-model', { 
      state: { 
        brandId: brand.id, 
        categoryId,
        brandName: brand.name 
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
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading brands...</p>
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
            onClick={loadBrands}
            className="w-full py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-3 border-2 border-[#1C1C1B] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#1C1C1B] hover:text-white transition"
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
          
          <h1 className="text-3xl md:text-5xl font-bold text-[#1C1C1B] text-center mb-4">
            Choose Your Brand
          </h1>
          <p className="text-center text-gray-600 text-lg mb-8">
            Select the brand of your device to continue
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search for your brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none text-lg font-medium transition"
            />
          </div>
        </motion.div>

        {/* Brands Grid */}
        <AnimatePresence mode="wait">
          {filteredBrands.length === 0 ? (
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
              <h3 className="text-2xl font-bold text-[#1C1C1B] mb-2">No brands found</h3>
              <p className="text-gray-600">Try adjusting your search</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto"
            >
              {filteredBrands.map((brand, index) => (
                <BrandCard 
                  key={brand.id} 
                  brand={brand} 
                  onClick={() => handleBrandClick(brand)}
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

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
  index: number;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onClick, index }) => {
  const logoUrl = useImageCache(brand.logo_url);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#FEC925] relative overflow-hidden"
    >
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FEC925]/5 to-[#1B8A05]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        {/* Logo Container */}
        <div className="w-full h-20 md:h-24 flex items-center justify-center mb-3">
          {logoUrl ? (
            <>
              {!imageLoaded && (
                <div className="w-12 h-12 border-4 border-[#FEC925] border-t-transparent rounded-full animate-spin" />
              )}
              <img
                src={logoUrl}
                alt={brand.name}
                className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#1C1C1B]">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Brand Name */}
        <p className="font-bold text-center text-[#1C1C1B] group-hover:text-[#1B8A05] transition-colors text-sm md:text-base">
          {brand.name}
        </p>
      </div>

      {/* Selection Indicator */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-[#FEC925] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[#1C1C1B] text-xs font-bold">→</span>
      </div>
    </motion.button>
  );
};

export default ChooseBrand;