import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadNumber: string;
  currentDate: string; // ISO date string
  currentTimeSlot: string;
  onSuccess: () => void;
}

// Time slots as specified: 9 AM - 1 PM, 1 PM - 5 PM, 5 PM - 9 PM
const TIME_SLOTS = [
  { value: '9:00 AM - 1:00 PM', label: '9:00 AM - 1:00 PM', icon: '🌅' },
  { value: '1:00 PM - 5:00 PM', label: '1:00 PM - 5:00 PM', icon: '☀️' },
  { value: '5:00 PM - 9:00 PM', label: '5:00 PM - 9:00 PM', icon: '🌆' }
];

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadNumber,
  currentDate,
  currentTimeSlot,
  onSuccess
}) => {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 5 days (excluding today)
  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    setAvailableDates(dates);
    
    // Pre-select first available date
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  // const formatDate = (date: Date): string => {
  //   return date.toLocaleDateString('en-IN', {
  //     weekday: 'short',
  //     day: 'numeric',
  //     month: 'short'
  //   });
  // };

  // const formatDateForAPI = (date: Date): string => {
  //   return date.toISOString().split('T')[0]; // YYYY-MM-DD
  // };

  const formatDateForAPI = (date: Date): string => {
    // ✅ More reliable date formatting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  // const isDateToday = (date: Date): boolean => {
  //   const today = new Date();
  //   return date.toDateString() === today.toDateString();
  // };

  // const handleReschedule = async () => {
  //   if (!selectedDate || !selectedTimeSlot) {
  //     setError('Please select both date and time slot');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     // const token = localStorage.getItem('access_token');
  //     const token = localStorage.getItem('access_token');
  //     if (!token) {
  //       throw new Error('Authentication required');
  //     }

  //     const response = await fetch(
  //       `${API_BASE_URL}/leads/leads/${leadId}/`,
  //       {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //           preferred_date: formatDateForAPI(selectedDate),
  //           preferred_time_slot: selectedTimeSlot,
  //           customer_notes: additionalNotes || undefined
  //         })
  //       }
  //     );
      console.log('reschedule : ', response)
  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(
  //         errorData.detail || 
  //         errorData.error || 
  //         'Failed to reschedule lead'
  //       );
  //     }

  //     // Success
  //     onSuccess();
  //     onClose();
      
  //     // Reset form
  //     setSelectedDate(availableDates[0]);
  //     setSelectedTimeSlot('');
  //     setAdditionalNotes('');
      
  //   } catch (err: any) {
  //     console.error('Reschedule error:', err);
  //     setError(err.message || 'An error occurred while rescheduling');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleReschedule = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select both date and time slot');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      // ✅ ADD THESE CHECKS:
      if (!token) {
        throw new Error('Please login again - session expired');
      }

      // ✅ LOG THE REQUEST FOR DEBUGGING:
      // console.log('🔐 Token exists:', !!token);
      // console.log('📤 Rescheduling lead:', leadId);
      // console.log('📅 New date:', formatDateForAPI(selectedDate));
      // console.log('⏰ New slot:', selectedTimeSlot);

      const response = await fetch(
        `${API_BASE_URL}/leads/leads/${leadId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // ✅ Already correct
          },
          body: JSON.stringify({
            preferred_date: formatDateForAPI(selectedDate),
            preferred_time_slot: selectedTimeSlot,
            customer_notes: additionalNotes || undefined  // ✅ Remove undefined fields
          })
        }
      );

      // ✅ LOG THE RESPONSE:
      // console.log('📥 Response status:', response.status);
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error response:', errorData);
        throw new Error(
          errorData.detail || 
          errorData.error || 
          'Failed to reschedule lead'
        );
      }

      const data = await response.json();
      // console.log('✅ Success:', data);

      // Success
      onSuccess();
      onClose();
      
      // Reset form
      setSelectedDate(availableDates[0]);
      setSelectedTimeSlot('');
      setAdditionalNotes('');
      
    } catch (err: any) {
      console.error('❌ Reschedule error:', err);
      setError(err.message || 'An error occurred while rescheduling');
    } finally {
      setIsSubmitting(false);
    }
  };




  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedDate(availableDates[0]);
      setSelectedTimeSlot('');
      setAdditionalNotes('');
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
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-[#FEC925]/20 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FEC925]/20 rounded-full flex items-center justify-center">
                <Calendar className="text-[#FEC925]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1B]">Reschedule Pickup</h2>
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
                <X className="text-[#FF0000] flex-shrink-0" size={20} />
                <p className="text-sm font-semibold text-[#1C1C1B]">{error}</p>
              </motion.div>
            )}

            {/* Current Schedule */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Current Schedule:</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#FEC925]" />
                  <span className="font-bold text-[#1C1C1B]">
                    {new Date(currentDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#FEC925]" />
                  <span className="font-bold text-[#1C1C1B]">{currentTimeSlot}</span>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block font-bold text-[#1C1C1B] mb-4">
                Select New Date
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choose a date within the next 5 days
              </p>

              <div className="grid grid-cols-5 gap-3">
                {availableDates.map((date, index) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      disabled={isSubmitting}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${isSelected
                          ? 'border-[#FEC925] bg-[#FEC925]/20 shadow-lg'
                          : 'border-gray-200 hover:border-[#FEC925]/50'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="text-center">
                        <p className={`text-xs font-semibold mb-1 ${
                          isSelected ? 'text-[#FEC925]' : 'text-gray-500'
                        }`}>
                          {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </p>
                        <p className={`text-2xl font-bold ${
                          isSelected ? 'text-[#1C1C1B]' : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </p>
                        <p className={`text-xs font-medium mt-1 ${
                          isSelected ? 'text-[#1C1C1B]' : 'text-gray-500'
                        }`}>
                          {date.toLocaleDateString('en-IN', { month: 'short' })}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          <CheckCircle className="text-[#1B8A05] mx-auto" size={20} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block font-bold text-[#1C1C1B] mb-4">
                Select Time Slot
              </label>

              <div className="space-y-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.value;
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => setSelectedTimeSlot(slot.value)}
                      disabled={isSubmitting}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${isSelected
                          ? 'border-[#FEC925] bg-[#FEC925]/20 shadow-lg'
                          : 'border-gray-200 hover:border-[#FEC925]/50'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <span className="text-3xl">{slot.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className={isSelected ? 'text-[#FEC925]' : 'text-gray-500'} />
                          <span className={`font-bold text-lg ${
                            isSelected ? 'text-[#1C1C1B]' : 'text-gray-700'
                          }`}>
                            {slot.label}
                          </span>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle className="text-[#1B8A05]" size={24} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes (Optional) */}
            <div>
              <label className="block font-bold text-[#1C1C1B] mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                disabled={isSubmitting}
                placeholder="Any special instructions for the pickup?"
                rows={3}
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
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={isSubmitting || !selectedDate || !selectedTimeSlot}
              className="flex-1 px-6 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#e5b520] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Rescheduling...
                </>
              ) : (
                <>
                  <Calendar size={20} />
                  Confirm Reschedule
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RescheduleModal;