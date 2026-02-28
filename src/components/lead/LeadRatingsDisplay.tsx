// src/components/lead/LeadRatingsDisplay.tsx
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface RatingDetails {
  rating: number;
  communication?: number;
  professionalism?: number;
  timeliness?: number;
  review?: string;
  created_at: string;
}

interface RatingInfo {
  has_review: boolean;
  partner_rating: RatingDetails | null;
  overall_rating: RatingDetails | null;
}

interface LeadRatingsDisplayProps {
  leadId: string;
}

const LeadRatingsDisplay: React.FC<LeadRatingsDisplayProps> = ({ leadId }) => {
  const [ratingInfo, setRatingInfo] = useState<RatingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      if (!leadId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/ops/ratings/lead_ratings/?lead_id=${leadId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setRatingInfo(data);
        }
      } catch (err) {
        console.error('Failed to fetch lead ratings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [leadId]);

  if (loading || !ratingInfo?.has_review) return null;

  const { partner_rating, overall_rating } = ratingInfo;
  const displayRating = partner_rating?.rating || overall_rating?.rating || 0;

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-[#1B8A05]/20 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-[#FEC925]" size={20} fill="#FEC925" />
        <h3 className="text-lg font-bold text-[#1C1C1B]">Customer Feedback</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="text-4xl font-black text-[#1C1C1B]">{displayRating}</div>
        <div className="flex flex-wrap gap-2">
          {partner_rating && (
            <>
              <RatingBadge label="Comm" value={partner_rating.communication} color="bg-blue-50 text-blue-700" />
              <RatingBadge label="Prof" value={partner_rating.professionalism} color="bg-green-50 text-green-700" />
              <RatingBadge label="Time" value={partner_rating.timeliness} color="bg-purple-50 text-purple-700" />
            </>
          )}
        </div>
      </div>

      {overall_rating?.review && (
        <div className="p-4 bg-gray-50 rounded-xl italic text-gray-600 text-sm border-l-4 border-[#FEC925]">
          "{overall_rating.review}"
        </div>
      )}
    </div>
  );
};

// Internal helper for clean badges
const RatingBadge = ({ label, value, color }: { label: string; value?: number; color: string }) => {
  if (value === undefined || value === null) return null;
  return (
    <span className={`px-2 py-1 ${color} text-xs rounded-md font-bold border border-current opacity-80`}>
      {label}: {value}/5
    </span>
  );
};

export default LeadRatingsDisplay;