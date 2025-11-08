import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const SlotBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceDetails, address } = location.state || {};

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    return date.toISOString().split('T')[0];
  });

  const timeSlots = [
    { value: '09:00-12:00', label: '09:00 AM - 12:00 PM', icon: '🌅' },
    { value: '12:00-15:00', label: '12:00 PM - 03:00 PM', icon: '☀️' },
    { value: '15:00-18:00', label: '03:00 PM - 06:00 PM', icon: '🌤️' },
    { value: '18:00-21:00', label: '06:00 PM - 09:00 PM', icon: '🌆' },
  ];

  const handleContinue = () => {
    setError('');

    if (!selectedDate) {
      setError('Please select a pickup date');
      return;
    }

    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }

    const selectedSlot = timeSlots.find(slot => slot.value === selectedTime);

    navigate('/preview', {
      state: {
        deviceDetails,
        address,
        slot: { 
          date: selectedDate, 
          time: selectedSlot?.label || selectedTime 
        }
      }
    });
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
          <p className="text-gray-600 mb-6">Please complete previous steps first</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
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
              <Calendar className="text-[#1C1C1B]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1B] mb-2">Schedule Pickup</h2>
            <p className="text-gray-600 text-lg">Choose a convenient date and time</p>
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
              <p className="font-bold text-[#FF0000]">Required</p>
              <p className="text-[#1C1C1B]">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-[#FF0000] hover:text-[#FF0000]/70">
              ✕
            </button>
          </motion.div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl space-y-8 border-2 border-[#FEC925]/20">
          {/* Date Selection */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#FEC925]/20 rounded-full flex items-center justify-center">
                <Calendar className="text-[#FEC925]" size={24} />
              </div>
              <h3 className="font-bold text-2xl text-[#1C1C1B]">Select Pickup Date</h3>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {dates.map((date, index) => {
                const dateObj = new Date(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                const isTomorrow = index === 0;

                return (
                  <motion.button
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`p-4 rounded-xl font-bold transition-all shadow-lg relative overflow-hidden ${
                      selectedDate === date
                        ? 'bg-gradient-to-br from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] ring-4 ring-[#FEC925]/50'
                        : 'bg-white border-2 border-gray-300 hover:border-[#FEC925] text-gray-700'
                    }`}
                  >
                    {isTomorrow && (
                      <div className="absolute top-1 left-1 right-1 text-[10px] font-bold text-[#1B8A05] bg-[#1B8A05]/10 rounded px-1">
                        Tomorrow
                      </div>
                    )}
                    <div className={`text-xs mb-1 ${isTomorrow ? 'mt-3' : ''}`}>
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-2xl mb-1">{dateObj.getDate()}</div>
                    <div className="text-xs">
                      {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#1B8A05]/20 rounded-full flex items-center justify-center">
                <Clock className="text-[#1B8A05]" size={24} />
              </div>
              <h3 className="font-bold text-2xl text-[#1C1C1B]">Select Time Slot</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeSlots.map((slot, index) => (
                <motion.button
                  key={slot.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTime(slot.value)}
                  disabled={!selectedDate}
                  className={`p-6 rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedTime === slot.value
                      ? 'bg-gradient-to-br from-[#1B8A05] to-[#FEC925] text-white ring-4 ring-[#1B8A05]/30'
                      : 'bg-white border-2 border-gray-300 hover:border-[#1B8A05] text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{slot.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{slot.label}</div>
                      </div>
                    </div>
                    {selectedTime === slot.value && (
                      <CheckCircle size={24} className="flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-[#EEEFFF] to-[#FFEFF6] p-6 rounded-xl border-l-4 border-[#FEC925]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#1B8A05]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-[#1B8A05]" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#1C1C1B] mb-2">What to Expect</h4>
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
                    <span>Final price offered based on inspection (may differ from estimate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B8A05] font-bold">✓</span>
                    <span>Instant payment to your wallet upon acceptance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className="w-full py-6 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-lg transition flex items-center justify-center gap-3"
          >
            Continue to Review
            <ArrowRight size={24} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SlotBooking;