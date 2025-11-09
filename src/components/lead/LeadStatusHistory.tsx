// src/components/LeadStatusHistory.tsx
import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle, Package, UserCheck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// --- Interface based on GET /leads/{id}/status-history/ ---
interface StatusLog {
  id: string;
  from_status_display: string | null;
  to_status: string;
  to_status_display: string;
  changed_by: {
    id: string;
    name: string;
  };
  reason: string;
  created_at: string;
}

interface LeadStatusHistoryProps {
  leadId: string;
}

// --- Helper to get an icon for each status ---
const getStatusIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes('completed') || normalizedStatus.includes('accepted')) {
    return <CheckCircle className="w-5 h-5 text-white" />;
  }
  if (normalizedStatus.includes('partner') || normalizedStatus.includes('checked_in')) {
    return <UserCheck className="w-5 h-5 text-white" />;
  }
  if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('rejected')) {
    return <XCircle className="w-5 h-5 text-white" />;
  }
  return <Package className="w-5 h-5 text-white" />;
};

const LeadStatusHistory: React.FC<LeadStatusHistoryProps> = ({ leadId }) => {
  const [history, setHistory] = useState<StatusLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("Authentication required.");

        const res = await fetch(`${API_BASE_URL}/leads/leads/${leadId}/status-history/`, { //
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `Failed to load history (${res.status})`);
        }

        const data = await res.json();
        setHistory(data.results || data); // Handle paginated or non-paginated
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-[#FEC925]" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#FF0000]/10 rounded-lg flex items-center gap-2">
        <AlertTriangle className="text-[#FF0000]" size={20} />
        <p className="text-sm text-[#FF0000]">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-500">No status history available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.map((log, index) => (
        <motion.div
          key={log.id}
          className="relative flex gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Vertical Line */}
          {index < history.length - 1 && (
            <div className="absolute left-5 top-10 -bottom-6 w-0.5 bg-gray-200" />
          )}

          {/* Icon Badge */}
          <div
            className={`relative z-10 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
              index === 0 ? 'bg-gradient-to-br from-[#FEC925] to-[#1B8A05]' : 'bg-gray-400'
            }`}
          >
            {getStatusIcon(log.to_status)}
          </div>

          {/* Content */}
          <div className="flex-1">
            <p
              className={`font-bold text-lg ${
                index === 0 ? 'text-[#1C1C1B]' : 'text-gray-700'
              }`}
            >
              {log.to_status_display}
            </p>
            <p className="text-sm text-gray-600">{log.reason}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(log.created_at).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LeadStatusHistory;