import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Check, ArrowRight, ArrowLeft, Loader2, AlertCircle, Edit, Trash2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface UserAddress {
  id: string; // Backend uses UUID
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

const SelectAddress: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceDetails } = location.state || {};

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!deviceDetails) {
      navigate('/');
      return;
    }
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const res = await fetch(`${API_BASE_URL}/accounts/addresses/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to load addresses');
      }

      const data = await res.json();
      setAddresses(data);
      
      // Auto-select default address if exists
      const defaultAddr = data.find((addr: UserAddress) => addr.is_default);
      if (defaultAddr) {
        setSelectedId(defaultAddr.id);
      }
    } catch (error: any) {
      console.error('Failed to load addresses:', error);
      setError(error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.address_line1.trim() || 
        !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('Pincode must be 6 digits');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/accounts/addresses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          address_type: 'home',
          is_default: addresses.length === 0, // Make first address default
          ...formData 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save address');
      }

      const newAddress = await res.json();
      setAddresses([...addresses, newAddress]);
      setSelectedId(newAddress.id);
      setShowForm(false);
      
      // Reset form
      setFormData({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
      });
    } catch (error: any) {
      setError(error.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!selectedId) {
      setError('Please select a pickup address');
      return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedId);
    if (!selectedAddress) {
      setError('Selected address not found');
      return;
    }

    navigate('/slot-booking', {
      state: {
        deviceDetails,
        address: selectedAddress
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading addresses...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1C1C1B] hover:text-[#FEC925] transition mb-6 font-semibold"
          >
            <ArrowLeft size={24} />
            Back
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FEC925] to-[#1B8A05] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin className="text-[#1C1C1B]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1B] mb-2">Pickup Address</h2>
            <p className="text-gray-600 text-lg">Where should we pick up your device?</p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="text-[#FF0000] flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="font-bold text-[#FF0000]">Error</p>
              <p className="text-[#1C1C1B]">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-[#FF0000] hover:text-[#FF0000]/70">
              ✕
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="address-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {addresses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="text-gray-400" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1C1C1B] mb-2">No addresses saved</h3>
                  <p className="text-gray-600 mb-6">Add your first address to continue</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition inline-flex items-center gap-2"
                  >
                    <Plus size={24} />
                    Add Address
                  </button>
                </motion.div>
              ) : (
                <>
                  {addresses.map((addr, index) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      isSelected={selectedId === addr.id}
                      onClick={() => setSelectedId(addr.id)}
                      index={index}
                    />
                  ))}

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: addresses.length * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(true)}
                    className="w-full py-6 border-4 border-dashed border-[#FEC925] rounded-xl hover:bg-[#FEC925]/10 text-[#1C1C1B] font-bold text-lg transition flex items-center justify-center gap-3"
                  >
                    <Plus size={28} className="text-[#FEC925]" />
                    Add New Address
                  </motion.button>

                  {selectedId && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinue}
                      className="w-full py-6 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl font-bold text-xl shadow-lg transition flex items-center justify-center gap-3"
                    >
                      Continue to Slot Booking
                      <ArrowRight size={24} />
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="address-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl space-y-5 border-2 border-[#FEC925]/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1C1C1B]">Add New Address</h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-[#FF0000] transition"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (10 digits) *"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  maxLength={10}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Address Line 1 (House No., Building, Street) *"
                value={formData.address_line1}
                onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                required
              />

              <input
                type="text"
                placeholder="Address Line 2 (Area, Colony) (Optional)"
                value={formData.address_line2}
                onChange={(e) => setFormData({...formData, address_line2: e.target.value})}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
              />

              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                  required
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Pincode (6 digits) *"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                maxLength={6}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition"
                required
              />

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                  className="flex-1 py-4 border-2 border-[#1C1C1B] text-[#1C1C1B] rounded-xl hover:bg-[#1C1C1B] hover:text-white transition font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl transition font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Save Address
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

interface AddressCardProps {
  address: UserAddress;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, isSelected, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-6 bg-white rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-2xl border-2 ${
        isSelected
          ? 'ring-4 ring-[#FEC925]/50 border-[#FEC925] shadow-[#FEC925]/20'
          : 'border-gray-200 hover:border-[#FEC925]'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-[#FEC925] text-[#1C1C1B] rounded-full p-2 shadow-lg"
        >
          <Check size={20} strokeWidth={3} />
        </motion.div>
      )}

      {/* Default Badge */}
      {address.is_default && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-[#1B8A05] text-white text-xs font-bold rounded-full">
          DEFAULT
        </div>
      )}

      <div className="flex items-start gap-4 mt-6">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-[#FEC925]/20' : 'bg-[#1B8A05]/20'
        }`}>
          <MapPin className={isSelected ? 'text-[#FEC925]' : 'text-[#1B8A05]'} size={24} />
        </div>

        <div className="flex-1">
          <p className="font-bold text-xl text-[#1C1C1B] mb-2">{address.full_name}</p>
          <p className="text-gray-700 leading-relaxed">{address.address_line1}</p>
          {address.address_line2 && <p className="text-gray-700 leading-relaxed">{address.address_line2}</p>}
          {address.landmark && (
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
              <MapPin size={14} className="text-[#1B8A05]" />
              Near: {address.landmark}
            </p>
          )}
          <p className="text-gray-700 font-semibold mt-2">
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="text-[#1B8A05] font-bold text-lg flex items-center gap-2 mt-3">
            <span>📞</span> {address.phone}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectAddress;