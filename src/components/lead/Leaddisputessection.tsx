// src/components/lead/LeadDisputesSection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface Dispute {
  id: string;
  dispute_number: string;
  dispute_type: string;
  status: string;
  priority: string;
  description: string;
  created_at: string;
  resolved_at: string | null;
}

interface LeadDisputesSectionProps {
  leadId: string;
}

const DISPUTE_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  'pricing': { label: 'Pricing Dispute', icon: '💰' },
  'device_condition': { label: 'Device Condition', icon: '📱' },
  'missing_items': { label: 'Missing Items', icon: '📦' },
  'partner_behavior': { label: 'Partner Behavior', icon: '👤' },
  'payment': { label: 'Payment Issue', icon: '💳' },
  'other': { label: 'Other', icon: '❓' }
};

const STATUS_COLORS: Record<string, string> = {
  'pending': 'bg-[#FEC925]/20 text-[#b48f00]',
  'under_review': 'bg-blue-100 text-blue-800',
  'resolved': 'bg-[#1B8A05]/20 text-[#1B8A05]',
  'escalated': 'bg-[#FF0000]/10 text-[#FF0000]'
};

const PRIORITY_COLORS: Record<string, string> = {
  'low': 'bg-gray-100 text-gray-600',
  'medium': 'bg-[#FEC925]/20 text-[#b48f00]',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-[#FF0000]/10 text-[#FF0000]'
};

const LeadDisputesSection: React.FC<LeadDisputesSectionProps> = ({ leadId }) => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) return;
    loadDisputes();
  }, [leadId]);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${API_BASE_URL}/ops/disputes/?lead=${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          setDisputes([]);
          return;
        }
        throw new Error('Failed to load disputes');
      }

      const data = await res.json();
      setDisputes(data.results || data || []);

    } catch (err: any) {
      console.error('Failed to load disputes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-[#FEC925]" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#FF0000]/10 rounded-xl text-center">
        <AlertTriangle className="text-[#FF0000] mx-auto mb-2" size={24} />
        <p className="text-sm text-[#FF0000] font-semibold">{error}</p>
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl text-center">
        <CheckCircle className="text-[#1B8A05] mx-auto mb-3" size={32} />
        <p className="text-gray-700 font-semibold">No disputes raised</p>
        <p className="text-sm text-gray-500 mt-1">All good! No issues reported for this lead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {disputes.map((dispute, index) => {
        const typeInfo = DISPUTE_TYPE_LABELS[dispute.dispute_type] || { label: dispute.dispute_type, icon: '❓' };
        
        return (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-200 hover:shadow-lg hover:border-[#FEC925]/50 transition cursor-pointer"
            onClick={() => navigate(`/disputes/${dispute.id}`)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF0000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{typeInfo.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1C1B]">{typeInfo.label}</h4>
                  <p className="text-xs text-gray-500">#{dispute.dispute_number}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/disputes/${dispute.id}`);
                }}
                className="p-2 bg-[#FEC925]/20 rounded-lg hover:bg-[#FEC925] transition"
                title="View details"
              >
                <Eye size={16} className="text-[#1C1C1B]" />
              </button>
            </div>

            {/* Description Preview */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {dispute.description}
            </p>

            {/* Status & Priority */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[dispute.status] || 'bg-gray-200 text-gray-600'}`}>
                {formatStatus(dispute.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_COLORS[dispute.priority] || 'bg-gray-200 text-gray-600'}`}>
                {formatStatus(dispute.priority)} Priority
              </span>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>Raised on {formatDate(dispute.created_at)}</span>
              </div>
              {dispute.resolved_at && (
                <div className="flex items-center gap-2 text-[#1B8A05]">
                  <CheckCircle size={12} />
                  <span>Resolved {formatDate(dispute.resolved_at)}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* View All Button */}
      {disputes.length > 0 && (
        <button
          onClick={() => navigate('/disputes')}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#FEC925] hover:text-[#FEC925] transition font-semibold"
        >
          View All Disputes ({disputes.length})
        </button>
      )}
    </div>
  );
};

export default LeadDisputesSection;