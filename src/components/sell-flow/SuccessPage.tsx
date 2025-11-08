import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Package, Wallet, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useSellFlow } from '../../context/SellFlowContext';
import confetti from 'canvas-confetti';

interface SuccessPageProps {
  onGoHome: () => void;
  onViewLeads: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onGoHome, onViewLeads }) => {
  const { leadId, deviceDetails, slot, address, resetFlow } = useSellFlow();

  useEffect(() => {
    // Trigger confetti animation on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        },
        colors: ['#FEC925', '#1B8A05', '#1C1C1B']
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#FEC925', '#1B8A05', '#1C1C1B']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    resetFlow();
    onGoHome();
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-16 flex items-center justify-center px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center border-2 border-[#FEC925]/30"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#1B8A05] to-[#FEC925] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <CheckCircle size={64} className="text-white" strokeWidth={3} />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1B] mb-4">
              Order Placed Successfully! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your device selling request has been confirmed
            </p>
          </motion.div>

          {/* Order ID */}
          {leadId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-block mb-8 px-6 py-3 bg-gradient-to-r from-[#FEC925]/20 to-[#1B8A05]/20 rounded-xl border-2 border-[#FEC925]"
            >
              <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
              <p className="text-2xl font-bold text-[#1C1C1B]">#{leadId.slice(0, 8).toUpperCase()}</p>
            </motion.div>
          )}

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-[#EEEFFF] to-[#FFEFF6] p-6 md:p-8 rounded-2xl mb-8 text-left space-y-4"
          >
            <h3 className="font-bold text-xl text-[#1C1C1B] mb-4 flex items-center gap-2">
              <Package className="text-[#FEC925]" size={24} />
              Order Summary
            </h3>

            {deviceDetails && (
              <>
                <SummaryRow
                  icon={<Package size={20} className="text-[#FEC925]" />}
                  label="Device"
                  value={`${deviceDetails.brandName} ${deviceDetails.modelName}`}
                />
                <SummaryRow
                  icon={<Wallet size={20} className="text-[#1B8A05]" />}
                  label="Estimated Value"
                  value={`₹${deviceDetails.finalPrice?.toLocaleString() || '0'}`}
                  highlight
                />
              </>
            )}

            {address && (
              <SummaryRow
                icon={<Home size={20} className="text-[#FEC925]" />}
                label="Pickup Location"
                value={`${address.city}, ${address.state}`}
              />
            )}

            {slot && (
              <>
                <SummaryRow
                  icon={<Calendar size={20} className="text-[#1B8A05]" />}
                  label="Pickup Date"
                  value={new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                />
                <SummaryRow
                  icon={<Clock size={20} className="text-[#FEC925]" />}
                  label="Time Slot"
                  value={slot.time}
                />
              </>
            )}
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#FEC925]/10 p-6 rounded-xl border-l-4 border-[#FEC925] mb-8 text-left"
          >
            <h4 className="font-bold text-lg text-[#1C1C1B] mb-3 flex items-center gap-2">
              <CheckCircle className="text-[#1B8A05]" size={20} />
              What happens next?
            </h4>
            <ul className="space-y-2 text-[#1C1C1B]">
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">1.</span>
                <span>Partner will be assigned to your order shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">2.</span>
                <span>You'll receive a notification with partner details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">3.</span>
                <span>Partner will visit at your scheduled time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">4.</span>
                <span>Device inspection and final price confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1B8A05] font-bold">5.</span>
                <span>Instant payment to your wallet upon acceptance</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <button
              onClick={onViewLeads}
              className="w-full py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-2xl transition font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
            >
              <Package size={24} />
              Track My Order
              <ArrowRight size={24} />
            </button>

            <button
              onClick={handleGoHome}
              className="w-full py-4 border-2 border-[#1C1C1B] text-[#1C1C1B] rounded-xl hover:bg-[#1C1C1B] hover:text-white transition font-bold text-lg flex items-center justify-center gap-3"
            >
              <Home size={24} />
              Back to Home
            </button>
          </motion.div>

          {/* Support Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-600 mt-8"
          >
            Need help? Contact our support team at{' '}
            <a href="mailto:support@flipcash.com" className="text-[#1B8A05] font-bold hover:underline">
              support@flipcash.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ icon, label, value, highlight }) => (
  <div className={`flex justify-between items-center py-3 border-b border-gray-200 last:border-0 ${
    highlight ? 'bg-[#1B8A05]/10 -mx-4 px-4 rounded-lg' : ''
  }`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-semibold text-gray-600">{label}:</span>
    </div>
    <span className={`font-bold text-right ${highlight ? 'text-[#1B8A05] text-xl' : 'text-[#1C1C1B]'}`}>
      {value}
    </span>
  </div>
);

export default SuccessPage;