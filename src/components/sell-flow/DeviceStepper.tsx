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

// --- Interfaces (No changes needed here based on the issue) ---
interface DeviceAttribute {
  id: string;
  name: string;
  question_text: string; // Using question_text
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
  id: string; // The UUID of the lead
  lead_number: string;
  status_display: string;
}
interface UserAddress {
  id: string; // Address UUID
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  type?: string;
}
interface TimeSlot {
  value: string; // "morning"
  label: string; // "Morning (9AM - 1PM)"
}
// interface DateOption {
//   value: string; // "2025-11-17" (YYYY-MM-DD format)
//   label: string; // "Tomorrow - Monday, 17 Nov 2025"
// }
interface ModelData {
  id: string;
  name: string;
  thumbnail?: string;
  storage_options: string[];
  ram_options: string[];
  color_options: string[];
  images?: Array<{ image_url: string; is_primary: boolean }>;
}
// This interface defines the expected shape of data in location.state
interface LocationState {
  modelId?: string;
  model?: { id: string; name: string; thumbnail: string; };
}

// Helper to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Error Display Component ---
interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mb-6 p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <AlertTriangle className="text-[#FF0000] flex-shrink-0" size={24} />
      <p className="font-semibold text-[#1C1C1B]">{message}</p>
    </div>
    <button onClick={onDismiss} className="text-[#FF0000] hover:opacity-70">
      <X size={20} />
    </button>
  </motion.div>
);


const DeviceStepper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ FIX: Correctly access the model ID from location.state
  // Check for modelId directly (used by SellOldDevice.tsx) OR model.id
  const { modelId: modelIdFromState, model: modelFromState } = (location.state || {}) as LocationState;
  const modelId = modelIdFromState || modelFromState?.id;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modelDetails, setModelDetails] = useState<ModelData | null>(null);

  const [groupedAttributes, setGroupedAttributes] = useState<Record<string, DeviceAttribute[]>>({});
  const [conditionResponses, setConditionResponses] = useState<Record<string, any>>({});
  
  // ✅ NEW: State for tracking which optional sections are expanded
  const [expandedOptionalSections, setExpandedOptionalSections] = useState<Record<string, boolean>>({});

  const [imei, setImei] = useState('');
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);

  // ✅ REMOVED: Photo state (Step 6 removed)
  // const [photos, setPhotos] = useState<File[]>([]);
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // ✅ NEW: Address form state
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

      // Applying defaults if API fields are empty
      const defaultStorage = ['64 GB', '128GB', '256GB', '512GB'];
      const defaultRAM = ['4GB', '6GB', '8GB', '12GB'];
      const defaultColors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple', 'Graphite'];

      const processedModelDetails: ModelData = {
        ...modelData,
        storage_options: (modelData.storage_options && modelData.storage_options.length > 0)
          ? modelData.storage_options
          : defaultStorage,
        ram_options: (modelData.ram_options && modelData.ram_options.length > 0)
          ? modelData.ram_options
          : defaultRAM,
        color_options: (modelData.color_options && modelData.color_options.length > 0)
          ? modelData.color_options
          : defaultColors,
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

  // ✅ NEW: Handle address creation
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await authService.createAddress(addressFormData);
      
      // Reload addresses
      await loadAddresses();
      
      // Reset form and hide it
      setShowAddressForm(false);
      resetAddressForm();
      
    } catch (error: any) {
      console.error('Failed to create address:', error);
      setError(error.message || 'Failed to create address');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Reset address form
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

  // ✅ NEW: Toggle optional section visibility
  const toggleOptionalSection = (groupName: string) => {
    setExpandedOptionalSections(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // --- Stepper Navigation ---
  const handleNext = async () => {
    setError(null);

    // Step 1 (Variant) -> Step 2 (Condition)
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
      if (modelDetails.color_options.length > 0 && !conditionResponses['color']) {
        setError('Please select a color option.');
        return;
      }
      setStep(2);
    }

    // Step 2 (Condition) -> Step 3 (IMEI)
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
      setStep(3);
    }

    // ✅ MODIFIED: Step 3 (IMEI - Now Skippable) -> Step 4 (Estimate)
    // No validation required - user can skip IMEI entry
    else if (step === 3) {
      await handleGetEstimate();
    }

    // Step 4 (Estimate) -> Step 5 (Pickup - FINAL STEP)
    else if (step === 4) {
      const addressesLoaded = await loadAddresses();
      if (addressesLoaded) {
        setStep(5);
      }
    }

    // ✅ MODIFIED: Step 5 (Pickup - FINAL STEP) -> Create Lead & Navigate
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
      // ✅ CHANGED: Now create lead without photos
      await handleCreateLead();
    }

    // ✅ REMOVED: Step 6 (Photos) logic entirely
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  // --- Step 3 Action: Get Estimate ---
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
        imei: imei || '', // ✅ IMEI is optional now
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
      setStep(4); // Move to estimate display step

    } catch (error: any) {
      console.error('Failed to get estimate:', error);
      setError(error.message || 'Failed to process your request.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODIFIED: Step 5 (Final) Action: Create Lead & NAVIGATE (No Photos)
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

      // Create Lead (using LeadCreateSerializer fields)
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

      // ✅ REMOVED: Photo upload logic

      // SUCCESS: NAVIGATE TO LEAD DETAIL PAGE
      navigate(`/lead/${newLeadId}`);

    } catch (error: any) {
      console.error('Failed to create lead:', error);
      setError(error.message || 'Failed to create your lead.');
      // If lead was created, still navigate
      if (newLeadId) {
        navigate(`/lead/${newLeadId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ REMOVED: Photo handlers
  // const handlePhotoUpload = ...
  // const removePhoto = ...
  
  // ✅ NEW: Generate next 4 days for pickup date selection
  const getNext4Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const value = date.toISOString().split('T')[0]; // YYYY-MM-DD format for backend
      
      // Format for display
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      
      let label = '';
      if (i === 1) {
        label = `Tomorrow - ${dayName}, ${dateStr}`;
      } else if (i === 2) {
        label = `Day After Tomorrow - ${dayName}, ${dateStr}`;
      } else {
        label = `${dayName}, ${dateStr}`;
      }
      
      days.push({ value, label });
    }
    
    return days;
  };
  
  const availableDates = getNext4Days();

  // --- (Loading Render) ---
  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4]">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
        <p className="text-[#1C1C1B] text-xl font-semibold">Loading Device Options...</p>
      </motion.div>
    </div>
  );

  // --- (renderAttributeInput) ---
  const renderAttributeInput = (attr: DeviceAttribute) => {
    if (attr.is_boolean) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleResponseChange(attr.name, "true")}
            className={`p-4 border-2 rounded-xl font-medium transition-all ${
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
            className={`p-4 border-2 rounded-xl font-medium transition-all ${
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
        <div className="grid grid-cols-2 gap-3">
          {attr.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleResponseChange(attr.name, option)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
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

  // --- (renderVariantOptions) ---
  const renderVariantOptions = (title: string, fieldName: 'storage' | 'ram' | 'color', options: string[]) => {
    if (!options || options.length === 0) return null;
    return (
      <fieldset className="space-y-4">
        <legend className="text-2xl font-bold text-[#1C1C1B] pb-2 border-b-2 border-[#FEC925]">
          {title}
          <span className="text-[#FF0000]"> *</span>
        </legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleResponseChange(fieldName, option)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                conditionResponses[fieldName] === option
                  ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50 font-bold'
                  : 'border-gray-300 hover:border-[#FEC925]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
    );
  };

  // ✅ NEW: Render attribute groups with required/optional separation
  const renderAttributeGroup = (groupName: string, attrs: DeviceAttribute[]) => {
    const requiredAttrs = attrs.filter(a => a.is_required);
    const optionalAttrs = attrs.filter(a => !a.is_required);
    const isExpanded = expandedOptionalSections[groupName] || false;

    return (
      <fieldset key={groupName} className="space-y-6">
        <legend className="text-2xl font-bold text-[#1C1C1B] pb-2 border-b-2 border-[#FEC925]">
          {groupName}
        </legend>
        
        {/* Required Attributes */}
        {requiredAttrs.map((attr) => (
          <div key={attr.id} className="border-b border-gray-100 pb-6">
            <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">
              {attr.question_text}
              <span className="text-[#FF0000]"> *</span>
              {attr.help_text && (
                <span className="group relative ml-2">
                  <HelpCircle size={16} className="text-gray-400 cursor-help inline" />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-[#1C1C1B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {attr.help_text}
                  </span>
                </span>
              )}
            </label>
            {renderAttributeInput(attr)}
          </div>
        ))}

        {/* Optional Attributes - Collapsible Section */}
        {optionalAttrs.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => toggleOptionalSection(groupName)}
              className="w-full flex items-center justify-between p-4 bg-[#FEC925]/10 border-2 border-[#FEC925]/30 rounded-xl hover:bg-[#FEC925]/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Info size={20} className="text-[#FEC925]" />
                <span className="font-semibold text-[#1C1C1B]">
                  Optional Details ({optionalAttrs.length})
                </span>
                <span className="text-sm text-gray-600 italic">
                  Fill for more accurate pricing
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp size={20} className="text-[#1C1C1B]" />
              ) : (
                <ChevronDown size={20} className="text-[#1C1C1B]" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-6 pl-4 border-l-4 border-[#FEC925]/30"
                >
                  {optionalAttrs.map((attr) => (
                    <div key={attr.id} className="border-b border-gray-100 pb-6">
                      <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">
                        {attr.question_text}
                        {attr.help_text && (
                          <span className="group relative ml-2">
                            <HelpCircle size={16} className="text-gray-400 cursor-help inline" />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-[#1C1C1B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* ✅ UPDATED: Progress bar now shows 5 steps instead of 6 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Variant', 'Condition', 'IMEI', 'Estimate', 'Pickup'].map((label, idx) => (
              <div key={idx} className="flex-1 text-center last:flex-initial">
                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg ${
                  step > idx + 1 ? 'bg-[#1B8A05] text-white' :
                  step === idx + 1 ? 'bg-gradient-to-br from-[#FEC925] to-[#1B8A05] text-[#1C1C1B]' : 'bg-gray-300 text-gray-700'
                }`}>
                  {step > idx + 1 ? <CheckCircle size={20} /> : idx + 1}
                </div>
                <p className={`text-xs font-semibold ${
                  step >= idx + 1 ? 'text-[#1C1C1B]' : 'text-gray-500'
                }`}>{label}</p>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-[#FEC925]/20">
            <AnimatePresence mode="wait">

              {/* --- Step 1: Variant Selection --- */}
              {step === 1 && modelDetails && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#1C1C1B] mb-2">Select Device Variant</h2>
                    <p className="text-lg text-gray-600">{modelDetails.name}</p>
                  </div>
                  <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center p-4">
                    <img
                      src={modelDetails.images?.[0]?.image_url || modelFromState?.thumbnail}
                      alt={modelDetails.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  {renderVariantOptions('Storage', 'storage', modelDetails.storage_options)}
                  {renderVariantOptions('RAM', 'ram', modelDetails.ram_options)}
                  {renderVariantOptions('Color', 'color', modelDetails.color_options)}
                </motion.div>
              )}

              {/* --- Step 2: Device Condition (WITH COLLAPSIBLE OPTIONAL SECTIONS) --- */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#1C1C1B] mb-2">Tell us its condition</h2>
                    <p className="text-lg text-gray-600">{modelDetails?.name}</p>
                  </div>
                  {/* ✅ UPDATED: Use new render function that separates required/optional */}
                  {Object.entries(groupedAttributes).map(([groupName, attrs]) => 
                    renderAttributeGroup(groupName, attrs)
                  )}
                </motion.div>
              )}

              {/* --- Step 3: IMEI (SKIPPABLE - No validation) --- */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#1C1C1B] mb-2">Device IMEI</h2>
                    <p className="text-lg text-gray-600">(Optional - You can skip this step)</p>
                  </div>
                  
                  {/* ✅ INFO BOX: Explaining IMEI is optional */}
                  <div className="bg-[#FEC925]/10 border-l-4 border-[#FEC925] p-4 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-[#FEC925] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-[#1C1C1B] font-semibold mb-1">IMEI is Optional</p>
                        <p className="text-sm text-gray-600">
                          You can provide the IMEI number to our pickup partner during device verification. 
                          Click "Get My Estimate" to continue without entering it now.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">
                      IMEI Number (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={imei} 
                      onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 16))} 
                      placeholder="Enter 15-16 digit IMEI/MEID (optional)" 
                      maxLength={16} 
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition" 
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Dial <strong className="text-[#1C1C1B]">*#06#</strong> to find your device's IMEI number.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* --- Step 4: Estimate Display --- */}
              {step === 4 && estimate && (
                <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }} className="w-24 h-24 bg-gradient-to-br from-[#1B8A05] to-[#FEC925] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Wallet size={56} className="text-white" strokeWidth={2} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1B] mb-2">We've Calculated Your Price!</h2>
                  </div>
                  <div className="bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4] p-8 rounded-xl text-center border-2 border-[#1B8A05]/30">
                    <p className="text-gray-700 font-medium mb-2">Estimated Price</p>
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A05] to-[#0a4d03]">
                      ₹{parseFloat(estimate.final_price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-gray-100 p-6 rounded-lg space-y-3">
                    <DetailRow label="Base Price" value={`₹${parseFloat(estimate.base_price).toLocaleString('en-IN')}`} />
                    {estimate.additions?.map((add, idx) => (
                      <DetailRow key={`add-${idx}`} label={add.reason} value={`+₹${parseFloat(add.amount).toLocaleString('en-IN')}`} highlight="add" />
                    ))}
                    {estimate.deductions?.map((ded, idx) => (
                      <DetailRow key={`ded-${idx}`} label={ded.reason} value={`-₹${parseFloat(ded.amount).toLocaleString('en-IN')}`} highlight="ded" />
                    ))}
                    <div className="border-t-2 border-dashed border-gray-300 pt-3 flex justify-between font-bold text-lg">
                      <span className="text-[#1C1C1B]">Final Estimated Price</span>
                      <span className="text-[#1B8A05]">₹{parseFloat(estimate.final_price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="bg-[#FEC925]/10 border-l-4 border-[#FEC925] p-4 rounded-r-lg">
                    <p className="text-sm text-[#1C1C1B]"><strong>Note:</strong> This is an estimate. The final price will be confirmed after physical inspection.</p>
                  </div>
                </motion.div>
              )}

              {/* --- Step 5: Pickup Details (FINAL STEP) --- */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <h2 className="text-3xl font-bold text-[#1C1C1B] text-center">Schedule Pickup</h2>
                  
                  {/* ✅ ADDRESS SECTION WITH INLINE FORM */}
                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
                      <MapPin size={20} className="text-[#1B8A05]" /> Pickup Address *
                    </label>
                    
                    {/* Address List */}
                    {addresses.length === 0 && !showAddressForm ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">No addresses found</p>
                        <button 
                          type="button"
                          onClick={() => {
                            resetAddressForm();
                            setShowAddressForm(true);
                          }} 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
                        >
                          <Plus size={20} />
                          Add New Address
                        </button>
                      </div>
                    ) : addresses.length > 0 && !showAddressForm ? (
                      <>
                        {/* Add New Address Button (when addresses exist) */}
                        <button
                          type="button"
                          onClick={() => {
                            resetAddressForm();
                            setShowAddressForm(true);
                          }}
                          className="w-full mb-4 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#FEC925] rounded-xl text-[#1C1C1B] font-semibold hover:bg-[#FEC925]/10 transition"
                        >
                          <Plus size={20} className="text-[#FEC925]" />
                          Add New Address
                        </button>
                        
                        {/* Address Cards */}
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {addresses.map((addr) => (
                            <button 
                              key={addr.id}
                              type="button"
                              onClick={() => setSelectedAddressId(addr.id)} 
                              className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                                selectedAddressId === addr.id 
                                  ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50' 
                                  : 'border-gray-300 hover:border-[#FEC925]'
                              }`}
                            >
                              <p className="font-bold text-[#1C1C1B]">
                                {addr.type} 
                                {addr.is_default && (
                                  <span className="text-xs font-medium bg-[#1B8A05] text-white px-2 py-0.5 rounded-full ml-2">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-700">{addr.line1} {addr.line2}</p>
                              <p className="text-sm text-gray-700">{addr.city}, {addr.state} - {addr.postal_code}</p>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : null}
                    
                    {/* ✅ INLINE ADDRESS FORM */}
                    {showAddressForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#F0F7F6] border-2 border-[#FEC925] rounded-xl p-6 mb-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-xl text-[#1C1C1B]">Add New Address</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddressForm(false);
                              resetAddressForm();
                            }}
                            className="text-gray-500 hover:text-[#FF0000] transition"
                          >
                            <X size={24} />
                          </button>
                        </div>
                        
                        <form onSubmit={handleCreateAddress} className="space-y-4">
                          {/* Address Type Selection */}
                          <div>
                            <label className="block font-semibold text-sm text-[#1C1C1B] mb-2">
                              Address Type *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {['home', 'office', 'other'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAddressFormData({...addressFormData, type: type as 'home' | 'office' | 'other'})}
                                  className={`p-3 border-2 rounded-lg text-center font-medium transition-all capitalize ${
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
                          
                          {/* Address Line 1 */}
                          <div>
                            <label className="block font-semibold text-sm text-[#1C1C1B] mb-2">
                              Address Line 1 *
                            </label>
                            <input 
                              type="text" 
                              placeholder="House/Flat No., Building Name" 
                              value={addressFormData.line1} 
                              onChange={(e) => setAddressFormData({...addressFormData, line1: e.target.value})} 
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition" 
                              required 
                            />
                          </div>
                          
                          {/* Address Line 2 */}
                          <div>
                            <label className="block font-semibold text-sm text-[#1C1C1B] mb-2">
                              Address Line 2 (Optional)
                            </label>
                            <input 
                              type="text" 
                              placeholder="Street, Area, Locality" 
                              value={addressFormData.line2} 
                              onChange={(e) => setAddressFormData({...addressFormData, line2: e.target.value})} 
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition" 
                            />
                          </div>
                          
                          {/* City and State */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-semibold text-sm text-[#1C1C1B] mb-2">
                                City *
                              </label>
                              <input 
                                type="text" 
                                placeholder="City" 
                                value={addressFormData.city} 
                                onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} 
                                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition" 
                                required 
                              />
                            </div>
                            <div>
                              <label className="block font-semibold text-sm text-[#1C1C1B] mb-2">
                                State *
                              </label>
                              <input 
                                type="text" 
                                placeholder="State" 
                                value={addressFormData.state} 
                                onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})} 
                                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition" 
                                required 
                              />
                            </div>
                          </div>
                          
                          {/* Pincode */}
                          <div>
                            <label className="block font-semibold text-sm text-[#1C1C1B] mb-2">
                              Pincode *
                            </label>
                            <input 
                              type="text" 
                              placeholder="6-digit pincode" 
                              value={addressFormData.postal_code} 
                              onChange={(e) => setAddressFormData({...addressFormData, postal_code: e.target.value.replace(/\D/g, '').slice(0, 6)})} 
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none transition" 
                              maxLength={6}
                              required 
                            />
                          </div>
                          
                          {/* Set as Default */}
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              id="is_default"
                              checked={addressFormData.is_default}
                              onChange={(e) => setAddressFormData({...addressFormData, is_default: e.target.checked})}
                              className="w-5 h-5 rounded border-2 border-gray-300 text-[#FEC925] focus:ring-[#FEC925]"
                            />
                            <label htmlFor="is_default" className="font-medium text-[#1C1C1B] cursor-pointer">
                              Set as default address
                            </label>
                          </div>
                          
                          {/* Form Buttons */}
                          <div className="flex gap-3 pt-2">
                            <button 
                              type="button" 
                              onClick={() => {
                                setShowAddressForm(false);
                                resetAddressForm();
                              }} 
                              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-[#1C1C1B] hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              disabled={loading} 
                              className="flex-1 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition"
                            >
                              {loading ? 'Saving...' : 'Save Address'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
                        <Calendar size={20} className="text-[#1B8A05]" /> Preferred Date *
                      </label>
                      <select 
                        value={preferredDate} 
                        onChange={(e) => setPreferredDate(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition bg-white appearance-none"
                      >
                        <option value="" disabled>Select a pickup date</option>
                        {availableDates.map((date) => (
                          <option key={date.value} value={date.value}>
                            {date.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
                        <Clock size={20} className="text-[#1B8A05]" /> Time Slot *
                      </label>
                      <select 
                        value={timeSlot} 
                        onChange={(e) => setTimeSlot(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition bg-white appearance-none"
                      >
                        <option value="" disabled>Select a time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Special Instructions */}
                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">
                      Special Instructions (Optional)
                    </label>
                    <textarea 
                      value={specialInstructions} 
                      onChange={(e) => setSpecialInstructions(e.target.value)} 
                      placeholder="e.g., Call on arrival, Building gate code, etc." 
                      rows={3} 
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition resize-none" 
                    />
                  </div>
                </motion.div>
              )}

              {/* ✅ REMOVED: Step 6 (Photos) entirely */}

            </AnimatePresence>

            {/* --- Navigation Buttons --- */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button 
                  onClick={handleBack} 
                  disabled={loading} 
                  className="flex items-center gap-2 px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-bold text-lg text-[#1C1C1B] transition disabled:opacity-50"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              {/* ✅ UPDATED: Button logic for 5 steps */}
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} /> Processing...
                  </>
                ) : step === 1 ? (
                  <>Next: Condition <ArrowRight size={20} /></>
                ) : step === 2 ? (
                  <>Next: IMEI <ArrowRight size={20} /></>
                ) : step === 3 ? (
                  'Get My Estimate'
                ) : step === 4 ? (
                  <>Schedule Pickup <ArrowRight size={20} /></>
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

// Helper for DetailRow in Estimate step
const DetailRow: React.FC<{ label: string, value: string, highlight?: 'add' | 'ded' }> = ({ label, value, highlight }) => {
  let valueColor = 'text-[#1C1C1B]';
  if (highlight === 'add') valueColor = 'text-[#1B8A05]';
  if (highlight === 'ded') valueColor = 'text-[#FF0000]';

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="font-semibold text-gray-600">{label}:</span>
      <span className={`font-bold text-right ${valueColor}`}>{value}</span>
    </div>
  );
};

export default DeviceStepper;