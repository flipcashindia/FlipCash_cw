// useCityService.ts
// Custom hook to check if service is available in selected city/state

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCityContext } from '../../context/CityContext';

interface ServiceAvailability {
  isAvailable: boolean;
  message: string;
  needsCitySelection: boolean;
}

interface UseCityServiceReturn {
  serviceAvailability: ServiceAvailability;
  loading: boolean;
  error: string | null;
  checkServiceAvailability: () => Promise<void>;
  hasCategoriesInCity: (categoryId: string) => Promise<boolean>;
}

const useCityService = (): UseCityServiceReturn => {
  const {
    selectedCity,
    selectedState,
    selectedPincode,
    isServiceAvailable,
    setIsServiceAvailable,
  } = useCityContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceAvailability: ServiceAvailability = {
    isAvailable: isServiceAvailable && !!selectedCity,
    message: !selectedCity
      ? 'Please select your city'
      : !isServiceAvailable
      ? `Service not available in ${selectedCity}`
      : 'Service available',
    needsCitySelection: !selectedCity,
  };

  // Check service availability when city changes
  useEffect(() => {
    if (selectedCity && selectedState) {
      checkServiceAvailability();
    }
  }, [selectedCity, selectedState]);

  const checkServiceAvailability = async (): Promise<void> => {
    if (!selectedCity || !selectedState) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if city is active for service
      const response = await axios.get('/api/ops/check-service-availability/', {
        params: {
          city: selectedCity,
          state: selectedState,
          pincode: selectedPincode,
        },
      });

      const isAvailable = response.data.is_available || false;
      setIsServiceAvailable(isAvailable);
    } catch (err: any) {
      console.error('Failed to check service availability:', err);
      setError('Failed to check service availability');
      
      // If API fails, assume service is available
      setIsServiceAvailable(true);
    } finally {
      setLoading(false);
    }
  };

  const hasCategoriesInCity = async (categoryId: string): Promise<boolean> => {
    if (!selectedCity || !selectedState) {
      return false;
    }

    try {
      // Check if category has items available in this city
      const response = await axios.get(`/api/catalog/categories/${categoryId}/check-availability/`, {
        params: {
          city: selectedCity,
          state: selectedState,
        },
      });

      return response.data.has_items || false;
    } catch (err: any) {
      console.error('Failed to check category availability:', err);
      
      // If API fails, assume category has items
      return true;
    }
  };

  return {
    serviceAvailability,
    loading,
    error,
    checkServiceAvailability,
    hasCategoriesInCity,
  };
};

export default useCityService;