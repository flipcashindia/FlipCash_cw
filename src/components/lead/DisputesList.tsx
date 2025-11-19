// src/pages/disputes/DisputesList.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Loader2, 
  Search,
  Filter,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface Dispute {
  id: string;
  dispute_number: string;
  lead: string;
  lead_number: string;
  lead_status: string;
  raised_by: string;
  raised_by_name: string;
  dispute_type: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  resolution_type: string;
  resolution_notes: string;
  resolution_amount: string | null;
  created_at: string;
  resolved_at: string | null;
  updated_at: string;
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
    icon: <Search size={16} />
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
  },
  'closed': {
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    icon: <XCircle size={16} />
  }
};

const DisputesList: React.FC = () => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${API_BASE_URL}/ops/disputes/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error('Failed to load disputes');
      }

      const data = await res.json();
      // Handle both paginated and non-paginated responses
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

  // Filter disputes
  const filteredDisputes = disputes.filter(dispute => {
    const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
    const matchesSearch = 
      dispute.dispute_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.lead_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    total: disputes.length,
    pending: disputes.filter(d => d.status === 'pending').length,
    under_review: disputes.filter(d => d.status === 'under_review').length,
    resolved: disputes.filter(d => d.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading Disputes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#FF0000]/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-[#FF0000]" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-[#1C1C1B]">My Disputes</h1>
          </div>
          <p className="text-gray-600">Track and manage your dispute resolutions</p>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="text-[#FF0000]" size={24} />
              <p className="font-semibold text-[#1C1C1B]">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-[#FF0000] hover:opacity-70"
              >
                <XCircle size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">Total Disputes</p>
            <p className="text-3xl font-bold text-[#1C1C1B]">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#FEC925]/20"
          >
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-[#FEC925]">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-200"
          >
            <p className="text-sm text-gray-600 mb-1">Under Review</p>
            <p className="text-3xl font-bold text-blue-600">{stats.under_review}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#1B8A05]/20"
          >
            <p className="text-sm text-gray-600 mb-1">Resolved</p>
            <p className="text-3xl font-bold text-[#1B8A05]">{stats.resolved}</p>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by dispute number, lead number, or description..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FEC925] focus:outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FEC925] focus:outline-none transition appearance-none bg-white font-semibold text-[#1C1C1B] min-w-[200px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Disputes List */}
        <div className="space-y-4">
          {filteredDisputes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-2xl shadow-lg text-center"
            >
              <AlertTriangle className="text-gray-300 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Disputes Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'You haven\'t raised any disputes yet'}
              </p>
            </motion.div>
          ) : (
            filteredDisputes.map((dispute, index) => {
              const statusConfig = STATUS_CONFIG[dispute.status] || STATUS_CONFIG['pending'];
              
              return (
                <motion.div
                  key={dispute.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/disputes/${dispute.id}`)}
                  className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-[#FEC925] hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-[#1C1C1B]">
                          {dispute.dispute_number}
                        </h3>
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

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-600">Lead:</span>
                          <span className="text-[#1C1C1B] font-medium">{dispute.lead_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-600">Type:</span>
                          <span className="text-[#1C1C1B] font-medium">
                            {DISPUTE_TYPE_LABELS[dispute.dispute_type] || dispute.dispute_type}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2">
                        {dispute.description}
                      </p>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Calendar size={14} />
                          {formatDate(dispute.created_at)}
                        </div>
                        {dispute.resolved_at && (
                          <div className="text-xs text-[#1B8A05] font-semibold">
                            Resolved on {formatDate(dispute.resolved_at)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/disputes/${dispute.id}`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FEC925] text-[#1C1C1B] rounded-lg font-semibold hover:bg-[#e5b520] transition"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default DisputesList;