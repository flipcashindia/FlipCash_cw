// src/context/CityContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CityContextType {
  selectedCity: string | null;
  selectedState: string | null;
  selectedPincode: string | null;
  isServiceAvailable: boolean;
  isCityModalOpen: boolean;
  setSelectedCity: (city: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedPincode: (pincode: string) => void;
  setIsServiceAvailable: (available: boolean) => void;
  openCityModal: () => void;
  closeCityModal: () => void;
  clearCitySelection: () => void;
  // --- Added to fix TS2339 build error ---
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CITY: 'flipcash_selected_city',
  STATE: 'flipcash_selected_state',
  PINCODE: 'flipcash_selected_pincode',
  SERVICE_AVAILABLE: 'flipcash_service_available',
};

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to null initially, then fill from storage or defaults
  const [selectedCity, setSelectedCityState] = useState<string | null>(null);
  const [selectedState, setSelectedStateState] = useState<string | null>(null);
  const [selectedPincode, setSelectedPincodeState] = useState<string | null>(null);
  const [isServiceAvailable, setIsServiceAvailableState] = useState<boolean>(true);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const saveToLocalStorage = () => {
    if (selectedCity) localStorage.setItem(STORAGE_KEYS.CITY, selectedCity);
    if (selectedState) localStorage.setItem(STORAGE_KEYS.STATE, selectedState);
    if (selectedPincode) localStorage.setItem(STORAGE_KEYS.PINCODE, selectedPincode);
    localStorage.setItem(STORAGE_KEYS.SERVICE_AVAILABLE, isServiceAvailable.toString());
  };

  const loadFromLocalStorage = () => {
    const city = localStorage.getItem(STORAGE_KEYS.CITY);
    const state = localStorage.getItem(STORAGE_KEYS.STATE);
    const pincode = localStorage.getItem(STORAGE_KEYS.PINCODE);
    const serviceAvailable = localStorage.getItem(STORAGE_KEYS.SERVICE_AVAILABLE);

    // If nothing in storage, default to Delhi
    if (city) {
      setSelectedCityState(city);
    } else {
      setSelectedCityState('Delhi'); 
    }

    if (state) setSelectedStateState(state);
    if (pincode) setSelectedPincodeState(pincode);
    if (serviceAvailable) setIsServiceAvailableState(serviceAvailable === 'true');
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem(STORAGE_KEYS.CITY, city);
  };

  const setSelectedState = (state: string) => {
    setSelectedStateState(state);
    localStorage.setItem(STORAGE_KEYS.STATE, state);
  };

  const setSelectedPincode = (pincode: string) => {
    setSelectedPincodeState(pincode);
    localStorage.setItem(STORAGE_KEYS.PINCODE, pincode);
  };

  const setIsServiceAvailable = (available: boolean) => {
    setIsServiceAvailableState(available);
    localStorage.setItem(STORAGE_KEYS.SERVICE_AVAILABLE, available.toString());
  };

  const openCityModal = () => setIsCityModalOpen(true);
  const closeCityModal = () => setIsCityModalOpen(false);

  const clearCitySelection = () => {
    setSelectedCityState('Delhi'); // Reset to default
    setSelectedStateState(null);
    setSelectedPincodeState(null);
    setIsServiceAvailableState(true);
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  const value: CityContextType = {
    selectedCity,
    selectedState,
    selectedPincode,
    isServiceAvailable,
    isCityModalOpen,
    setSelectedCity,
    setSelectedState,
    setSelectedPincode,
    setIsServiceAvailable,
    openCityModal,
    closeCityModal,
    clearCitySelection,
    saveToLocalStorage,
    loadFromLocalStorage,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCityContext = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCityContext must be used within a CityProvider');
  return context;
};