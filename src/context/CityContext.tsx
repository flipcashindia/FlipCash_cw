// CityContext.tsx - Updated to work without AuthContext
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface CityContextType {
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
  // ✅ FIX: Don't call useAuth directly - make it optional
  const [selectedCity, setSelectedCityState] = useState<string | null>(null);
  const [selectedState, setSelectedStateState] = useState<string | null>(null);
  const [selectedPincode, setSelectedPincodeState] = useState<string | null>(null);
  const [isServiceAvailable, setIsServiceAvailableState] = useState<boolean>(true);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // ✅ FIX: Try to get auth context, but don't fail if not available
  useEffect(() => {
    // Dynamically import and use auth if available
    const loadUserAddress = async () => {
      try {
        // Try to get user from localStorage first
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.default_address) {
            const address = user.default_address;
            if (address.city) {
              setSelectedCityState(address.city);
              setSelectedStateState(address.state);
              setSelectedPincodeState(address.postal_code);
              saveToLocalStorage();
            }
          }
        }
      } catch (error) {
        console.warn('Could not load user address:', error);
      }
    };

    loadUserAddress();
  }, []);

  // Auto-open city modal if no city selected on first visit
  useEffect(() => {
    const hasSelectedCity = localStorage.getItem(STORAGE_KEYS.CITY);
    const userStr = localStorage.getItem('user');
    const isAuthenticated = !!userStr;
    
    if (!hasSelectedCity && !isAuthenticated) {
      const timer = setTimeout(() => {
        setIsCityModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

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

  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };

  const clearCitySelection = () => {
    setSelectedCityState(null);
    setSelectedStateState(null);
    setSelectedPincodeState(null);
    setIsServiceAvailableState(true);
    localStorage.removeItem(STORAGE_KEYS.CITY);
    localStorage.removeItem(STORAGE_KEYS.STATE);
    localStorage.removeItem(STORAGE_KEYS.PINCODE);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_AVAILABLE);
  };

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

    if (city) setSelectedCityState(city);
    if (state) setSelectedStateState(state);
    if (pincode) setSelectedPincodeState(pincode);
    if (serviceAvailable) setIsServiceAvailableState(serviceAvailable === 'true');
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
  if (!context) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
};

