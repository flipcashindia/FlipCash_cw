import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CancelLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadNumber: string;
  onSuccess: () => void;
}

// Cancellation reasons matching the image provided
const CANCELLATION_REASONS = [
  { value: 'gave_it_to_someone', label: 'Gave it to someone' },
  { value: 'not_confident_about_payment', label: 'Not confident about payment' },
  { value: 'others', label: 'Others' },
  { value: 'required_documents_not_available', label: 'Required documents not available' },
  { value: 'not_confident_about_flipcash', label: 'Not confident about Flipcash!' },
  { value: 'not_interested', label: 'Not interested, was just exploring the option' },
  { value: 'no_one_contacted', label: 'No one from Flipcash contacted me' },
  { value: 'reschedule', label: 'Would like to reschedule' },
  { value: 'sold_in_network', label: 'Sold it in my network' },
  { value: 'device_under_emi', label: 'Device is still under EMI' },
  { value: 'got_better_price', label: 'Got a better price' }
];

const CancelLeadModal: React.FC<CancelLeadModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadNumber,
  onSuccess
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [detailedReason, setDetailedReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!selectedReason) {
      setError('Please select a reason for cancellation');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${API_BASE_URL}/leads/leads/${leadId}/cancel/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            reason: CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label || selectedReason,
            detailed_reason: detailedReason
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.error || 
          'Failed to cancel lead'
        );
      }

      // Success
      onSuccess();
      onClose();
      
      // Reset form
      setSelectedReason('');
      setDetailedReason('');
      
    } catch (err: any) {
      console.error('Cancel lead error:', err);
      setError(err.message || 'An error occurred while cancelling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setDetailedReason('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-[#FEC925]/20 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF0000]/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-[#FF0000]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1B]">Cancel Lead</h2>
                <p className="text-sm text-gray-600">Lead #{leadNumber}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-[#FF0000] transition disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-center gap-3"
              >
                <AlertTriangle className="text-[#FF0000] flex-shrink-0" size={20} />
                <p className="text-sm font-semibold text-[#1C1C1B]">{error}</p>
              </motion.div>
            )}

            {/* Warning Message */}
            <div className="bg-[#FEC925]/10 border-2 border-[#FEC925] rounded-xl p-4">
              <p className="text-sm font-semibold text-[#1C1C1B]">
                ⚠️ This action cannot be undone. Your lead will be permanently cancelled.
              </p>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block font-bold text-[#1C1C1B] mb-4">
                Please select the reason
              </label>
              <p className="text-sm text-gray-600 mb-4">
                It will help us process your request
              </p>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason.value}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedReason === reason.value
                        ? 'border-[#FEC925] bg-[#FEC925]/10'
                        : 'border-gray-200 hover:border-[#FEC925]/50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="cancellation_reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      disabled={isSubmitting}
                      className="w-5 h-5 text-[#FEC925] focus:ring-[#FEC925] cursor-pointer"
                    />
                    <span className="font-medium text-[#1C1C1B]">
                      {reason.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details (Optional) */}
            <div>
              <label className="block font-bold text-[#1C1C1B] mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={detailedReason}
                onChange={(e) => setDetailedReason(e.target.value)}
                disabled={isSubmitting}
                placeholder="Provide more details about your cancellation..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FEC925] focus:outline-none transition resize-none"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t-2 border-[#FEC925]/20 p-6 flex gap-4">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 text-[#1C1C1B] rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50"
            >
              Go Back
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 px-6 py-3 bg-[#FF0000] text-white rounded-xl font-bold hover:bg-[#CC0000] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Cancelling...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CancelLeadModal;