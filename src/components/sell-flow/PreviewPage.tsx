import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Calendar, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useSellFlow } from '../../context/SellFlowContext';
import * as leadsService from '../../api/services/leadsService';

interface PreviewPageProps {
  onBack: () => void;
  onConfirm: () => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ onBack, onConfirm }) => {
  const { deviceDetails, address, slot, setLeadId } = useSellFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!deviceDetails || !address) {
      setError('Missing required information');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // CRITICAL: Match backend API structure exactly
      const leadPayload = {
        // Backend expects device_model as UUID (not nested object)
        device_model: deviceDetails.modelId, // UUID from backend
        
        // device_variant is JSONField containing storage, ram, color
        device_variant: {
          storage: deviceDetails.storage || '',
          ram: deviceDetails.ram || '',
          color: deviceDetails.color || ''
        },
        
        // condition_inputs is JSONField containing all condition responses
        condition_inputs: {
          age: deviceDetails.age || '',
          body_condition: deviceDetails.bodyCondition || '',
          screen_condition: deviceDetails.screenCondition || '',
          functional_issues: deviceDetails.functionalIssues || [],
          accessories: deviceDetails.accessories || {},
          warranty_status: deviceDetails.warrantyStatus || '',
          purchase_receipt: deviceDetails.purchaseReceipt || false
        },
        
        // Photos array
        photos: deviceDetails.photos || [],
        
        // IMEI
        imei: deviceDetails.imei || '',
        
        // Address fields - backend expects separate fields, not nested
        pickup_address_line1: address.address_line1,
        pickup_address_line2: address.address_line2 || '',
        pickup_landmark: address.landmark || '',
        pickup_city: address.city,
        pickup_state: address.state,
        pickup_pincode: address.pincode,
        pickup_contact_name: address.full_name,
        pickup_contact_phone: address.phone,
        
        // Slot information
        preferred_pickup_date: slot?.date,
        preferred_pickup_slot: slot?.time,
        
        // Customer notes (optional)
        customer_notes: deviceDetails.notes || ''
      };

      console.log('Creating lead with payload:', leadPayload);

      const response = await leadsService.createLead(leadPayload);
      
      if (response && response.id) {
        setLeadId(response.id);
        onConfirm();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Failed to create lead:', error);
      setError(error.message || 'Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!deviceDetails || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <AlertCircle className="text-[#FF0000] mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-[#1C1C1B] mb-4">Missing Information</h2>
          <p className="text-gray-600 mb-6">Some required information is missing. Please go back and complete all steps.</p>
          <button
            onClick={onBack}
            className="w-full py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#FEC925] to-[#1B8A05] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="text-[#1C1C1B]" size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1B] mb-2">Review Your Order</h2>
          <p className="text-gray-600 text-lg">Please verify all details before confirming</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="text-[#FF0000] flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-bold text-[#FF0000]">Error</p>
              <p className="text-[#1C1C1B]">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Device Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-2 border-[#FEC925]/20 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#FEC925]/20 rounded-full flex items-center justify-center">
                <Package className="text-[#FEC925]" size={24} />
              </div>
              <h3 className="font-bold text-2xl text-[#1C1C1B]">Device Details</h3>
            </div>
            
            <div className="space-y-4">
              <DetailRow label="Brand" value={deviceDetails.brandName} />
              <DetailRow label="Model" value={deviceDetails.modelName} />
              {deviceDetails.storage && <DetailRow label="Storage" value={deviceDetails.storage} />}
              {deviceDetails.ram && <DetailRow label="RAM" value={deviceDetails.ram} />}
              {deviceDetails.color && <DetailRow label="Color" value={deviceDetails.color} />}
              {deviceDetails.imei && <DetailRow label="IMEI" value={deviceDetails.imei} />}
              {deviceDetails.bodyCondition && <DetailRow label="Body Condition" value={deviceDetails.bodyCondition} />}
              {deviceDetails.screenCondition && <DetailRow label="Screen Condition" value={deviceDetails.screenCondition} />}
              
              {deviceDetails.functionalIssues && deviceDetails.functionalIssues.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-semibold text-[#1C1C1B] mb-2">Functional Issues:</p>
                  <div className="flex flex-wrap gap-2">
                    {deviceDetails.functionalIssues.map((issue: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-[#FF0000]/10 text-[#FF0000] rounded-full text-sm font-medium">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-6 border-t-2 border-[#FEC925]/30">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#1C1C1B]">Estimated Value:</span>
                  <span className="text-3xl font-bold text-[#1B8A05]">
                    ₹{deviceDetails.finalPrice?.toLocaleString() || '0'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">*Final price may vary based on physical verification</p>
              </div>
            </div>
          </motion.div>

          {/* Pickup Address Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-2 border-[#1B8A05]/20 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#1B8A05]/20 rounded-full flex items-center justify-center">
                <MapPin className="text-[#1B8A05]" size={24} />
              </div>
              <h3 className="font-bold text-2xl text-[#1C1C1B]">Pickup Address</h3>
            </div>
            
            <div className="space-y-3">
              <p className="font-bold text-lg text-[#1C1C1B]">{address.full_name}</p>
              <p className="text-gray-700 leading-relaxed">{address.address_line1}</p>
              {address.address_line2 && <p className="text-gray-700 leading-relaxed">{address.address_line2}</p>}
              {address.landmark && <p className="text-gray-600 text-sm">Near: {address.landmark}</p>}
              <p className="text-gray-700 font-semibold">{address.city}, {address.state} - {address.pincode}</p>
              <p className="text-[#1B8A05] font-bold text-lg flex items-center gap-2 mt-4">
                <span>📞</span> {address.phone}
              </p>
            </div>
          </motion.div>

          {/* Pickup Slot Card */}
          {slot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-2 border-[#FEC925]/20 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#FEC925]/20 rounded-full flex items-center justify-center">
                  <Calendar className="text-[#FEC925]" size={24} />
                </div>
                <h3 className="font-bold text-2xl text-[#1C1C1B]">Pickup Schedule</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#EEEFFF] to-[#FFEFF6] rounded-xl">
                  <Calendar className="text-[#FEC925]" size={32} />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Date</p>
                    <p className="text-lg font-bold text-[#1C1C1B]">
                      {new Date(slot.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#EEEFFF] to-[#FFEFF6] rounded-xl">
                  <Clock className="text-[#1B8A05]" size={32} />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Time Slot</p>
                    <p className="text-lg font-bold text-[#1C1C1B]">{slot.time}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Important Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-[#EAF6F4] to-[#F0F7F6] p-6 rounded-xl border-l-4 border-[#1B8A05]"
          >
            <h4 className="font-bold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
              <CheckCircle className="text-[#1B8A05]" size={24} />
              What happens next?
            </h4>
            <ul className="space-y-2 text-[#1C1C1B]">
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">✓</span>
                <span>Our verified partner will visit your location at the scheduled time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">✓</span>
                <span>Physical inspection will be conducted to verify device condition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">✓</span>
                <span>Final price will be offered based on inspection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">✓</span>
                <span>Payment will be credited to your wallet instantly upon acceptance</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 pt-4"
          >
            <button
              onClick={onBack}
              disabled={loading}
              className="flex-1 py-4 border-2 border-[#1C1C1B] text-[#1C1C1B] rounded-xl hover:bg-[#1C1C1B] hover:text-white transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back to Edit
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Creating Your Order...
                </>
              ) : (
                <>
                  <CheckCircle size={24} />
                  Confirm Order
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface DetailRowProps {
  label: string;
  value: string | number;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="font-bold text-[#1C1C1B] text-right">{value}</span>
  </div>
);

export default PreviewPage;