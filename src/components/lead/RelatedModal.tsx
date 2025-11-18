// src/components/rating/RateLeadModal.tsx
import React, { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Star, ThumbsUp, MessageSquare, Clock, Award } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface RateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadNumber: string;
  partnerUserId: string;
  partnerName: string;
  onSuccess: () => void;
}

interface RatingCriteria {
  overall: number;
  communication: number;
  professionalism: number;
  timeliness: number;
}

const RateLeadModal: React.FC<RateLeadModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadNumber,
  partnerUserId,
  partnerName,
  onSuccess
}) => {
  const [ratings, setRatings] = useState<RatingCriteria>({
    overall: 0,
    communication: 0,
    professionalism: 0,
    timeliness: 0
  });
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStarClick = (category: keyof RatingCriteria, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleStarHover = (category: string, value: number) => {
    setHoveredStar(prev => ({ ...prev, [category]: value }));
  };

  const handleStarLeave = (category: string) => {
    setHoveredStar(prev => {
      const newState = { ...prev };
      delete newState[category];
      return newState;
    });
  };

  const getStarColor = (category: keyof RatingCriteria, position: number): string => {
    const currentRating = ratings[category];
    const hovered = hoveredStar[category] || 0;
    const displayValue = hovered || currentRating;

    return position <= displayValue ? '#FEC925' : '#E5E7EB';
  };

  const handleSubmit = async () => {
    // Validation
    if (ratings.overall === 0) {
      setError('Please provide an overall rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      // Submit two ratings: Partner rating and Overall experience
      const requests = [];

      // 1. Partner Rating
      requests.push(
        fetch(`${API_BASE_URL}/ops/ratings/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lead: leadId,
            rated_user: partnerUserId,
            rating_type: 'partner_by_customer',
            rating: ratings.overall,
            communication: ratings.communication || null,
            professionalism: ratings.professionalism || null,
            timeliness: ratings.timeliness || null,
            review: review.trim() || ''
          })
        })
      );

      // 2. Overall Experience Rating
      requests.push(
        fetch(`${API_BASE_URL}/ops/ratings/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lead: leadId,
            rated_user: partnerUserId, // Same user for overall experience
            rating_type: 'overall_experience',
            rating: ratings.overall,
            review: review.trim() || ''
          })
        })
      );

      const responses = await Promise.all(requests);

      // Check if all requests succeeded
      for (const res of responses) {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || err.error || 'Failed to submit rating');
        }
      }

      // Success
      onSuccess();
      onClose();
      
      // Reset form
      setRatings({ overall: 0, communication: 0, professionalism: 0, timeliness: 0 });
      setReview('');

    } catch (err: any) {
      console.error('Rating submission error:', err);
      setError(err.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRatings({ overall: 0, communication: 0, professionalism: 0, timeliness: 0 });
      setReview('');
      setError(null);
      onClose();
    }
  };

  const renderStars = (category: keyof RatingCriteria, label: string, icon: ReactNode) => {
    return (
      <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-bold text-[#1C1C1B]">{label}</span>
          </div>
          <span className="text-sm font-semibold text-[#FEC925]">
            {ratings[category] > 0 ? `${ratings[category]}/5` : 'Not Rated'}
          </span>
        </div>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(category, star)}
              onMouseEnter={() => handleStarHover(category, star)}
              onMouseLeave={() => handleStarLeave(category)}
              disabled={loading}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                size={36}
                fill={getStarColor(category, star)}
                stroke={getStarColor(category, star)}
                className="transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-[#FEC925]/20 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FEC925]/20 rounded-full flex items-center justify-center">
                <Award className="text-[#FEC925]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1B]">Rate Your Experience</h2>
                <p className="text-gray-600">Lead #{leadNumber}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
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

            {/* Partner Info */}
            <div className="bg-gradient-to-r from-[#FEC925]/10 to-[#1B8A05]/10 p-4 rounded-xl border-2 border-[#FEC925]/20">
              <p className="text-sm text-gray-600 mb-1">Service Partner</p>
              <p className="font-bold text-xl text-[#1C1C1B]">{partnerName}</p>
            </div>

            {/* Overall Rating - Required */}
            <div>
              <label className="block font-bold text-lg text-[#1C1C1B] mb-4">
                Overall Experience * <span className="text-sm text-gray-500">(Required)</span>
              </label>
              {renderStars('overall', 'Overall Rating', <Star className="text-[#FEC925]" size={20} />)}
            </div>

            {/* Rating Categories - Optional */}
            <div>
              <label className="block font-bold text-lg text-[#1C1C1B] mb-4">
                Detailed Ratings <span className="text-sm text-gray-500">(Optional)</span>
              </label>
              <div className="space-y-3">
                {renderStars('communication', 'Communication', <MessageSquare className="text-blue-600" size={20} />)}
                {renderStars('professionalism', 'Professionalism', <ThumbsUp className="text-[#1B8A05]" size={20} />)}
                {renderStars('timeliness', 'Timeliness', <Clock className="text-purple-600" size={20} />)}
              </div>
            </div>

            {/* Written Review */}
            <div>
              <label className="block font-bold text-lg text-[#1C1C1B] mb-2">
                Share Your Experience <span className="text-sm text-gray-500">(Optional)</span>
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                disabled={loading}
                placeholder="Tell us about your experience with the partner and the overall service..."
                rows={5}
                maxLength={500}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FEC925] focus:outline-none transition resize-none disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {review.length} / 500 characters
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-[#1C1C1B] mb-2 flex items-center gap-2">
                <Award size={16} className="text-blue-600" />
                Why Your Rating Matters
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Helps us improve our service quality</li>
                <li>• Assists other customers in choosing partners</li>
                <li>• Rewards excellent service providers</li>
                <li>• Your feedback is verified and trusted</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t-2 border-[#FEC925]/20 p-6 flex gap-4">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 text-[#1C1C1B] rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || ratings.overall === 0}
              className="flex-1 px-6 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#e5b520] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <Award size={20} />
                  Submit Rating
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RateLeadModal;