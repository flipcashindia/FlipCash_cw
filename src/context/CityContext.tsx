// // src/context/CityContext.tsx
// import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// export interface CityContextType {
//   selectedCity: string | null;
//   selectedState: string | null;
//   selectedPincode: string | null;
//   isServiceAvailable: boolean;
//   isCityModalOpen: boolean;
//   setSelectedCity: (city: string) => void;
//   setSelectedState: (state: string) => void;
//   setSelectedPincode: (pincode: string) => void;
//   setIsServiceAvailable: (available: boolean) => void;
//   openCityModal: () => void;
//   closeCityModal: () => void;
//   clearCitySelection: () => void;
//   saveToLocalStorage: () => void;
//   loadFromLocalStorage: () => void;
// }

// const CityContext = createContext<CityContextType | undefined>(undefined);

// const STORAGE_KEYS = {
//   CITY: 'flipcash_selected_city',
//   STATE: 'flipcash_selected_state',
//   PINCODE: 'flipcash_selected_pincode',
//   SERVICE_AVAILABLE: 'flipcash_service_available',
// };

// export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [selectedCity, setSelectedCityState] = useState<string | null>(() => {
//     const val = localStorage.getItem(STORAGE_KEYS.CITY);
//     console.log('Initializing City from Storage:', val);
//     return val && val !== 'null' ? val : 'Delhi';
//   });

//   const [selectedState, setSelectedStateState] = useState<string | null>(() => {
//     const val = localStorage.getItem(STORAGE_KEYS.STATE);
//     console.log('Initializing State from Storage:', val);
//     return val && val !== 'null' ? val : 'Delhi';
//   });

//   const [selectedPincode, setSelectedPincodeState] = useState<string | null>(() => {
//     const val = localStorage.getItem(STORAGE_KEYS.PINCODE);
//     console.log('Initializing Pincode from Storage:', val);
//     return val && val !== 'null' ? val : null;
//   });

//   const [isServiceAvailable, setIsServiceAvailableState] = useState<boolean>(() => {
//     const stored = localStorage.getItem(STORAGE_KEYS.SERVICE_AVAILABLE);
//     console.log('Initializing Service Availability from Storage:', stored);
//     // ✅ If nothing stored yet, default true
//     // ✅ Only trust stored value if it's explicitly 'true' or 'false'
//     if (!stored || stored === 'null' || stored === 'undefined') return true;
//     return stored === 'true';
//   });

//   const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

//   // ✅ Persist everything including serviceability
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.CITY, selectedCity || 'Delhi');
//     console.log('Persisting City:', selectedCity);
//     localStorage.setItem(STORAGE_KEYS.STATE, selectedState || 'Delhi');
//     console.log('Persisting State:', selectedState);
//     localStorage.setItem(STORAGE_KEYS.SERVICE_AVAILABLE, String(isServiceAvailable) || 'true');
//     console.log('Persisting Service Availability:', isServiceAvailable);
//     localStorage.setItem(STORAGE_KEYS.PINCODE, selectedPincode || '110001');
//     console.log('Persisting Pincode:', selectedPincode);
    
//   }, [selectedCity, selectedState, selectedPincode, isServiceAvailable]);

//   const setSelectedCity = (city: string) => setSelectedCityState(city);
//   const setSelectedState = (state: string) => setSelectedStateState(state);
//   const setSelectedPincode = (pincode: string) => setSelectedPincodeState(pincode || null);

//   // ✅ Public setter used by modal — always goes through here
//   const setIsServiceAvailable = (available: boolean) => setIsServiceAvailableState(available);

//   const openCityModal = () => setIsCityModalOpen(true);
//   const closeCityModal = () => setIsCityModalOpen(false);

//   const clearCitySelection = () => {
//     setSelectedCityState('Delhi');
//     setSelectedStateState('Delhi');
//     setSelectedPincodeState('110001');
//     setIsServiceAvailableState(true);
//     Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
//   };

//   const saveToLocalStorage = () => {};
//   const loadFromLocalStorage = () => {};

//   const value: CityContextType = {
//     selectedCity, selectedState, selectedPincode, isServiceAvailable,
//     isCityModalOpen, setSelectedCity, setSelectedState, setSelectedPincode,
//     setIsServiceAvailable, openCityModal, closeCityModal, clearCitySelection,
//     saveToLocalStorage, loadFromLocalStorage,
//   };

//   return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
// };

// export const useCityContext = (): CityContextType => {
//   const context = useContext(CityContext);
//   if (!context) throw new Error('useCityContext must be used within a CityProvider');
//   return context;
// };











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
    console.log('Initializing City from Storage:', val);
    return val && val !== 'null' ? val : 'Delhi';
  });

  const [selectedState, setSelectedStateState] = useState<string | null>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.STATE);
    console.log('Initializing State from Storage:', val);
    return val && val !== 'null' ? val : 'Delhi';
  });

  const [selectedPincode, setSelectedPincodeState] = useState<string | null>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.PINCODE);
    console.log('Initializing Pincode from Storage:', val);
    return val && val !== 'null' ? val : null;
  });

  const [isServiceAvailable, setIsServiceAvailableState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICE_AVAILABLE);
    console.log('Initializing Service Availability from Storage:', stored);
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
          console.log('Fetched city data for auto-upgrade:', data);
          const matchedCity = data.results?.find((c: any) => c.name === selectedCity);
          
          if (matchedCity && matchedCity.default_pincode && isMounted) {
            setSelectedPincodeState(matchedCity.default_pincode);
            
            // Validate the newly upgraded pincode to ensure it is serviceable
            try {
              const resolveRes = await apiClient.get(`/accounts/pincode-resolve/?q=${matchedCity.default_pincode}`);
              console.log('Pincode resolve result for auto-upgrade:', resolveRes.data);
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
    console.log('Persisting City:', selectedCity);
    localStorage.setItem(STORAGE_KEYS.STATE, selectedState || 'Delhi');
    console.log('Persisting State:', selectedState);
    localStorage.setItem(STORAGE_KEYS.SERVICE_AVAILABLE, String(isServiceAvailable));
    console.log('Persisting Service Availability:', isServiceAvailable);
    if (selectedPincode) {
      localStorage.setItem(STORAGE_KEYS.PINCODE, selectedPincode);
      console.log('Persisting Pincode:', selectedPincode);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PINCODE);
      console.log('Removing Pincode from Storage');
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