import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Loader2,
  HelpCircle,
  Package,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1' //|| import.meta.env.VITE_API_URL ;

// --- Updated Interface to match API Doc ---
interface DeviceAttribute {
  id: string;
  name: string;
  label: string; // Changed from question_text
  attribute_type: string; // 'condition', 'accessory'
  input_type: string; // 'select', 'boolean', 'multi_select'
  is_boolean: boolean; // API includes this
  options: string[];
  is_required: boolean;
  display_order: number;
  help_text: string | null;
}

interface EstimateResponse {
  estimate_id: string;
  final_price: string;
  base_price: string;
  deductions: Array<{ reason: string; value: string; amount: string }>;
}

interface UserAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

// Helper to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DeviceStepper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get model from location state (passed from SelectModel.tsx)
  const { model } = location.state || {};
  const modelId = model?.id;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Step 1: Device Attributes
  const [groupedAttributes, setGroupedAttributes] = useState<Record<string, DeviceAttribute[]>>({});
  const [conditionResponses, setConditionResponses] = useState<Record<string, any>>({});

  // Step 2: IMEI & Photos
  const [imei, setImei] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  // Step 3: Pickup Details & Estimate
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);

  const timeSlots = [
    '9:00 AM - 1:00 PM',
    '1:00 PM - 5:00 PM',
    '5:00 PM - 9:00 PM'
  ];

  useEffect(() => {
    if (modelId) {
      loadAttributes();
    } else {
      // If no modelId, we can't proceed.
      alert('No model selected. Redirecting...');
      navigate('/');
    }
  }, [modelId]);

  const loadAttributes = async () => {
    try {
      setLoading(true);

      // --- Updated API Endpoint ---
      const attrsRes = await fetch(
        `${API_BASE_URL}/catalog/models/${modelId}/attributes/`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }}
      );

      if (!attrsRes.ok) {
        throw new Error('Failed to load device attributes');
      }

      const attrsData: DeviceAttribute[] = await attrsRes.json();
      console.log('Fetched Attributes:', attrsData )
      // Sort by display_order
      const sorted = attrsData.sort((a, b) => a.display_order - b.display_order);

      // Group attributes by 'attribute_type'
      const groups = sorted.reduce((acc: Record<string, DeviceAttribute[]>, attr) => {
        const type = capitalize(attr.attribute_type || 'other');

        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(attr);
        return acc;
      }, {});

      setGroupedAttributes(groups);

    } catch (error) {
      console.error('Failed to load attributes:', error);
      alert('Failed to load device options');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/accounts/addresses/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      const data: UserAddress[] = await res.json();
      setAddresses(data);
      
      const defaultAddr = data.find((a) => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for different attribute input types ---

  const handleResponseChange = (name: string, value: any) => {
    setConditionResponses(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectToggle = (attrName: string, option: string) => {
    const currentSelection = (conditionResponses[attrName] as string[] | undefined) || [];
    let newSelection: string[];
    
    if (currentSelection.includes(option)) {
      newSelection = currentSelection.filter(item => item !== option);
    } else {
      newSelection = [...currentSelection, option];
    }
    setConditionResponses({ ...conditionResponses, [attrName]: newSelection });
  };

  const isMultiSelected = (attrName: string, option: string) => {
    const currentSelection = (conditionResponses[attrName] as string[] | undefined) || [];
    return currentSelection.includes(option);
  };

  // --- Stepper Navigation ---

  const handleNext = async () => {
    if (step === 1) {
      // Validate required attributes
      const allAttributes = Object.values(groupedAttributes).flat();
      const requiredAttrs = allAttributes.filter(a => a.is_required);
      
      for (const attr of requiredAttrs) {
        const response = conditionResponses[attr.name];
        if (response === undefined || response === null || (Array.isArray(response) && response.length === 0)) {
          alert(`Please answer: ${attr.question_text}`);
          return;
        }
      }
      setStep(2);
    } else if (step === 2) {
      if (!imei || (imei.length !== 15 && imei.length !== 16)) {
        alert('Please enter a valid 15 or 16-digit IMEI/MEID');
        return;
      }
      if (photos.length < 2) {
        alert('Please upload at least 2 photos (Front & Back)');
        return;
      }
      
      await loadAddresses();
      setStep(3);
    } else if (step === 3) {
      if (!selectedAddressId) {
        alert('Please select a pickup address');
        return;
      }
      if (!preferredDate) {
        alert('Please select a preferred date');
        return;
      }
      if (!timeSlot) {
        alert('Please select a time slot');
        return;
      }
      
      await getEstimateAndCreateLead();
    } else if (step === 4) {
      navigate('/leads'); // Navigate to user's leads page
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1); // Go back to model selection
    }
  };

  const getEstimateAndCreateLead = async () => {
    try {
      setLoading(true);

      // 1. Upload photos
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const formData = new FormData();
        formData.append('files', photo);
        
        const uploadRes = await fetch(`${API_BASE_URL}/media/presign/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        uploadedUrls.push(...uploadData.map((p: any) => p.url));
      }

      // 2. Get Price Estimate
      const estimatePayload = {
        device_model: modelId,
        condition_inputs: conditionResponses,
        imei: imei,
        image_urls: uploadedUrls,
        // Add variant info if collected (e.g., storage, ram)
        // device_variant: { storage: "128GB", ram: "8GB" } 
      };

      const estimateRes = await fetch(`${API_BASE_URL}/pricing/estimate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(estimatePayload)
      });

      if (!estimateRes.ok) {
        const err = await estimateRes.json();
        throw new Error(err.detail || 'Failed to get estimate');
      }

      const estimateData: EstimateResponse = await estimateRes.json();
      setEstimate(estimateData);

      // 3. Create Lead
      const leadPayload = {
        estimate_id: estimateData.estimate_id,
        pickup_address_id: selectedAddressId,
        preferred_date: preferredDate,
        time_slot: timeSlot,
        special_instructions: specialInstructions
      };

      const leadRes = await fetch(`${API_BASE_URL}/leads/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });

      if (!leadRes.ok) {
        const err = await leadRes.json();
        throw new Error(err.detail || 'Failed to create lead');
      }
      
      setStep(4); // Move to success step

    } catch (error: any) {
      console.error('Failed to process request:', error);
      alert(`Error: ${error.message || 'Failed to process your request.'}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Photo Handlers ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 6) {
      alert('Maximum 6 photos allowed');
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // --- Date Handlers ---
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };


  // --- Render Functions ---

  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
        <p className="text-[#1C1C1B] text-xl font-semibold">Loading...</p>
      </motion.div>
    </div>
  );

  // const renderAttributeInput = (attr: DeviceAttribute) => {
  //   switch (attr.input_type) {
  //     case 'boolean':
  //       return (
  //         <div className="grid grid-cols-2 gap-3">
  //           <button
  //             onClick={() => handleResponseChange(attr.name, true)}
  //             className={`p-4 border-2 rounded-xl font-medium transition-all ${
  //               conditionResponses[attr.name] === true
  //                 ? 'bg-[#1B8A05]/10 border-[#1B8A05] ring-2 ring-[#1B8A05]/50'
  //                 : 'border-gray-300 hover:border-[#FEC925]'
  //             }`}
  //           >
  //             Yes
  //           </button>
  //           <button
  //             onClick={() => handleResponseChange(attr.name, false)}
  //             className={`p-4 border-2 rounded-xl font-medium transition-all ${
  //               conditionResponses[attr.name] === false
  //                 ? 'bg-[#FF0000]/10 border-[#FF0000] ring-2 ring-[#FF0000]/50'
  //                 : 'border-gray-300 hover:border-[#FEC925]'
  //             }`}
  //           >
  //             No
  //           </button>
  //         </div>
  //       );

  //     case 'select':
  //       return (
  //         <div className="grid grid-cols-2 gap-3">
  //           {attr.options.map((option) => (
  //             <button
  //               key={option}
  //               onClick={() => handleResponseChange(attr.name, option)}
  //               className={`p-4 border-2 rounded-xl text-left transition-all ${
  //                 conditionResponses[attr.name] === option
  //                   ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50 font-bold'
  //                   : 'border-gray-300 hover:border-[#FEC925]'
  //               }`}
  //             >
  //               {option}
  //             </button>
  //           ))}
  //         </div>
  //       );
      
  //     case 'multi_select':
  //       return (
  //         <div className="grid grid-cols-2 gap-3">
  //           {attr.options.map((option) => (
  //             <button
  //               key={option}
  //               onClick={() => handleMultiSelectToggle(attr.name, option)}
  //               className={`p-4 border-2 rounded-xl text-left transition-all ${
  //                 isMultiSelected(attr.name, option)
  //                   ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50 font-bold'
  //                   : 'border-gray-300 hover:border-[#FEC925]'
  //               }`}
  //             >
  //               {option}
  //             </button>
  //           ))}
  //         </div>
  //       );

  //     default:
  //       return <p className="text-red-500">Unsupported input type: {attr.input_type}</p>;
  //   }
  // };


  const renderAttributeInput = (attr: DeviceAttribute) => {
    if (attr.is_boolean) {
      // --- Boolean (Yes/No) Buttons ---
      return (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleResponseChange(attr.name, true)}
            className={`p-4 border-2 rounded-xl font-medium transition-all ${
              conditionResponses[attr.name] === true
                ? 'bg-[#1B8A05]/10 border-[#1B8A05] ring-2 ring-[#1B8A05]/50'
                : 'border-gray-300 hover:border-[#FEC925]'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleResponseChange(attr.name, false)}
            className={`p-4 border-2 rounded-xl font-medium transition-all ${
              conditionResponses[attr.name] === false
                ? 'bg-[#FF0000]/10 border-[#FF0000] ring-2 ring-[#FF0000]/50'
                : 'border-gray-300 hover:border-[#FEC925]'
            }`}
          >
            No
          </button>
        </div>
      );
    } else {
      // --- Select (Single Option) Buttons ---
      // This now handles all non-boolean attributes
      return (
        <div className="grid grid-cols-2 gap-3">
          {attr.options.map((option) => (
            <button
              key={option}
              onClick={() => handleResponseChange(attr.name, option)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                conditionResponses[attr.name] === option
                  ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/5Stream font-bold'
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

  if (loading && (step < 3 || (step === 3 && !estimate))) {
    return renderLoading();
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Condition', 'IMEI & Photos', 'Pickup Details', 'Complete'].map((label, idx) => (
              <div key={idx} className="flex-1 text-center">
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
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ type: 'spring' }}
            />
          </div>
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-[#FEC925]/20">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Device Condition */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#1C1C1B] mb-2">Tell us about your device</h2>
                    <p className="text-lg text-gray-600">{model?.name}</p>
                  </div>
                  
                  {Object.entries(groupedAttributes).map(([groupName, attrs]) => (
                    <fieldset key={groupName} className="space-y-6">
                      <legend className="text-2xl font-bold text-[#1C1C1B] pb-2 border-b-2 border-[#FEC925]">
                        {groupName}
                      </legend>
                      {attrs.map((attr) => (
                        <div key={attr.id} className="border-b border-gray-100 pb-6">
                          <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">
                            {attr.question_text}
                            {attr.is_required && <span className="text-[#FF0000]"> *</span>}
                            {attr.help_text && (
                              <span className="group relative ml-2">
                                <HelpCircle size={16} className="text-gray-400 cursor-help" />
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-[#1C1C1B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  {attr.help_text}
                                </span>
                              </span>
                            )}
                          </label>
                          {renderAttributeInput(attr)}
                        </div>
                      ))}
                    </fieldset>
                  ))}
                </motion.div>
              )}

              {/* Step 2: IMEI & Photos */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-[#1C1C1B] text-center">IMEI & Photos</h2>

                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">IMEI Number *</label>
                    <input
                      type="text"
                      value={imei}
                      onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="Enter 15-16 digit IMEI/MEID"
                      maxLength={16}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                    />
                    <p className="text-sm text-gray-500 mt-2">Dial <strong className="text-[#1C1C1B]">*#06#</strong> to find your device's IMEI number.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">Device Photos (Min 2, Max 6) *</label>
                    <p className="text-sm text-gray-500 mb-4">Please provide clear photos: <strong className="text-[#1C1C1B]">1. Front Screen (On)</strong>, <strong className="text-[#1C1C1B]">2. Back Panel</strong>. Add more for any damages.</p>
                    <div className="grid grid-cols-3 gap-4">
                      {photos.map((photo, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 bg-[#FF0000] text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      {photos.length < 6 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FEC925] hover:bg-[#FEC925]/10 transition">
                          <Upload className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Pickup Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-[#1C1C1B] text-center">Pickup Details</h2>

                  {/* Address Selection */}
                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
                      <MapPin size={20} className="text-[#1B8A05]" />
                      Pickup Address *
                    </label>
                    {addresses.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">No addresses found</p>
                        <button
                          onClick={() => navigate('/add-address', { state: { from: location.pathname, ...location.state } })} // Pass state to return here
                          className="px-6 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
                        >
                          Add New Address
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                              selectedAddressId === addr.id
                                ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50'
                                : 'border-gray-300 hover:border-[#FEC925]'
                            }`}
                          >
                            <p className="font-bold text-[#1C1C1B]">{addr.full_name} {addr.is_default && <span className="text-xs font-medium bg-[#1B8A05] text-white px-2 py-0.5 rounded-full ml-2">Default</span>}</p>
                            <p className="text-sm text-gray-700">{addr.address_line1}</p>
                            {addr.address_line2 && <p className="text-sm text-gray-700">{addr.address_line2}</p>}
                            <p className="text-sm text-gray-700">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">Phone: {addr.phone}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
                      <Calendar size={20} className="text-[#1B8A05]" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
                      <Clock size={20} className="text-[#1B8A05]" />
                      Time Slot *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            timeSlot === slot
                              ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50 font-bold'
                              : 'border-gray-300 hover:border-[#FEC925]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">Special Instructions (Optional)</label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g., Call on arrival, avoid ringing bell..."
                      rows={3}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && estimate && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      className="w-24 h-24 bg-gradient-to-br from-[#1B8A05] to-[#FEC925] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                    >
                      <CheckCircle size={56} className="text-white" strokeWidth={3} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1B] mb-2">Lead Created Successfully! 🎉</h2>
                    <p className="text-lg text-gray-600">Your device pickup has been scheduled.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4] p-8 rounded-xl text-center border-2 border-[#1B8A05]/30">
                    <p className="text-gray-700 font-medium mb-2">Estimated Price</p>
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B8A05] to-[#0a4d03]">
                      ₹{parseFloat(estimate.final_price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-100 p-6 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-semibold text-[#1C1C1B]">₹{parseFloat(estimate.base_price).toLocaleString('en-IN')}</span>
                    </div>
                    
                    {estimate.deductions?.map((deduction, idx) => (
                      <div key={idx} className="flex justify-between text-[#FF0000]">
                        <span>{deduction.reason}</span>
                        <span>-₹{parseFloat(deduction.amount).toLocaleString('en-IN')}</span>
                      </div>
                    ))}

                    <div className="border-t-2 border-dashed border-gray-300 pt-3 flex justify-between font-bold text-lg">
                      <span className="text-[#1C1C1B]">Final Estimated Price</span>
                      <span className="text-[#1B8A05]">₹{parseFloat(estimate.final_price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="bg-[#FEC925]/10 border-l-4 border-[#FEC925] p-4 rounded-r-lg">
                    <p className="text-sm text-[#1C1C1B]">
                      <strong>Note:</strong> This is an estimate. The final price will be confirmed after a physical inspection by our pickup partner.
                    </p>
                  </div>

                  <div className="bg-[#1B8A05]/10 border-l-4 border-[#1B8A05] p-4 rounded-r-lg">
                    <p className="text-sm text-[#1C1C1B]">
                      <strong>Next Steps:</strong> Our partner will contact you soon. You can track your lead status in the "My Leads" section.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step < 4 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-bold text-lg text-[#1C1C1B] transition"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={loading}
                className={`${step < 4 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing...
                  </>
                ) : step === 3 ? (
                  'Submit & Get Estimate'
                ) : step === 4 ? (
                  <>
                    View My Leads
                    <Package size={20} />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeviceStepper;