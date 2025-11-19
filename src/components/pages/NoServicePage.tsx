// NoServicePage.tsx
// Shows when service is not available in selected city or category has zero items

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCityContext } from '../../context/CityContext';

// FlipCash Brand Colors
const COLORS = {
  primary: '#FEC925',     // Yellow
  success: '#1B8A05',     // Green
  error: '#FF0000',       // Red
  text: '#1C1C1B',        // Black
  lightGray: '#F5F5F5',
  mediumGray: '#CCCCCC',
  darkGray: '#666666',
};

interface NoServicePageProps {
  cityName?: string;
  stateName?: string;
  message?: string;
  onChangeCity?: () => void;
}

const NoServicePage: React.FC<NoServicePageProps> = ({
  cityName,
  stateName,
  message,
  onChangeCity,
}) => {
  const navigate = useNavigate();
  const { selectedCity, selectedState, openCityModal } = useCityContext();

  const displayCity = cityName || selectedCity || 'your area';
  const displayState = stateName || selectedState || '';
  const displayMessage = message || `Currently we are not servicing in ${displayCity}`;

  const handleGoHome = () => {
    navigate('/');
  };

  const handleChangeCity = () => {
    if (onChangeCity) {
      onChangeCity();
    } else {
      openCityModal();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full"
      >
        {/* Card */}
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
            className="text-lg md:text-xl mb-8"
            style={{ color: COLORS.darkGray }}
          >
            {displayMessage}
          </motion.p>

          {/* Location Badge */}
          {(displayCity || displayState) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.darkGray,
              }}
            >
              <MapPin size={16} />
              <span className="font-semibold">
                {displayCity}
                {displayState && `, ${displayState}`}
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
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                backgroundColor: COLORS.success,
                color: 'white',
              }}
            >
              <Home size={20} />
              HOME
            </button>

            {/* Change City Button */}
            <button
              onClick={handleChangeCity}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 border-2"
              style={{
                backgroundColor: COLORS.lightGray,
                borderColor: COLORS.mediumGray,
                color: COLORS.text,
              }}
            >
              <RefreshCw size={20} />
              CHANGE CITY
            </button>
          </motion.div>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm mt-8"
            style={{ color: COLORS.darkGray }}
          >
            We're expanding to more cities soon! 🚀
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default NoServicePage;