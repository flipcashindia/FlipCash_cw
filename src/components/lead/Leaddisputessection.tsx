// src/components/lead/LeadDisputesSection.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Loader2,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface Dispute {
  id: string;
  dispute_number: string;
  dispute_type: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  resolved_at: string | null;
}

interface LeadDisputesSectionProps {
  leadId: string;
}

const DISPUTE_TYPE_LABELS: Record<string, string> = {
  'pricing': 'Pricing Dispute',
  'device_condition': 'Device Condition',
  'missing_items': 'Missing Items',
  'partner_behavior': 'Partner Behavior',
  'payment': 'Payment Issue',
  'other': 'Other'
};

const STATUS_CONFIG: Record<string, { color: string; bgColor: string; icon: ReactNode }> = {
  'pending': {
    color: '#FEC925',
    bgColor: 'rgba(254, 201, 37, 0.1)',
    icon: <Clock size={16} />
  },
  'under_review': {
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: <AlertTriangle size={16} />
  },
  'resolved': {
    color: '#1B8A05',
    bgColor: 'rgba(27, 138, 5, 0.1)',
    icon: <CheckCircle size={16} />
  },
  'escalated': {
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    icon: <TrendingUp size={16} />
  }
};

const LeadDisputesSection: React.FC<LeadDisputesSectionProps> = ({ leadId }) => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leadId) {
      loadLeadDisputes();
    }
  }, [leadId]);

  const loadLeadDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Filter disputes by lead
      const res = await fetch(`${API_BASE_URL}/ops/disputes/?lead=${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to load disputes');
      }

      const data = await res.json();
      setDisputes(data.results || data);

    } catch (err: any) {
      console.error('Failed to load disputes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-[#FEC925]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-center gap-3">
        <AlertTriangle className="text-[#FF0000]" size={20} />
        <p className="text-sm font-semibold text-[#1C1C1B]">{error}</p>
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-xl text-center border-2 border-gray-200">
        <AlertTriangle className="text-gray-300 mx-auto mb-3" size={48} />
        <p className="text-gray-600 font-semibold">No disputes raised for this lead</p>
        <p className="text-sm text-gray-500 mt-1">All clear! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#1C1C1B] flex items-center gap-2">
          <AlertTriangle className="text-[#FEC925]" size={24} />
          Disputes ({disputes.length})
        </h3>
      </div>

      {disputes.map((dispute, index) => {
        const statusConfig = STATUS_CONFIG[dispute.status] || STATUS_CONFIG['pending'];
        
        return (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/disputes/${dispute.id}`)}
            className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-[#FEC925] hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-[#1C1C1B]">{dispute.dispute_number}</h4>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{
                      color: statusConfig.color,
                      backgroundColor: statusConfig.bgColor
                    }}
                  >
                    {statusConfig.icon}
                    {formatStatus(dispute.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Type:</span> {DISPUTE_TYPE_LABELS[dispute.dispute_type] || dispute.dispute_type}
                </p>

                <p className="text-sm text-gray-700 line-clamp-2">
                  {dispute.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(dispute.created_at)}
                  </div>
                  {dispute.resolved_at && (
                    <div className="text-[#1B8A05] font-semibold">
                      Resolved on {formatDate(dispute.resolved_at)}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/disputes/${dispute.id}`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#FEC925]/20 text-[#1C1C1B] rounded-lg font-semibold hover:bg-[#FEC925] transition text-sm"
              >
                View
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LeadDisputesSection;