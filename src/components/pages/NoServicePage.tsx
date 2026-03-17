// src/components/pages/NoServicePage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Globe } from 'lucide-react';
import { useCityContext } from '../../context/CityContext';

const NoServicePage: React.FC = () => {
  const { selectedCity, selectedState, openCityModal } = useCityContext();

  // Use Delhi as fallback to match Navbar default behavior
  const displayCity = selectedCity || 'Delhi';
  const displayState = selectedState || 'Delhi';

  return (
    <section className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 md:p-16 text-center border border-gray-100">
          <div className="relative inline-flex items-center justify-center mb-10">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-[#FEC925]" />
            <div className="relative z-10 flex items-center justify-center w-28 h-28 rounded-3xl rotate-12 bg-[#FEC925] shadow-lg">
              <MapPin size={56} className="text-white -rotate-12" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-[#1C1C1B]">Out of Bounds</h1>
          <p className="text-lg md:text-xl font-medium leading-relaxed mb-8 px-4 text-[#6C757D]">
            Currently we are not servicing in {displayCity}. We're working hard to bring FlipCash to your doorstep soon!
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-12 border-2 bg-[#F8F9FA] border-[#E9ECEF] text-[#1C1C1B]">
            <MapPin size={18} className="text-[#1DB8A0]" />
            <span className="font-black uppercase tracking-tight text-sm">
              {displayCity}, {displayState}
            </span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={openCityModal}
              className="group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-lg bg-[#FEC925] text-[#1C1C1B] shadow-[0_10px_20px_rgba(254,201,37,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
              CHANGE CITY
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 opacity-60">
            <Globe size={14} className="text-[#1DB8A0]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              FlipCash is active in 500+ major cities across India
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default NoServicePage;