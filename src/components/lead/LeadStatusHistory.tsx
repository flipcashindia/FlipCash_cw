// src/components/lead/LeadStatusHistory.tsx
import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface StatusLog {
  id: string;
  from_status: string;
  from_status_display: string;
  to_status: string;
  to_status_display: string;
  changed_by: string;
  changed_by_name: string;
  reason: string;
  metadata: Record<string, any>;
  created_at: string;
}

interface LeadStatusHistoryProps {
  leadId: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'booked': <Clock className="text-blue-600" size={20} />,
  'partner_assigned': <CheckCircle className="text-[#FEC925]" size={20} />,
  'en_route': <Clock className="text-purple-600" size={20} />,
  'checked_in': <CheckCircle className="text-indigo-600" size={20} />,
  'inspecting': <Clock className="text-orange-600" size={20} />,
  'offer_made': <CheckCircle className="text-[#FEC925]" size={20} />,
  'negotiating': <Clock className="text-yellow-600" size={20} />,
  'accepted': <CheckCircle className="text-[#1B8A05]" size={20} />,
  'payment_processing': <Clock className="text-cyan-600" size={20} />,
  'completed': <CheckCircle className="text-[#1B8A05]" size={20} />,
  'cancelled': <AlertTriangle className="text-[#FF0000]" size={20} />,
  'disputed': <AlertTriangle className="text-red-600" size={20} />,
  'expired': <Clock className="text-gray-500" size={20} />
};

const LeadStatusHistory: React.FC<LeadStatusHistoryProps> = ({ leadId }) => {
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) return;
    loadStatusHistory();
  }, [leadId]);

  const loadStatusHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${API_BASE_URL}/leads/leads/${leadId}/status_history/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          setLogs([]);
          return;
        }
        throw new Error('Failed to load status history');
      }

      const data = await res.json();
      setLogs(data.results || data || []);

    } catch (err: any) {
      console.error('Failed to load status history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return 'Recently';
    }
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

  if (logs.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl text-center">
        <Clock className="text-gray-300 mx-auto mb-3" size={32} />
        <p className="text-gray-600 font-semibold">No status changes yet</p>
        <p className="text-sm text-gray-500 mt-1">History will appear here as the lead progresses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
        >
          {/* Icon */}
          <div className="absolute left-0 top-0 -translate-x-1/2 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
            {STATUS_ICONS[log.to_status] || <CheckCircle className="text-gray-400" size={20} />}
          </div>

          {/* Content */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="font-bold text-[#1C1C1B] mb-1">
                  {log.to_status_display}
                </p>
                {log.from_status && (
                  <p className="text-xs text-gray-500">
                    From: {log.from_status_display}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(log.created_at)}
              </span>
            </div>

            {log.reason && (
              <p className="text-sm text-gray-700 mb-2">
                {log.reason}
              </p>
            )}

            {log.changed_by_name && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-6 h-6 bg-[#FEC925]/20 rounded-full flex items-center justify-center">
                  <span className="font-bold text-[#1C1C1B]">
                    {log.changed_by_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>by {log.changed_by_name}</span>
              </div>
            )}

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-[#FEC925] font-semibold">
                  View details
                </summary>
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  {Object.entries(log.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-gray-800 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LeadStatusHistory;