import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2, Home, RefreshCw, MapPin } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import { useCityContext } from '../../context/CityContext';
import type { Brand } from '../../api/types/catalog.types';

// FlipCash Brand Colors
const COLORS = {
  primary: '#FEC925',
  success: '#1B8A05',
  error: '#FF0000',
  text: '#1C1C1B',
};

const ChooseBrand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  
  const { selectedCity, selectedState, openCityModal } = useCityContext();
  
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

    // Just load brands - let the results determine if we show NoService
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

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 
            className="animate-spin mx-auto mb-4" 
            size={64}
            style={{ color: COLORS.primary }}
          />
          <p className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Loading brands...
          </p>
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
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2"
          style={{ borderColor: `${COLORS.error}20` }}
        >
          <div className="text-center mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${COLORS.error}10` }}
            >
              <span style={{ color: COLORS.error }} className="text-3xl">⚠</span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
              Oops!
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={loadBrands}
            className="w-full py-3 rounded-xl font-bold hover:shadow-lg transition text-white"
            style={{ background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.success})` }}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-3 border-2 rounded-xl font-bold hover:bg-opacity-10 transition"
            style={{ 
              borderColor: COLORS.text,
              color: COLORS.text,
            }}
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // Show No Service Page only when category has zero brands/models (not because of search)
  if (!loading && brands.length === 0 && !searchQuery && !error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-gray-100">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
              style={{ backgroundColor: `${COLORS.error}20` }}
            >
              <MapPin size={48} style={{ color: COLORS.error }} />
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: COLORS.text }}
            >
              No Service
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-8 text-gray-600"
            >
              {selectedCity 
                ? `Currently we are not servicing in ${selectedCity}`
                : 'Please select your city to check service availability'
              }
            </motion.p>

            {/* Location Badge */}
            {selectedCity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-gray-100"
              >
                <MapPin size={16} className="text-gray-600" />
                <span className="font-semibold text-gray-700">
                  {selectedCity}
                  {selectedState && `, ${selectedState}`}
                </span>
              </motion.div>
            )}

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Home Button */}
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg text-white"
                style={{ backgroundColor: COLORS.success }}
              >
                <Home size={20} />
                HOME
              </button>

              {/* Change City Button */}
              <button
                onClick={openCityModal}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 border-2 bg-gray-100"
                style={{ 
                  borderColor: '#CCCCCC',
                  color: COLORS.text,
                }}
              >
                <RefreshCw size={20} />
                {selectedCity ? 'CHANGE CITY' : 'SELECT CITY'}
              </button>
            </motion.div>

            {/* Info Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm mt-8 text-gray-600"
            >
              We're expanding to more cities soon! 🚀
            </motion.p>
          </div>
        </motion.div>
      </section>
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
            className="flex items-center gap-2 hover:opacity-80 transition mb-6 font-semibold"
            style={{ color: COLORS.text }}
          >
            <ArrowLeft size={24} />
            Back
          </button>
          
          <h1 
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ color: COLORS.text }}
          >
            Choose Your Brand
          </h1>
          <p className="text-center text-gray-600 text-lg mb-8">
            Select the brand of your device to continue
          </p>

          {/* City Badge */}
          {selectedCity && (
            <div className="text-center mb-4">
              <button
                onClick={openCityModal}
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <MapPin size={16} style={{ color: COLORS.primary }} />
                <span className="text-sm font-semibold text-gray-700">
                  {selectedCity}, {selectedState}
                </span>
                <span className="text-xs" style={{ color: COLORS.primary }}>
                  Change
                </span>
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search for your brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none text-lg font-medium transition"
              style={{
                borderColor: '#CCCCCC',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.primary;
                e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}30`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CCCCCC';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </motion.div>

        {/* Brands Grid */}
        <AnimatePresence mode="wait">
          {filteredBrands.length === 0 && searchQuery ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
                No brands found
              </h3>
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
      className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent relative overflow-hidden"
      style={{
        borderColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* Hover Effect Background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(to bottom right, ${COLORS.primary}05, ${COLORS.success}05)`,
        }}
      />
      
      <div className="relative z-10">
        {/* Logo Container */}
        <div className="w-full h-20 md:h-24 flex items-center justify-center mb-3">
          {logoUrl ? (
            <>
              {!imageLoaded && (
                <div 
                  className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: COLORS.primary }}
                />
              )}
              <img
                src={logoUrl}
                alt={brand.name}
                className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: COLORS.text }}>
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Brand Name */}
        <p 
          className="font-bold text-center transition-colors text-sm md:text-base"
          style={{ color: COLORS.text }}
        >
          {brand.name}
        </p>
      </div>

      {/* Selection Indicator */}
      <div 
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: COLORS.primary }}
      >
        <span className="text-xs font-bold" style={{ color: COLORS.text }}>
          →
        </span>
      </div>
    </motion.button>
  );
};

export default ChooseBrand;