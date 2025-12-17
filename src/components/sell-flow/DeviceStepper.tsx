// src/pages/DeviceStepper.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  HelpCircle,
  Wallet,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as authService from '../../api/services/authService';
import type { CreateAddressRequest } from '../../api/types/auth.types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Interfaces (keeping all the same) ---
interface DeviceAttribute {
  id: string;
  name: string;
  question_text: string;
  attribute_type: string;
  input_type: string;
  is_boolean: boolean;
  options: string[];
  is_required: boolean;
  display_order: number;
  help_text: string | null;
}
interface EstimateResponse {
  estimate_id: string;
  estimate_number: string;
  final_price: string;
  base_price: string;
  deductions: Array<{ reason: string; amount: string }>;
  additions: Array<{ reason: string; amount: string }>;
  total_deductions: string;
  total_additions: string;
}
interface LeadResponse {
  id: string;
  lead_number: string;
  status_display: string;
}
interface UserAddress {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  type?: string;
}
interface TimeSlot {
  value: string;
  label: string;
}
interface ModelData {
  id: string;
  name: string;
  thumbnail?: string;
  storage_options: string[];
  ram_options: string[];
  color_options: string[];
  images?: Array<{ image_url: string; is_primary: boolean }>;
}
interface LocationState {
  modelId?: string;
  model?: { id: string; name: string; thumbnail: string; };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Error Display Component (Mobile Optimized) ---
interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mb-3 md:mb-6 p-3 md:p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-lg md:rounded-xl flex items-center justify-between"
  >
    <div className="flex items-center gap-2 md:gap-3">
      <AlertTriangle className="text-[#FF0000] flex-shrink-0" size={20} />
      <p className="font-semibold text-[#1C1C1B] text-xs sm:text-sm md:text-base">{message}</p>
    </div>
    <button onClick={onDismiss} className="text-[#FF0000] hover:opacity-70">
      <X size={18} />
    </button>
  </motion.div>
);
//IMEI
const DeviceStepper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { modelId: modelIdFromState, model: modelFromState } = (location.state || {}) as LocationState;
  const modelId = modelIdFromState || modelFromState?.id;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modelDetails, setModelDetails] = useState<ModelData | null>(null);

  const [groupedAttributes, setGroupedAttributes] = useState<Record<string, DeviceAttribute[]>>({});
  const [conditionResponses, setConditionResponses] = useState<Record<string, any>>({});
  
  const [expandedOptionalSections, setExpandedOptionalSections] = useState<Record<string, boolean>>({});

  const [imei, setImei] = useState('');
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState<CreateAddressRequest>({
    type: 'home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false,
  });
  

  const timeSlots: TimeSlot[] = [
    { value: 'morning', label: 'Morning (9AM - 1PM)' },
    { value: 'afternoon', label: 'Afternoon (1PM - 5PM)' },
    { value: 'evening', label: 'Evening (5PM - 9PM)' },
  ];

  useEffect(() => {
    if (modelId) {
      loadStepperData(modelId);
    } else {
      setError('Error: Device model ID is missing. Please select a device to begin.');
      setLoading(false);
    }
  }, [modelId]);

  const loadStepperData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const [modelRes, attrsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/catalog/models/${id}/`),
        fetch(`${API_BASE_URL}/catalog/models/${id}/attributes/`)
      ]);

      if (!modelRes.ok) {
        const err = await modelRes.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to load model details (${modelRes.status})`);
      }
      if (!attrsRes.ok) {
        const err = await attrsRes.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to load device attributes (${attrsRes.status})`);
      }

      const modelData: ModelData = await modelRes.json();
      const attrsData: DeviceAttribute[] = await attrsRes.json();

      const defaultStorage = ['64 GB', '128GB', '256GB', '512GB'];
      const defaultRAM = ['4GB', '6GB', '8GB', '12GB'];
      // const defaultColors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple', 'Graphite'];

      const processedModelDetails: ModelData = {
        ...modelData,
        storage_options: (modelData.storage_options && modelData.storage_options.length > 0)
          ? modelData.storage_options
          : defaultStorage,
        ram_options: (modelData.ram_options && modelData.ram_options.length > 0)
          ? modelData.ram_options
          : defaultRAM,
        // color_options: (modelData.color_options && modelData.color_options.length > 0)
        //   ? modelData.color_options
        //   : defaultColors,
      };

      setModelDetails(processedModelDetails);

      const sorted = attrsData.sort((a, b) => a.display_order - b.display_order);
      const groups = sorted.reduce((acc: Record<string, DeviceAttribute[]>, attr) => {
        const type = capitalize(attr.attribute_type || 'other');
        if (!acc[type]) acc[type] = [];
        acc[type].push(attr);
        return acc;
      }, {});
      setGroupedAttributes(groups);

    } catch (error: any) {
      console.error('Failed to load stepper data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("You must be logged in to select an address.");
      const res = await fetch(`${API_BASE_URL}/accounts/addresses/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to load addresses (${res.status})`);
      }
      const data: UserAddress[] = await res.json();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      return true;
    } catch (error: any) {
      console.error('Failed to load addresses:', error);
      setError(error.message);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await authService.createAddress(addressFormData);
      
      await loadAddresses();
      
      setShowAddressForm(false);
      resetAddressForm();
      
    } catch (error: any) {
      console.error('Failed to create address:', error);
      setError(error.message || 'Failed to create address');
    } finally {
      setLoading(false);
    }
  };

  const resetAddressForm = () => {
    setAddressFormData({
      type: 'home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      is_default: false,
    });
  };

  const handleResponseChange = (name: string, value: any) => {
    setConditionResponses(prev => ({ ...prev, [name]: value }));
  };

  const toggleOptionalSection = (groupName: string) => {
    setExpandedOptionalSections(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleNext = async () => {
    setError(null);

    if (step === 1) {
      if (!modelDetails) {
        setError('Device details are still loading. Please wait a moment.');
        return;
      }
      
      if (modelDetails.storage_options.length > 0 && !conditionResponses['storage']) {
        setError('Please select a storage option.');
        return;
      }
      if (modelDetails.ram_options.length > 0 && !conditionResponses['ram']) {
        setError('Please select a RAM option.');
        return;
      }
      // if (modelDetails.color_options.length > 0 && !conditionResponses['color']) {
      //   setError('Please select a color option.');
      //   return;
      // }
      setStep(2);
    }

    else if (step === 2) {
      const allAttributes = Object.values(groupedAttributes).flat();
      const requiredAttrs = allAttributes.filter(a => a.is_required);
      for (const attr of requiredAttrs) {
        const response = conditionResponses[attr.name];
        if (response === undefined || response === null) {
          setError(`Please answer: ${attr.question_text}`);
          return;
        }
      }
      // new settup to get estimate here
      await handleGetEstimate();
      // setStep(4);
    }

    else if (step === 3) {
      await handleGetEstimate();
    }

    else if (step === 4) {
      const addressesLoaded = await loadAddresses();
      if (addressesLoaded) {
        setStep(5);
      }
    }

    else if (step === 5) {
      if (!selectedAddressId) {
        setError('Please select a pickup address');
        return;
      }
      if (!preferredDate) {
        setError('Please select a preferred date');
        return;
      }
      if (!timeSlot) {
        setError('Please select a time slot');
        return;
      }
      await handleCreateLead();
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleGetEstimate = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("You must be logged in to get an estimate. Please log in and try again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const allResponses = { ...conditionResponses };
      const storage = allResponses['storage'] || null;
      const ram = allResponses['ram'] || null;
      const color = allResponses['color'] || null;
      delete allResponses['storage'];
      delete allResponses['ram'];
      delete allResponses['color'];

      const estimatePayload = {
        device_model: modelId,
        storage: storage,
        ram: ram,
        color: color,
        condition_inputs: allResponses,
        imei: imei || '',
      };

      const estimateRes = await fetch(`${API_BASE_URL}/pricing/estimate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(estimatePayload)
      });

      if (!estimateRes.ok) {
        const err = await estimateRes.json().catch(() => ({}));
        const errorDetail = err.details || err.error || err;
        let errorMessage = 'Failed to get estimate.';
        if (typeof errorDetail === 'object') {
          const firstKey = Object.keys(errorDetail)[0];
          const errorValue = Array.isArray(errorDetail[firstKey])
            ? errorDetail[firstKey].join(' ')
            : JSON.stringify(errorDetail[firstKey]);
          errorMessage = `Error: ${firstKey} - ${errorValue}`;
        } else if (typeof errorDetail === 'string') {
          errorMessage = errorDetail;
        }
        throw new Error(`${errorMessage} (${estimateRes.status})`);
      }

      const estimateData: EstimateResponse = await estimateRes.json();
      setEstimate(estimateData);
      setStep(4);

    } catch (error: any) {
      console.error('Failed to get estimate:', error);
      setError(error.message || 'Failed to process your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !estimate) {
      setError("An error occurred. Please go back and try again.");
      return;
    }

    let newLeadId = '';

    try {
      setLoading(true);
      setError(null);

      const leadPayload = {
        estimate_id: estimate.estimate_id,
        pickup_address_id: selectedAddressId,
        preferred_date: preferredDate,
        time_slot: timeSlots.find(s => s.value === timeSlot)?.label || timeSlot,
        special_instructions: specialInstructions,
      };

      const leadRes = await fetch(`${API_BASE_URL}/leads/leads/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });

      if (!leadRes.ok) {
        const err = await leadRes.json().catch(() => ({}));
        const errorDetail = err.details || err.error || err;
        let errorMessage = 'Failed to create lead.';
        if (typeof errorDetail === 'object') {
          const firstKey = Object.keys(errorDetail)[0];
          const errorValue = Array.isArray(errorDetail[firstKey]) ? errorDetail[firstKey].join(' ') : JSON.stringify(errorDetail[firstKey]);
          errorMessage = `${firstKey}: ${errorValue}`;
        } else if (typeof errorDetail === 'string') {
          errorMessage = errorDetail;
        }
        throw new Error(`${errorMessage} (${leadRes.status})`);
      }

      const leadData: LeadResponse = await leadRes.json();
      newLeadId = leadData.id;

      navigate(`/lead/${newLeadId}`);

    } catch (error: any) {
      console.error('Failed to create lead:', error);
      setError(error.message || 'Failed to create your lead.');
      if (newLeadId) {
        navigate(`/lead/${newLeadId}`);
      }
    } finally {
      setLoading(false);
    }
  };
  



  
  // Update the getNext4Days function to getNext5Days
  const getNext5Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const value = date.toISOString().split('T')[0]; // YYYY-MM-DD format for backend
      
      // Format for display
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' }); // Short day name
      const dateNum = date.getDate();
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
      
      let label = '';
      let shortLabel = '';
      if (i === 1) {
        label = 'Tomorrow';
        shortLabel = 'Tomorrow';
      } else if (i === 2) {
        label = 'Day After';
        shortLabel = 'Day After';
      } else {
        label = `${dayName}, ${dateNum} ${monthName}`;
        shortLabel = `${dayName} ${dateNum}`;
      }
      
      days.push({ 
        value, 
        label, 
        shortLabel,
        dayName,
        dateNum,
        monthName 
      });
    }
    
    return days;
  };

  const availableDates = getNext5Days();
  

  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={48} />
        <p className="text-[#1C1C1B] text-base md:text-xl font-semibold">Loading Device Options...</p>
      </motion.div>
    </div>
  );

  const renderAttributeInput = (attr: DeviceAttribute) => {
    if (attr.is_boolean) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => handleResponseChange(attr.name, "true")}
            className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl font-medium transition-all text-sm md:text-base ${
              conditionResponses[attr.name] === "true"
                ? 'bg-[#1B8A05]/10 border-[#1B8A05] ring-2 ring-[#1B8A05]/50'
                : 'border-gray-300 hover:border-[#FEC925]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleResponseChange(attr.name, "false")}
            className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl font-medium transition-all text-sm md:text-base ${
              conditionResponses[attr.name] === "false"
                ? 'bg-[#FF0000]/10 border-[#FF0000] ring-2 ring-[#FF0000]/50'
                : 'border-gray-300 hover:border-[#FEC925]'
            }`}
          >
            No
          </button>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {attr.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleResponseChange(attr.name, option)}
              className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-center transition-all text-sm md:text-base ${
                conditionResponses[attr.name] === option
                  ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50 font-bold'
                  : 'border-gray-300 hover:border-[#FEC925]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }
  };




  const renderVariantOptions = (title: string, fieldName: 'storage' | 'ram' | 'color', options: string[]) => {
    if (!options || options.length === 0) return null;
    return (
      <fieldset className="space-y-3 md:space-y-4">
        <legend className="text-lg md:text-xl lg:text-2xl font-bold text-[#1C1C1B] pb-2 md:pb-3 border-b-2 border-[#FEC925] flex items-center gap-2">
          {/* Icon based on type */}
          {fieldName === 'storage' && <span className="text-2xl"></span>}
          {fieldName === 'ram' && <span className="text-2xl"></span>}
          {fieldName === 'color' && <span className="text-2xl"></span>}
          <span>
            {title}
            <span className="text-[#FF0000]"> *</span>
          </span>
        </legend>
        <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleResponseChange(fieldName, option)}
              className={`group relative p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-center transition-all text-sm md:text-base font-semibold overflow-hidden ${
                conditionResponses[fieldName] === option
                  ? 'bg-[#FEC925] border-[#FEC925] ring-4 ring-[#FEC925]/30 text-[#1C1C1B] shadow-lg scale-105'
                  : 'bg-white border-gray-300 hover:border-[#FEC925] hover:shadow-md text-gray-700 hover:scale-102'
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-[#FEC925]/10 to-[#1B8A05]/10 opacity-0 group-hover:opacity-100 transition-opacity ${
                conditionResponses[fieldName] === option ? 'opacity-100' : ''
              }`}></div>
              
              {/* Content */}
              <span className="relative z-10 block">
                {option}
              </span>
              
              {/* Selected Check Mark */}
              {conditionResponses[fieldName] === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-[#1B8A05] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={14} className="text-white md:w-4 md:h-4" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </fieldset>
    );
  };




  const renderAttributeGroup = (groupName: string, attrs: DeviceAttribute[]) => {
    const requiredAttrs = attrs.filter(a => a.is_required);
    const optionalAttrs = attrs.filter(a => !a.is_required);
    const isExpanded = expandedOptionalSections[groupName] || false;

    return (
      <fieldset key={groupName} className="space-y-4 md:space-y-6">
        <legend className="text-lg md:text-2xl font-bold text-[#1C1C1B] pb-1.5 md:pb-2 border-b-2 border-[#FEC925]">
          {groupName}
        </legend>
        
        {requiredAttrs.map((attr) => (
          <div key={attr.id} className="border-b border-gray-100 pb-4 md:pb-6">
            <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-2 md:mb-3">
              {attr.question_text}
              <span className="text-[#FF0000]"> *</span>
              {attr.help_text && (
                <span className="group relative ml-2">
                  <HelpCircle size={14} className="text-gray-400 cursor-help inline md:w-4 md:h-4" />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 md:w-48 p-2 bg-[#1C1C1B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {attr.help_text}
                  </span>
                </span>
              )}
            </label>
            {renderAttributeInput(attr)}
          </div>
        ))}

        {optionalAttrs.length > 0 && (
          <div className="mt-3 md:mt-4">
            <button
              type="button"
              onClick={() => toggleOptionalSection(groupName)}
              className="w-full flex items-center justify-between p-3 md:p-4 bg-[#FEC925]/10 border-2 border-[#FEC925]/30 rounded-lg md:rounded-xl hover:bg-[#FEC925]/20 transition-all"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <Info size={16} className="text-[#FEC925] md:w-5 md:h-5" />
                <span className="font-semibold text-[#1C1C1B] text-sm md:text-base">
                  Optional Details ({optionalAttrs.length})
                </span>
                <span className="text-xs md:text-sm text-gray-600 italic hidden sm:inline">
                  Fill for more accurate pricing
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp size={18} className="text-[#1C1C1B] md:w-5 md:h-5" />
              ) : (
                <ChevronDown size={18} className="text-[#1C1C1B] md:w-5 md:h-5" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 md:mt-4 space-y-4 md:space-y-6 pl-3 md:pl-4 border-l-4 border-[#FEC925]/30"
                >
                  {optionalAttrs.map((attr) => (
                    <div key={attr.id} className="max-w-5xl border-b border-gray-100 pb-4 md:pb-6">
                      <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-2 md:mb-3">
                        {attr.question_text}
                        {attr.help_text && (
                          <span className="group relative ml-2">
                            <HelpCircle size={14} className="text-gray-400 cursor-help inline md:w-4 md:h-4" />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 md:w-48 p-2 bg-[#1C1C1B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {attr.help_text}
                            </span>
                          </span>
                        )}
                      </label>
                      {renderAttributeInput(attr)}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </fieldset>
    );
  };

  if (loading && step === 1) {
    return renderLoading();
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-4 md:py-8 lg:py-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">

        {/* Progress Bar - Compact for Mobile Next*/}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Variant', 'Condition', 'Estimate', 'IMEI', 'Pickup'].map((label, idx) => (
              <div key={idx} className="flex-1 text-center last:flex-initial">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full mx-auto mb-1 md:mb-2 flex items-center justify-center font-bold text-sm md:text-lg ${
                  step > idx + 1 ? 'bg-[#1B8A05] text-white' :
                  step === idx + 1 ? 'bg-gradient-to-br from-[#FEC925] to-[#1B8A05] text-[#1C1C1B]' : 'bg-gray-300 text-gray-700'
                }`}>
                  {step > idx + 1 ? <CheckCircle size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" /> : idx + 1}
                </div>
                <p className={`text-[10px] sm:text-xs md:text-sm font-semibold ${
                  step >= idx + 1 ? 'text-[#1C1C1B]' : 'text-gray-500'
                }`}>{label}</p>
              </div>
            ))}
          </div>
          <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FEC925] to-[#1B8A05] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / 4) * 100}%` }}
              transition={{ type: 'spring' }}
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
          )}
        </AnimatePresence>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border-2 border-[#FEC925]/20">
            <AnimatePresence mode="wait">

             {/* Step 1: Variant Selection - Split Layout for Desktop */}
            {step === 1 && modelDetails && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="space-y-4 md:space-y-6"
              >
                {/* Header */}
                <div className="text-center mb-4 md:mb-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1B] mb-1 md:mb-2">
                    Select Device Variant
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600">{modelDetails.name}</p>
                </div>

                {/* Main Content - Responsive Layout */}
                <div className="flex flex-col md:flex-row md:gap-6 lg:gap-8">
                  {/* Left: Image Section - Mobile: Full Width, Desktop: 40% */}
                  <div className="w-full md:w-2/5 lg:w-2/5 mb-4 md:mb-0">
                    <div className="sticky top-4">
                      <div className="w-full aspect-square h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center p-2 border-2 border-gray-200 shadow-lg">
                        <img
                          src={modelDetails.images?.[0]?.image_url || modelFromState?.thumbnail}
                          alt={modelDetails.name}
                          className="max-h-full max-w-full object-contain drop-shadow-2xl"
                        />
                      </div>
                      
                      {/* Device Info Badge - Desktop Only */}
                      <div className="hidden md:block mt-4 p-4 bg-gradient-to-r from-[#FEC925]/10 to-[#1B8A05]/10 rounded-xl border-2 border-[#FEC925]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#1B8A05] rounded-full animate-pulse"></div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Quick Info</p>
                        </div>
                        <h3 className="font-bold text-lg text-[#1C1C1B] mb-1">{modelDetails.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {modelDetails.storage_options.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-white rounded-full border border-gray-200">
                              {modelDetails.storage_options.length} Storage Options
                            </span>
                          )}
                          {modelDetails.ram_options.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-white rounded-full border border-gray-200">
                              {modelDetails.ram_options.length} RAM Options
                            </span>
                          )}
                          {modelDetails.color_options.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-white rounded-full border border-gray-200">
                              {modelDetails.color_options.length} Colors
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Variant Options - Mobile: Full Width, Desktop: 60% */}
                  <div className="w-full md:w-3/5 lg:w-3/5 space-y-4 md:space-y-6">
                    {/* Storage Options */}
                    {renderVariantOptions('Storage', 'storage', modelDetails.storage_options)}
                    
                    {/* RAM Options */}
                    {renderVariantOptions('RAM', 'ram', modelDetails.ram_options)}
                    
                    {/* Color Options
                    {renderVariantOptions('Color', 'color', modelDetails.color_options)} */}
                  </div>
                </div>
              </motion.div>
            )}
              {/* Step 2: Device Condition */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 md:space-y-8">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1C1B] mb-1 md:mb-2">Tell us its condition</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">{modelDetails?.name}</p>
                  </div>
                  {Object.entries(groupedAttributes).map(([groupName, attrs]) => 
                    renderAttributeGroup(groupName, attrs)
                  )}
                </motion.div>
              )}

              {/* Step 3: IMEI */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 md:space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1C1B] mb-1 md:mb-2">Device IMEI</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">(Optional - You can skip this step)</p>
                  </div>
                  
                  <div className="bg-[#FEC925]/10 border-l-4 border-[#FEC925] p-3 md:p-4 rounded-r-lg">
                    <div className="flex items-start gap-2 md:gap-3">
                      <Info size={18} className="text-[#FEC925] flex-shrink-0 mt-0.5 md:w-5 md:h-5" />
                      <div>
                        <p className="text-xs md:text-sm text-[#1C1C1B] font-semibold mb-1">IMEI is Optional</p>
                        <p className="text-xs md:text-sm text-gray-600">
                          You can provide the IMEI number to our pickup partner during device verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-2 md:mb-3">
                      IMEI Number (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={imei} 
                      onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 16))} 
                      placeholder="Enter 15-16 digit IMEI/MEID (optional)" 
                      maxLength={16} 
                      className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition text-sm md:text-base" 
                    />
                    <p className="text-xs md:text-sm text-gray-500 mt-2">
                      Dial <strong className="text-[#1C1C1B]">*#06#</strong> to find your device's IMEI number.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Estimate Display */}
              {step === 4 && estimate && (
                <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 md:space-y-6">
                  <div className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#1B8A05] to-[#FEC925] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
                      <Wallet size={40} className="text-white sm:w-12 sm:h-12 md:w-14 md:h-14" strokeWidth={2} />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1B] mb-1 md:mb-2">We've Calculated Your Price!</h2>
                  </div>
                  <div className="bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4] p-5 md:p-8 rounded-lg md:rounded-xl text-center border-2 border-[#1B8A05]/30">
                    <p className="text-gray-700 font-medium mb-2 text-sm md:text-base">Estimated Price</p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A05] to-[#0a4d03]">
                      ₹{parseFloat(estimate.final_price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-gray-100 p-4 md:p-6 rounded-lg space-y-2 md:space-y-3">
                    {/* <DetailRow label="Base Price" value={`₹${parseFloat(estimate.base_price).toLocaleString('en-IN')}`} />
                    {estimate.additions?.map((add, idx) => (
                      <DetailRow key={`add-${idx}`} label={add.reason} value={`+₹${parseFloat(add.amount).toLocaleString('en-IN')}`} highlight="add" />
                    ))}
                    {estimate.deductions?.map((ded, idx) => (
                      <DetailRow key={`ded-${idx}`} label={ded.reason} value={`-₹${parseFloat(ded.amount).toLocaleString('en-IN')}`} highlight="ded" />
                    ))} */}
                    <div className="border-t-2 border-dashed border-gray-300 pt-2 md:pt-3 flex justify-between font-bold text-base md:text-lg">
                      <span className="text-[#1C1C1B]">Final Estimated Price</span>
                      <span className="text-[#1B8A05]">₹{parseFloat(estimate.final_price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="bg-[#FEC925]/10 border-l-4 border-[#FEC925] p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-[#1C1C1B]"><strong>Note:</strong> This is an estimate. The final price will be confirmed after physical inspection.</p>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Pickup Details */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 md:space-y-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1C1B] text-center">Schedule Pickup</h2>
                  
                  {/* ADDRESS SECTION - Keep as is */}
                  <div>
                    <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-2 md:mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-[#1B8A05] md:w-5 md:h-5" /> Pickup Address *
                    </label>
                    
                    {addresses.length === 0 && !showAddressForm ? (
                      <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <MapPin size={40} className="mx-auto mb-3 md:mb-4 text-gray-400 md:w-12 md:h-12" />
                        <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">No addresses found</p>
                        <button 
                          type="button"
                          onClick={() => {
                            resetAddressForm();
                            setShowAddressForm(true);
                          }} 
                          className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-lg md:rounded-xl font-bold hover:shadow-lg transition text-sm md:text-base"
                        >
                          <Plus size={18} className="md:w-5 md:h-5" />
                          Add New Address
                        </button>
                      </div>
                    ) : addresses.length > 0 && !showAddressForm ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            resetAddressForm();
                            setShowAddressForm(true);
                          }}
                          className="w-full mb-3 md:mb-4 flex items-center justify-center gap-2 p-3 md:p-4 border-2 border-dashed border-[#FEC925] rounded-lg md:rounded-xl text-[#1C1C1B] font-semibold hover:bg-[#FEC925]/10 transition text-sm md:text-base"
                        >
                          <Plus size={18} className="text-[#FEC925] md:w-5 md:h-5" />
                          Add New Address
                        </button>
                        
                        <div className="space-y-2 md:space-y-3 max-h-56 md:max-h-64 overflow-y-auto pr-2">
                          {addresses.map((addr) => (
                            <button 
                              key={addr.id}
                              type="button"
                              onClick={() => setSelectedAddressId(addr.id)} 
                              className={`w-full p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all ${
                                selectedAddressId === addr.id 
                                  ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50' 
                                  : 'border-gray-300 hover:border-[#FEC925]'
                              }`}
                            >
                              <p className="font-bold text-[#1C1C1B] text-sm md:text-base">
                                {addr.type} 
                                {addr.is_default && (
                                  <span className="text-[10px] md:text-xs font-medium bg-[#1B8A05] text-white px-1.5 md:px-2 py-0.5 rounded-full ml-2">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-xs md:text-sm text-gray-700">{addr.line1} {addr.line2}</p>
                              <p className="text-xs md:text-sm text-gray-700">{addr.city}, {addr.state} - {addr.postal_code}</p>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : null}
                    
                    {/* Address Form - Keep as is */}
                    {showAddressForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#F0F7F6] border-2 border-[#FEC925] rounded-lg md:rounded-xl p-4 md:p-6 mb-3 md:mb-4"
                      >
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <h3 className="font-bold text-lg md:text-xl text-[#1C1C1B]">Add New Address</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddressForm(false);
                              resetAddressForm();
                            }}
                            className="text-gray-500 hover:text-[#FF0000] transition"
                          >
                            <X size={20} className="md:w-6 md:h-6" />
                          </button>
                        </div>
                        
                        <form onSubmit={handleCreateAddress} className="space-y-3 md:space-y-4">
                          <div>
                            <label className="block font-semibold text-xs md:text-sm text-[#1C1C1B] mb-1.5 md:mb-2">
                              Address Type *
                            </label>
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                              {['home', 'office', 'other'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAddressFormData({...addressFormData, type: type as 'home' | 'office' | 'other'})}
                                  className={`p-2.5 md:p-3 border-2 rounded-lg text-center font-medium transition-all capitalize text-sm md:text-base ${
                                    addressFormData.type === type
                                      ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50'
                                      : 'border-gray-300 hover:border-[#FEC925]'
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block font-semibold text-xs md:text-sm text-[#1C1C1B] mb-1.5 md:mb-2">
                              Address Line 1 *
                            </label>
                            <input 
                              type="text" 
                              placeholder="House/Flat No., Building Name" 
                              value={addressFormData.line1} 
                              onChange={(e) => setAddressFormData({...addressFormData, line1: e.target.value})} 
                              className="w-full p-2.5 md:p-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition text-sm md:text-base" 
                              required 
                            />
                          </div>
                          
                          <div>
                            <label className="block font-semibold text-xs md:text-sm text-[#1C1C1B] mb-1.5 md:mb-2">
                              Address Line 2 (Optional)
                            </label>
                            <input 
                              type="text" 
                              placeholder="Street, Area, Locality" 
                              value={addressFormData.line2} 
                              onChange={(e) => setAddressFormData({...addressFormData, line2: e.target.value})} 
                              className="w-full p-2.5 md:p-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition text-sm md:text-base" 
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                              <label className="block font-semibold text-xs md:text-sm text-[#1C1C1B] mb-1.5 md:mb-2">
                                City *
                              </label>
                              <input 
                                type="text" 
                                placeholder="City" 
                                value={addressFormData.city} 
                                onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} 
                                className="w-full p-2.5 md:p-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition text-sm md:text-base" 
                                required 
                              />
                            </div>
                            <div>
                              <label className="block font-semibold text-xs md:text-sm text-[#1C1C1B] mb-1.5 md:mb-2">
                                State *
                              </label>
                              <input 
                                type="text" 
                                placeholder="State" 
                                value={addressFormData.state} 
                                onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})} 
                                className="w-full p-2.5 md:p-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition text-sm md:text-base" 
                                required 
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block font-semibold text-xs md:text-sm text-[#1C1C1B] mb-1.5 md:mb-2">
                              Pincode *
                            </label>
                            <input 
                              type="text" 
                              placeholder="6-digit pincode" 
                              value={addressFormData.postal_code} 
                              onChange={(e) => setAddressFormData({...addressFormData, postal_code: e.target.value.replace(/\D/g, '').slice(0, 6)})} 
                              className="w-full p-2.5 md:p-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition text-sm md:text-base" 
                              maxLength={6}
                              required 
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 md:gap-3">
                            <input 
                              type="checkbox" 
                              id="is_default"
                              checked={addressFormData.is_default}
                              onChange={(e) => setAddressFormData({...addressFormData, is_default: e.target.checked})}
                              className="w-4 h-4 md:w-5 md:h-5 rounded border-2 border-gray-300 text-[#FEC925] focus:ring-[#FEC925]"
                            />
                            <label htmlFor="is_default" className="font-medium text-[#1C1C1B] cursor-pointer text-xs md:text-sm">
                              Set as default address
                            </label>
                          </div>
                          
                          <div className="flex gap-2 md:gap-3 pt-2">
                            <button 
                              type="button" 
                              onClick={() => {
                                setShowAddressForm(false);
                                resetAddressForm();
                              }} 
                              className="flex-1 py-2.5 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl font-semibold text-[#1C1C1B] hover:bg-gray-50 transition text-sm md:text-base"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              disabled={loading} 
                              className="flex-1 py-2.5 md:py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-lg md:rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition text-sm md:text-base"
                            >
                              {loading ? 'Saving...' : 'Save Address'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* ✅ NEW: DATE SELECTION WITH BUTTONS (5 Days) */}
                  <div>
                    <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-3 md:mb-4 flex items-center gap-2">
                      <Calendar size={18} className="text-[#1B8A05] md:w-5 md:h-5" /> 
                      Preferred Pickup Date *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                      {availableDates.map((date) => (
                        <button
                          key={date.value}
                          type="button"
                          onClick={() => setPreferredDate(date.value)}
                          className={`group relative p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-center transition-all overflow-hidden ${
                            preferredDate === date.value
                              ? 'bg-[#FEC925] border-[#FEC925] ring-4 ring-[#FEC925]/30 text-[#1C1C1B] shadow-lg scale-105'
                              : 'bg-white border-gray-300 hover:border-[#FEC925] hover:shadow-md text-gray-700 hover:scale-102'
                          }`}
                        >
                          {/* Gradient Background */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-[#FEC925]/10 to-[#1B8A05]/10 opacity-0 group-hover:opacity-100 transition-opacity ${
                            preferredDate === date.value ? 'opacity-100' : ''
                          }`}></div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <p className="text-xs md:text-sm font-bold uppercase tracking-wide mb-1 opacity-70">
                              {date.label}
                            </p>
                            <p className="text-lg md:text-2xl font-bold">
                              {date.dateNum}
                            </p>
                            <p className="text-xs md:text-sm opacity-70 mt-1">
                              {date.monthName}
                            </p>
                            <p className="text-xs font-semibold mt-1 opacity-60">
                              {date.dayName}
                            </p>
                          </div>
                          
                          {/* Selected Check Mark */}
                          {preferredDate === date.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-[#1B8A05] rounded-full flex items-center justify-center"
                            >
                              <CheckCircle size={14} className="text-white md:w-4 md:h-4" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* ✅ NEW: TIME SLOT SELECTION WITH BUTTONS */}
                  <div>
                    <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-3 md:mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-[#1B8A05] md:w-5 md:h-5" /> 
                      Preferred Time Slot *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setTimeSlot(slot.value)}
                          className={`group relative p-4 md:p-5 border-2 rounded-lg md:rounded-xl text-center transition-all overflow-hidden ${
                            timeSlot === slot.value
                              ? 'bg-[#FEC925] border-[#FEC925] ring-4 ring-[#FEC925]/30 text-[#1C1C1B] shadow-lg scale-105'
                              : 'bg-white border-gray-300 hover:border-[#FEC925] hover:shadow-md text-gray-700 hover:scale-102'
                          }`}
                        >
                          {/* Gradient Background */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-[#FEC925]/10 to-[#1B8A05]/10 opacity-0 group-hover:opacity-100 transition-opacity ${
                            timeSlot === slot.value ? 'opacity-100' : ''
                          }`}></div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            {/* Icon based on time slot */}
                            {/* <div className="text-3xl md:text-4xl mb-2">
                              {slot.value === 'morning'}
                              {slot.value === 'afternoon'}
                              {slot.value === 'evening'}
                            </div> */}
                            <p className="text-sm md:text-base lg:text-lg font-bold">
                              {slot.label}
                            </p>
                          </div>
                          
                          {/* Selected Check Mark */}
                          {timeSlot === slot.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-[#1B8A05] rounded-full flex items-center justify-center"
                            >
                              <CheckCircle size={14} className="text-white md:w-4 md:h-4" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Special Instructions */}
                  <div>
                    <label className="block font-semibold text-base md:text-lg text-[#1C1C1B] mb-2 md:mb-3">
                      Special Instructions (Optional)
                    </label>
                    <textarea 
                      value={specialInstructions} 
                      onChange={(e) => setSpecialInstructions(e.target.value)} 
                      placeholder="e.g., Call on arrival, Building gate code, etc." 
                      rows={3} 
                      className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition resize-none text-sm md:text-base" 
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons - Compact for Mobile */}
            <div className="flex gap-2 md:gap-4 mt-4 md:mt-8">
              {step > 1 && (
                <button 
                  onClick={handleBack} 
                  disabled={loading} 
                  className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-lg md:rounded-xl hover:bg-gray-100 font-bold text-sm md:text-lg text-[#1C1C1B] transition disabled:opacity-50"
                >
                  <ArrowLeft size={18} className="md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-lg md:rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm md:text-lg shadow-lg transition"
              >
                {loading ? (
                  <>
                    <Loader2  size={20} className="animate-spin md:w-6 md:h-6" /> Processing...
                  </>
                ) : step === 1 ? (
                  <>Next: Condition <ArrowRight size={18} className="md:w-5 md:h-5" /></>
                ) : step === 3 ? (
                  <>Next: IMEI <ArrowRight size={18} className="md:w-5 md:h-5" /></>
                ) : step === 2 ? (
                  'Get My Estimate'
                ) : step === 4 ? (
                  <>Schedule Pickup <ArrowRight size={18} className="md:w-5 md:h-5" /></>
                ) : step === 5 ? (
                  'Confirm & Create Lead'
                ) : (
                  ''
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Helper for DetailRow in Estimate step - Mobile Optimized
const DetailRow: React.FC<{ label: string, value: string, highlight?: 'add' | 'ded' }> = ({ label, value, highlight }) => {
  let valueColor = 'text-[#1C1C1B]';
  if (highlight === 'add') valueColor = 'text-[#1B8A05]';
  if (highlight === 'ded') valueColor = 'text-[#FF0000]';

  return (
    <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-gray-100 last:border-0">
      <span className="font-semibold text-gray-600 text-xs sm:text-sm md:text-base">{label}:</span>
      <span className={`font-bold text-right ${valueColor} text-xs sm:text-sm md:text-base`}>{value}</span>
    </div>
  );
};

export default DeviceStepper;