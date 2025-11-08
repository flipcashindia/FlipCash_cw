/**
 * Sell Flow Context - Manages device selling flow state
 * ✅ COMPLETELY REWRITTEN: Proper context structure, type safety
 */

import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { Model, PriceEstimateResponse } from '../api/types/catalog.types';
import type { UserAddress } from '../api/types/auth.types';

// ✅ Device Details State
interface DeviceDetails {
  category: string;
  categoryName: string;
  brand: string;
  brandName: string;
  model: string;
  modelData: Model;
  storage?: string;
  ram?: string;
  color?: string;
  imei?: string;
  conditionInputs: Record<string, any>;
  photos: File[];
  photoUrls: string[];
}

// ✅ Pricing State
interface PricingDetails {
  estimate: PriceEstimateResponse | null;
  estimateId: string | null;
  basePrice: string;
  finalPrice: string;
  deductions: Array<{ reason: string; value: string; amount: string }>;
}

// ✅ Pickup State
interface PickupDetails {
  address: UserAddress | null;
  addressId: string | null;
  preferredDate: string | null;
  timeSlot: string | null;
}

// ✅ Complete Sell Flow State
interface SellFlowState {
  // Step tracking
  currentStep: 'category' | 'brand' | 'model' | 'variant' | 'condition' | 'photos' | 'estimate' | 'address' | 'schedule' | 'preview' | 'success';
  
  // Device details
  device: DeviceDetails | null;
  
  // Pricing
  pricing: PricingDetails | null;
  
  // Pickup
  pickup: PickupDetails;
  
  // Lead
  leadId: string | null;
  leadNumber: string | null;
}

interface SellFlowContextType {
  state: SellFlowState;
  
  // Step navigation
  setStep: (step: SellFlowState['currentStep']) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Device actions
  setCategory: (categoryId: string, categoryName: string) => void;
  setBrand: (brandId: string, brandName: string) => void;
  setModel: (modelId: string, modelData: Model) => void;
  setVariant: (storage?: string, ram?: string, color?: string) => void;
  setCondition: (conditionInputs: Record<string, any>) => void;
  setPhotos: (photos: File[], photoUrls: string[]) => void;
  setIMEI: (imei: string) => void;
  
  // Pricing actions
  setPricing: (estimate: PriceEstimateResponse) => void;
  
  // Pickup actions
  setAddress: (address: UserAddress) => void;
  setSchedule: (date: string, timeSlot: string) => void;
  
  // Lead actions
  setLead: (leadId: string, leadNumber: string) => void;
  
  // Reset
  resetFlow: () => void;
}

const initialState: SellFlowState = {
  currentStep: 'category',
  device: null,
  pricing: null,
  pickup: {
    address: null,
    addressId: null,
    preferredDate: null,
    timeSlot: null,
  },
  leadId: null,
  leadNumber: null,
};

const SellFlowContext = createContext<SellFlowContextType | undefined>(undefined);

export const SellFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SellFlowState>(initialState);

  // ============================================================================
  // STEP NAVIGATION
  // ============================================================================

  const setStep = (step: SellFlowState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const nextStep = () => {
    const steps: SellFlowState['currentStep'][] = [
      'category', 'brand', 'model', 'variant', 'condition', 'photos', 
      'estimate', 'address', 'schedule', 'preview', 'success'
    ];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: SellFlowState['currentStep'][] = [
      'category', 'brand', 'model', 'variant', 'condition', 'photos', 
      'estimate', 'address', 'schedule', 'preview', 'success'
    ];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  // ============================================================================
  // DEVICE ACTIONS
  // ============================================================================

  const setCategory = (categoryId: string, categoryName: string) => {
    setState(prev => ({
      ...prev,
      device: {
        category: categoryId,
        categoryName,
        brand: '',
        brandName: '',
        model: '',
        modelData: {} as Model,
        conditionInputs: {},
        photos: [],
        photoUrls: [],
      },
    }));
  };

  const setBrand = (brandId: string, brandName: string) => {
    setState(prev => ({
      ...prev,
      device: prev.device ? {
        ...prev.device,
        brand: brandId,
        brandName,
      } : null,
    }));
  };

  const setModel = (modelId: string, modelData: Model) => {
    setState(prev => ({
      ...prev,
      device: prev.device ? {
        ...prev.device,
        model: modelId,
        modelData,
      } : null,
    }));
  };

  const setVariant = (storage?: string, ram?: string, color?: string) => {
    setState(prev => ({
      ...prev,
      device: prev.device ? {
        ...prev.device,
        storage,
        ram,
        color,
      } : null,
    }));
  };

  const setCondition = (conditionInputs: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      device: prev.device ? {
        ...prev.device,
        conditionInputs,
      } : null,
    }));
  };

  const setPhotos = (photos: File[], photoUrls: string[]) => {
    setState(prev => ({
      ...prev,
      device: prev.device ? {
        ...prev.device,
        photos,
        photoUrls,
      } : null,
    }));
  };

  const setIMEI = (imei: string) => {
    setState(prev => ({
      ...prev,
      device: prev.device ? {
        ...prev.device,
        imei,
      } : null,
    }));
  };

  // ============================================================================
  // PRICING ACTIONS
  // ============================================================================

  const setPricing = (estimate: PriceEstimateResponse) => {
    setState(prev => ({
      ...prev,
      pricing: {
        estimate,
        estimateId: estimate.estimate_id,
        basePrice: estimate.base_price,
        finalPrice: estimate.final_price,
        deductions: estimate.deductions,
      },
    }));
  };

  // ============================================================================
  // PICKUP ACTIONS
  // ============================================================================

  const setAddress = (address: UserAddress) => {
    setState(prev => ({
      ...prev,
      pickup: {
        ...prev.pickup,
        address,
        addressId: address.id,
      },
    }));
  };

  const setSchedule = (date: string, timeSlot: string) => {
    setState(prev => ({
      ...prev,
      pickup: {
        ...prev.pickup,
        preferredDate: date,
        timeSlot,
      },
    }));
  };

  // ============================================================================
  // LEAD ACTIONS
  // ============================================================================

  const setLead = (leadId: string, leadNumber: string) => {
    setState(prev => ({
      ...prev,
      leadId,
      leadNumber,
    }));
  };

  // ============================================================================
  // RESET
  // ============================================================================

  const resetFlow = () => {
    setState(initialState);
  };

  return (
    <SellFlowContext.Provider value={{
      state,
      setStep,
      nextStep,
      prevStep,
      setCategory,
      setBrand,
      setModel,
      setVariant,
      setCondition,
      setPhotos,
      setIMEI,
      setPricing,
      setAddress,
      setSchedule,
      setLead,
      resetFlow,
    }}>
      {children}
    </SellFlowContext.Provider>
  );
};

export const useSellFlow = (): SellFlowContextType => {
  const context = useContext(SellFlowContext);
  if (!context) {
    throw new Error('useSellFlow must be used within SellFlowProvider');
  }
  return context;
};