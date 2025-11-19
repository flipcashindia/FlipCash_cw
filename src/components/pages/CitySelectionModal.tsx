// CitySelectionModal.tsx
// Modal for selecting state and city when user lands on the website

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
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

interface State {
  id: string;
  name: string;
  is_active: boolean;
}

interface City {
  id: string;
  name: string;
  state: string;
  pincode: string;
  is_active: boolean;
}

const CitySelectionModal: React.FC = () => {
  const {
    isCityModalOpen,
    closeCityModal,
    setSelectedCity,
    setSelectedState,
    setSelectedPincode,
    setIsServiceAvailable,
    saveToLocalStorage,
  } = useCityContext();

  const [step, setStep] = useState<'state' | 'city'>('state');
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [_selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCityModalOpen && step === 'state') {
      fetchStates();
    }
  }, [isCityModalOpen, step]);

  useEffect(() => {
    if (selectedStateId && step === 'city') {
      fetchCities(selectedStateId);
    }
  }, [selectedStateId, step]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Replace with your actual API endpoint
      const response = await axios.get('/api/ops/states/');
      setStates(response.data.results || response.data);
    } catch (err: any) {
      console.error('Failed to fetch states:', err);
      setError('Failed to load states. Please try again.');
      
      // Fallback data for demo
      setStates([
        { id: '1', name: 'Delhi', is_active: true },
        { id: '2', name: 'Maharashtra', is_active: true },
        { id: '3', name: 'Karnataka', is_active: true },
        { id: '4', name: 'Tamil Nadu', is_active: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (stateId: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/ops/cities/?state=${stateId}`);
      setCities(response.data.results || response.data);
    } catch (err: any) {
      console.error('Failed to fetch cities:', err);
      setError('Failed to load cities. Please try again.');
      
      // Fallback data for demo
      setCities([
        { id: '1', name: 'New Delhi', state: 'Delhi', pincode: '110001', is_active: true },
        { id: '2', name: 'Dwarka', state: 'Delhi', pincode: '110075', is_active: true },
        { id: '3', name: 'Rohini', state: 'Delhi', pincode: '110085', is_active: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelect = (state: State) => {
    if (!state.is_active) {
      setError(`Service not available in ${state.name} yet`);
      return;
    }

    setSelectedStateId(state.id);
    setSelectedState(state.name);
    setStep('city');
    setSearchQuery('');
    setError('');
  };

  const handleCitySelect = (city: City) => {
    if (!city.is_active) {
      setSelectedCityId(city.id);
      setSelectedCity(city.name);
      setSelectedPincode(city.pincode);
      setIsServiceAvailable(false);
      saveToLocalStorage();
      closeCityModal();
      return;
    }

    setSelectedCityId(city.id);
    setSelectedCity(city.name);
    setSelectedPincode(city.pincode);
    setIsServiceAvailable(true);
    saveToLocalStorage();
    closeCityModal();
  };

  const handleBack = () => {
    if (step === 'city') {
      setStep('state');
      setSelectedStateId(null);
      setCities([]);
      setSearchQuery('');
      setError('');
    }
  };

  const handleClose = () => {
    // Only allow close if at least state is selected
    if (selectedStateId) {
      closeCityModal();
    }
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.pincode.includes(searchQuery)
  );

  if (!isCityModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6 border-b-2"
            style={{ borderColor: COLORS.mediumGray }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step === 'city' && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                )}
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <MapPin size={24} style={{ color: COLORS.primary }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                    {step === 'state' ? 'Select Your State' : 'Select Your City'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {step === 'state' 
                      ? 'Choose your state to check service availability'
                      : 'Choose your city to continue'
                    }
                  </p>
                </div>
              </div>
              {selectedStateId && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} style={{ color: COLORS.text }} />
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="mt-4 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={step === 'state' ? 'Search states...' : 'Search cities or pincode...'}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: COLORS.mediumGray }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}30`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.mediumGray;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mt-4 p-3 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: `${COLORS.error}20`,
                  color: COLORS.error,
                }}
              >
                <AlertCircle size={20} />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2
                  className="animate-spin mb-4"
                  size={48}
                  style={{ color: COLORS.primary }}
                />
                <p className="text-gray-600">
                  Loading {step === 'state' ? 'states' : 'cities'}...
                </p>
              </div>
            ) : step === 'state' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredStates.map((state) => (
                  <motion.button
                    key={state.id}
                    onClick={() => handleStateSelect(state)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border-2 rounded-xl text-left transition-all"
                    style={{
                      borderColor: state.is_active ? COLORS.mediumGray : `${COLORS.error}40`,
                      backgroundColor: state.is_active ? 'white' : `${COLORS.lightGray}`,
                      opacity: state.is_active ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      if (state.is_active) {
                        e.currentTarget.style.borderColor = COLORS.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (state.is_active) {
                        e.currentTarget.style.borderColor = COLORS.mediumGray;
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold" style={{ color: COLORS.text }}>
                        {state.name}
                      </span>
                      {state.is_active ? (
                        <CheckCircle size={20} style={{ color: COLORS.success }} />
                      ) : (
                        <AlertCircle size={20} style={{ color: COLORS.error }} />
                      )}
                    </div>
                    <p className="text-xs mt-1" style={{ color: COLORS.darkGray }}>
                      {state.is_active ? 'Service Available' : 'Coming Soon'}
                    </p>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredCities.map((city) => (
                  <motion.button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border-2 rounded-xl text-left transition-all"
                    style={{
                      borderColor: city.is_active ? COLORS.mediumGray : `${COLORS.error}40`,
                      backgroundColor: city.is_active ? 'white' : `${COLORS.lightGray}`,
                      opacity: city.is_active ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = city.is_active 
                        ? COLORS.primary 
                        : `${COLORS.error}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = city.is_active 
                        ? COLORS.mediumGray 
                        : `${COLORS.error}40`;
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold" style={{ color: COLORS.text }}>
                          {city.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Pincode: {city.pincode}
                        </div>
                      </div>
                      {city.is_active ? (
                        <CheckCircle size={20} style={{ color: COLORS.success }} />
                      ) : (
                        <AlertCircle size={20} style={{ color: COLORS.error }} />
                      )}
                    </div>
                    <p className="text-xs mt-1" style={{ color: COLORS.darkGray }}>
                      {city.is_active ? 'Service Available' : 'Not Servicing Yet'}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && (
              (step === 'state' && filteredStates.length === 0) ||
              (step === 'city' && filteredCities.length === 0)
            ) && (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  No {step === 'state' ? 'states' : 'cities'} found
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="p-4 border-t-2 text-center"
            style={{
              borderColor: COLORS.mediumGray,
              backgroundColor: COLORS.lightGray,
            }}
          >
            <p className="text-xs" style={{ color: COLORS.darkGray }}>
              🚀 We're rapidly expanding to more cities!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CitySelectionModal;