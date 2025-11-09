// src/components/RaiseDisputeModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, AlertTriangle } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

interface RaiseDisputeModalProps {
  leadId: string;
  leadNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Function to refresh the lead details on success
}

const disputeReasons = [
  "Partner was unprofessional",
  "Partner did not arrive",
  "Price offered was unfair",
  "Item damaged during inspection",
  "Other",
];

const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
  leadId,
  leadNumber,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [detailedReason, setDetailedReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a reason for your dispute.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Authentication required.");

      // This uses the 'cancel' endpoint as it's the only one available
      const payload = {
        reason: selectedReason,
        detailed_reason: detailedReason
      };

      const res = await fetch(`${API_BASE_URL}/leads/${leadId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to submit dispute (${res.status})`);
      }

      // Success
      onSuccess(); // Refresh lead details
      onClose(); // Close modal

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FF0000]/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-[#FF0000]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1C1C1B]">Report an Issue</h2>
                  <p className="text-gray-600">Lead #{leadNumber}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-[#FF0000]/10 rounded-lg text-sm text-[#FF0000] font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-lg text-[#1C1C1B] mb-3">
                  What is the issue?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {disputeReasons.map((reason) => (
                    <button
                      type="button"
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        selectedReason === reason
                          ? 'bg-[#FEC925]/20 border-[#FEC925] ring-2 ring-[#FEC925]/50 font-bold'
                          : 'border-gray-300 hover:border-[#FEC925]'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="detailedReason"
                  className="block font-semibold text-lg text-[#1C1C1B] mb-3"
                >
                  Please provide more details (optional)
                </label>
                <textarea
                  id="detailedReason"
                  value={detailedReason}
                  onChange={(e) => setDetailedReason(e.target.value)}
                  placeholder="Tell us what happened..."
                  rows={4}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-bold text-lg text-[#1C1C1B] transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#FF0000] text-white rounded-xl hover:shadow-2xl hover:bg-[#d90000] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Dispute'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RaiseDisputeModal;