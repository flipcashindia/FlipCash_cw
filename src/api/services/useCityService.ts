// src/api/services/useCityService.ts

import { useState } from 'react';
import apiClient from '../client/apiClient';
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
  checkPincodeServiceable: (pincode: string) => Promise<boolean>;
  checkCityServiceable: (cityName: string) => Promise<boolean>;
  hasCategoriesInCity: (categoryId: string) => Promise<boolean>;
}

const useCityService = (): UseCityServiceReturn => {
  const {
    selectedCity,
    selectedState,
    isServiceAvailable,
  } = useCityContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived State (Read-only representation of current context)
  const serviceAvailability: ServiceAvailability = {
    isAvailable: isServiceAvailable && !!selectedCity,
    message: !selectedCity
      ? 'Please select your city'
      : !isServiceAvailable
      ? `Service not available in ${selectedCity}`
      : 'Service available',
    needsCitySelection: !selectedCity,
  };

  // ============================================================================
  // 🚀 NEW API: Check specific Pincode using /locations/search/
  // ============================================================================
  const checkPincodeServiceable = async (pincode: string): Promise<boolean> => {
    if (!pincode) return false;

    try {
      setLoading(true);
      setError(null);

      // Hit the new PincodeSearchView
      const { data } = await apiClient.get(`/locations/search/?q=${pincode}`);
      
      // The API returns an array of results. If the pincode exists in an active zone, 
      // it will be returned with type 'pincode'
      const isValid = data.results?.some((result: any) => 
        result.type === 'pincode' && result.pincode === pincode
      );

      return isValid;

    } catch (err: any) {
      console.error('Failed to verify pincode:', err);
      setError('Failed to verify area');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // 🚀 NEW API: Check general City using /locations/cities/
  // ============================================================================
  const checkCityServiceable = async (cityName: string): Promise<boolean> => {
    if (!cityName) return false;

    try {
      setLoading(true);
      setError(null);

      // Hit the CityListView
      const { data } = await apiClient.get(`/locations/cities/?search=${cityName}`);
      
      // Ensure the city exists and is active
      const matchedCity = data.results?.find((c: any) => 
        c.name.toLowerCase() === cityName.toLowerCase() && c.is_active
      );

      return !!matchedCity;

    } catch (err: any) {
      console.error('Failed to verify city:', err);
      setError('Failed to verify city');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // 📦 RETAINED: Check Category Availability
  // ============================================================================
  const hasCategoriesInCity = async (categoryId: string): Promise<boolean> => {
    if (!selectedCity || !selectedState) {
      return false;
    }

    try {
      // Switched from raw axios to apiClient for proper headers and base URL routing
      const response = await apiClient.get(`/catalog/categories/${categoryId}/check-availability/`, {
        params: {
          city: selectedCity,
          state: selectedState,
        },
      });

      return response.data.has_items || false;
    } catch (err: any) {
      console.error('Failed to check category availability:', err);
      
      // If API fails, safely fallback to true so we don't block the user unnecessarily
      return true;
    }
  };

  return {
    serviceAvailability,
    loading,
    error,
    checkPincodeServiceable,
    checkCityServiceable,
    hasCategoriesInCity,
  };
};

export default useCityService;