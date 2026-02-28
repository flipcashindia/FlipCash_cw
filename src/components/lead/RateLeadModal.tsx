// src/components/rating/RateLeadModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, X, Star, ThumbsUp, MessageSquare, 
  Clock, Award, CheckCircle2, ChevronRight, ChevronLeft 
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface RateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadNumber: string;
  partnerUserId: any; // Changed to any to handle both string and object
  partnerName: string;
  onSuccess: () => void;
}

type Step = 'overall' | 'detailed' | 'success';

const RateLeadModal: React.FC<RateLeadModalProps> = ({
  isOpen, onClose, leadId, leadNumber, partnerUserId, partnerName, onSuccess
}) => {
  const [step, setStep] = useState<Step>('overall');
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    professionalism: 0,
    timeliness: 0
  });
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHAR = 500;

  // FIX: Extract UUID string if partnerUserId is an object
  const getPartnerId = () => {
    if (typeof partnerUserId === 'object' && partnerUserId !== null) {
      return partnerUserId.id;
    }
    return partnerUserId;
  };

  const handleStarClick = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
    if (category === 'overall' && step === 'overall') {
      setTimeout(() => setStep('detailed'), 400);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const partnerId = getPartnerId(); // Use the extracted ID

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Dual POST strategy required by backend unique_together constraint
      const requests = [
        fetch(`${API_BASE_URL}/ops/ratings/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            lead: leadId,
            rated_user: partnerId,
            rating_type: 'partner_by_customer',
            rating: ratings.overall,
            communication: ratings.communication || null,
            professionalism: ratings.professionalism || null,
            timeliness: ratings.timeliness || null
          })
        }),
        fetch(`${API_BASE_URL}/ops/ratings/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            lead: leadId,
            rated_user: partnerId,
            rating_type: 'overall_experience',
            rating: ratings.overall,
            review: review.trim()
          })
        })
      ];

      const responses = await Promise.all(requests);
      for (const res of responses) {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || errData.lead?.[0] || "Submission failed");
        }
      }

      setStep('success');
      onSuccess();
      setTimeout(handleClose, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('overall');
    setRatings({ overall: 0, communication: 0, professionalism: 0, timeliness: 0 });
    setReview('');
    onClose();
  };

  const renderStarGroup = (key: string, label: string, icon: React.ReactNode, color: string) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {icon} <span className="font-bold text-gray-800">{label}</span>
        </div>
        <span className="text-xs font-bold text-gray-400">{ratings[key as keyof typeof ratings]}/5</span>
      </div>
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((star) => {
          const isSelected = star <= (hoveredStar[key] || ratings[key as keyof typeof ratings]);
          return (
            <button key={star} onMouseEnter={() => setHoveredStar({ [key]: star })} onMouseLeave={() => setHoveredStar({})}
              onClick={() => handleStarClick(key, star)} className="transition-transform active:scale-90">
              <Star size={28} fill={isSelected ? color : 'none'} className={isSelected ? 'text-transparent' : 'text-gray-200'} />
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'overall' ? (
              <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-6">
                  <Award className="text-[#FEC925] mx-auto mb-4" size={48} />
                  <h2 className="text-2xl font-black">How was {partnerName}?</h2>
                </div>
                {renderStarGroup('overall', 'Overall Rating', <Star className="text-yellow-500" />, '#FEC925')}
                {error && <p className="text-red-500 text-sm mt-4 text-center font-bold">{error}</p>}
              </motion.div>
            ) : step === 'detailed' ? (
              <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Detailed Feedback</h3>
                  <button onClick={() => setStep('overall')} className="text-xs text-gray-400 flex items-center gap-1"><ChevronLeft size={14}/> Back</button>
                </div>
                {renderStarGroup('communication', 'Communication', <MessageSquare className="text-blue-500" />, '#3B82F6')}
                {renderStarGroup('professionalism', 'Professionalism', <ThumbsUp className="text-green-500" />, '#22C55E')}
                {renderStarGroup('timeliness', 'Timeliness', <Clock className="text-purple-500" />, '#A855F7')}
                <textarea className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#FEC925] outline-none h-24 resize-none"
                  placeholder="Review comments..." value={review} maxLength={MAX_CHAR} onChange={(e) => setReview(e.target.value)} />
                <p className="text-right text-[10px] text-gray-400">{review.length}/{MAX_CHAR}</p>
              </motion.div>
            ) : (
              <div className="py-10 text-center">
                <CheckCircle2 className="text-green-500 mx-auto mb-4" size={64} />
                <h2 className="text-2xl font-bold">Feedback Received!</h2>
              </div>
            )}
          </AnimatePresence>
        </div>
        {step !== 'success' && (
          <div className="p-6 bg-gray-50 flex gap-3">
            <button onClick={handleClose} className="px-6 py-3 text-gray-400 font-bold">Cancel</button>
            <button onClick={step === 'overall' ? () => setStep('detailed') : handleSubmit} disabled={loading || ratings.overall === 0}
              className="flex-1 bg-[#FEC925] py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <>{step === 'overall' ? 'Next' : 'Submit'} <ChevronRight size={20}/></>}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RateLeadModal;