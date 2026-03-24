// src/context/CityContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../api/client/apiClient';

export interface CityContextType {
  selectedCity: string | null;
  selectedState: string | null;
  selectedPincode: string | null;
  isServiceAvailable: boolean;
  isCityModalOpen: boolean;
  setSelectedCity: (city: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedPincode: (pincode: string | null) => void;
  setIsServiceAvailable: (available: boolean) => void;
  openCityModal: () => void;
  closeCityModal: () => void;
  clearCitySelection: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CITY: 'flipcash_selected_city',
  STATE: 'flipcash_selected_state',
  PINCODE: 'flipcash_selected_pincode',
  SERVICE_AVAILABLE: 'flipcash_service_available',
};

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string | null>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.CITY);
    return val && val !== 'null' ? val : 'Delhi';
  });

  const [selectedState, setSelectedStateState] = useState<string | null>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.STATE);
    return val && val !== 'null' ? val : 'Delhi';
  });

  const [selectedPincode, setSelectedPincodeState] = useState<string | null>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.PINCODE);
    return val && val !== 'null' ? val : null;
  });

  const [isServiceAvailable, setIsServiceAvailableState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICE_AVAILABLE);
    if (!stored || stored === 'null' || stored === 'undefined') return true;
    return stored === 'true';
  });

  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  // ============================================================================
  // 🚀 AUTO-UPGRADE: Fetch backend default pincode if missing
  // ============================================================================
  useEffect(() => {
    let isMounted = true;

    const upgradeMissingPincode = async () => {
      // If we have a city but no pincode, let's ask the backend for the default one
      if (selectedCity && !selectedPincode) {
        try {
          const { data } = await apiClient.get(`/locations/cities/?search=${selectedCity}`);
          const matchedCity = data.results?.find((c: any) => c.name === selectedCity);
          
          if (matchedCity && matchedCity.default_pincode && isMounted) {
            setSelectedPincodeState(matchedCity.default_pincode);
            
            // Validate the newly upgraded pincode to ensure it is serviceable
            try {
              const resolveRes = await apiClient.get(`/accounts/pincode-resolve/?q=${matchedCity.default_pincode}`);
              const isAvail = resolveRes.data.serviceable === true || resolveRes.data.serviceable === 'true';
              if (isMounted) setIsServiceAvailableState(isAvail);
            } catch {
              // Fallback if resolve fails but backend gave us the pincode
              if (isMounted) setIsServiceAvailableState(true);
            }
          }
        } catch (error) {
          console.error("Failed to auto-upgrade city pincode:", error);
        }
      }
    };

    upgradeMissingPincode();

    return () => { isMounted = false; };
  }, [selectedCity, selectedPincode]); // Only runs when city changes or pincode is wiped

  // ============================================================================
  // PERSISTENCE
  // ============================================================================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CITY, selectedCity || 'Delhi');
    localStorage.setItem(STORAGE_KEYS.STATE, selectedState || 'Delhi');
    localStorage.setItem(STORAGE_KEYS.SERVICE_AVAILABLE, String(isServiceAvailable));
    if (selectedPincode) {
      localStorage.setItem(STORAGE_KEYS.PINCODE, selectedPincode);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PINCODE);
    }
  }, [selectedCity, selectedState, selectedPincode, isServiceAvailable]);

  // ============================================================================
  // ACTIONS
  // ============================================================================
  const setSelectedCity = (city: string) => setSelectedCityState(city);
  const setSelectedState = (state: string) => setSelectedStateState(state);
  const setSelectedPincode = (pincode: string | null) => setSelectedPincodeState(pincode || null);
  const setIsServiceAvailable = (available: boolean) => setIsServiceAvailableState(available);

  const openCityModal = () => setIsCityModalOpen(true);
  const closeCityModal = () => setIsCityModalOpen(false);

  const clearCitySelection = () => {
    setSelectedCityState('Delhi');
    setSelectedStateState('Delhi');
    setSelectedPincodeState(null);
    setIsServiceAvailableState(true);
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  const value: CityContextType = {
    selectedCity, selectedState, selectedPincode, isServiceAvailable,
    isCityModalOpen, setSelectedCity, setSelectedState, setSelectedPincode,
    setIsServiceAvailable, openCityModal, closeCityModal, clearCitySelection,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCityContext = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCityContext must be used within a CityProvider');
  return context;
};