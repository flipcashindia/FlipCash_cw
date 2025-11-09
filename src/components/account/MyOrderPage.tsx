import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Truck, 
  Search, 
  DollarSign, 
  FileCheck, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import * as leadsService from '../../api/services/leadsService';
// ✅ CORRECTION: Removed unused 'MenuTab' import
import { motion, AnimatePresence } from 'framer-motion';

// --- START OF FIX: Defined LeadList interface ---
// Based on your LeadListSerializer
interface LeadList {
  id: string;
  lead_number: string;
  device_name: string;
  brand_name: string;
  storage: string;
  color: string;
  estimated_price: string;
  final_price: string | null;
  status: string;
  status_display: string;
  // ✅ CORRECTION: Updated type to match service response (string | undefined)
  assigned_partner_name: string | null | undefined;
  preferred_date: string;
  preferred_time_slot: string;
  pickup_date_display: string | null;
  created_at: string;
}
// --- END OF FIX ---

interface MyOrderPageProps {
  // Unused props removed from destructuring
  // username: string;
  // onNavClick: (tab: MenuTab) => void;
  // onBreadcrumbClick: (path: string) => void;
  // onLogout: () => void;
}

// --- Branded Status Configuration ---
const STATUS_CONFIG: Record<string, { label: string; filterColor: string; filterActive: string; badgeColor: string; Icon: React.ReactElement }> = {
  all: { 
    label: 'All Orders', 
    filterColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800', 
    filterActive: 'bg-[#1C1C1B] text-white', 
    badgeColor: 'bg-gray-100 text-gray-800',
    Icon: <Package size={16} />
  },
  booked: { 
    label: 'Booked', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <Clock size={16} /> 
  },
  partner_assigned: { 
    label: 'Partner Assigned', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <FileCheck size={16} /> 
  },
  en_route: { 
    label: 'En Route', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <Truck size={16} /> 
  },
  checked_in: { 
    label: 'Checked In', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <CheckCircle size={16} /> 
  },
  inspecting: { 
    label: 'Inspecting', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <Search size={16} /> 
  },
  offer_made: { 
    label: 'Offer Made', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <DollarSign size={16} /> 
  },
  negotiating: { 
    label: 'Negotiating', 
    filterColor: 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]', 
    filterActive: 'bg-[#FEC925] text-[#1C1C1B]', 
    badgeColor: 'bg-[#FEC925]/20 text-[#b48f00]',
    Icon: <DollarSign size={16} /> 
  },
  accepted: { 
    label: 'Accepted', 
    filterColor: 'bg-[#1B8A05]/10 hover:bg-[#1B8A05]/20 text-[#1B8A05]', 
    filterActive: 'bg-[#1B8A05] text-white', 
    badgeColor: 'bg-[#1B8A05]/20 text-[#1B8A05]',
    Icon: <CheckCircle size={16} /> 
  },
  payment_processing: { 
    label: 'Payment Processing', 
    filterColor: 'bg-[#1B8A05]/10 hover:bg-[#1B8A05]/20 text-[#1B8A05]', 
    filterActive: 'bg-[#1B8A05] text-white', 
    badgeColor: 'bg-[#1B8A05]/20 text-[#1B8A05]',
    Icon: <CheckCircle size={16} /> 
  },
  completed: { 
    label: 'Completed', 
    filterColor: 'bg-[#1B8A05]/10 hover:bg-[#1B8A05]/20 text-[#1B8A05]', 
    filterActive: 'bg-[#1B8A05] text-white', 
    badgeColor: 'bg-[#1B8A05]/20 text-[#1B8A05]',
    Icon: <CheckCircle size={16} /> 
  },
  cancelled: { 
    label: 'Cancelled', 
    filterColor: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000]', 
    filterActive: 'bg-[#FF0000] text-white', 
    badgeColor: 'bg-[#FF0000]/10 text-[#FF0000]',
    Icon: <XCircle size={16} /> 
  },
  disputed: { 
    label: 'Disputed', 
    filterColor: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000]', 
    filterActive: 'bg-[#FF0000] text-white', 
    badgeColor: 'bg-[#FF0000]/10 text-[#FF0000]',
    Icon: <AlertCircle size={16} /> 
  },
  expired: { 
    label: 'Expired', 
    filterColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800', 
    filterActive: 'bg-[#1C1C1B] text-white', 
    badgeColor: 'bg-gray-100 text-gray-800',
    Icon: <Clock size={16} /> 
  }
};

const MyOrderPage: React.FC<MyOrderPageProps> = ({}) => {
  const [leads, setLeads] = useState<LeadList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      setLoading(true); // Set loading to true on every new fetch
      setError(null);
      
      let params: { status?: string; status_in?: string } = {};
      
      if (filter === 'all') {
        // No params, get all
      } else if (filter === 'active') {
        // Get all non-terminal statuses
        params = { status_in: 'booked,partner_assigned,en_route,checked_in,inspecting,offer_made,negotiating,accepted,payment_processing' };
      } else {
        // Get a specific status
        params = { status: filter };
      }
      
      const data = await leadsService.getLeads(params);
      
      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && data.results && Array.isArray(data.results)) {
        // This assignment is now valid
        setLeads(data.results as LeadList[]);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
      setError('Failed to load orders. Please try again.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (leadId: string) => {
    navigate(`/lead/${leadId}`); // Navigate to the dynamic lead detail page
  };

  const getStatusAppearance = (status: string) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.all;
  };

  const filterTabs = ['all', 'active', ...Object.keys(STATUS_CONFIG).filter(k => k !== 'all' && STATUS_CONFIG[k].label)];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1C1C1B] mb-8">My Orders</h1>

        {/* Status Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filterTabs.map((statusKey) => {
              const config = getStatusAppearance(statusKey);
              const label = statusKey === 'active' ? 'Active' : config.label;
              const color = statusKey === 'active' ? 'bg-[#FEC925]/10 hover:bg-[#FEC925]/20 text-[#b48f00]' : config.filterColor;
              const activeColor = statusKey === 'active' ? 'bg-[#FEC925] text-[#1C1C1B]' : config.filterActive;

              return (
                <button
                  key={statusKey}
                  onClick={() => setFilter(statusKey)}
                  className={`px-4 py-2 rounded-lg whitespace-noww-rap font-semibold text-sm transition-all ${
                    filter === statusKey 
                      ? `${activeColor} shadow-md` 
                      : `${color}`
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={48} />
              <p className="mt-4 text-gray-600 font-semibold">Loading orders...</p>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <AlertCircle className="mx-auto text-[#FF0000] mb-4" size={48} />
              <p className="text-[#FF0000] font-semibold">{error}</p>
              <button 
                onClick={loadLeads}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition"
              >
                Try Again
              </button>
            </motion.div>
          ) : leads.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-xl font-semibold">No orders found</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 text-[#1B8A05] font-bold hover:underline"
                >
                  View all orders
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="list" 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {leads.map(lead => {
                const statusInfo = getStatusAppearance(lead.status);
                return (
                  <motion.div 
                    key={lead.id} 
                    className="bg-white border-2 border-transparent hover:border-[#FEC925] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h3 className="font-bold text-xl text-[#1C1C1B]">{lead.lead_number}</h3>
                        <p className="text-gray-700 text-lg">{lead.brand_name} {lead.device_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {lead.pickup_date_display || new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusInfo.badgeColor} flex-shrink-0`}>
                        {/* This call is valid because Icon is React.ReactElement */}
                        {React.cloneElement(statusInfo.Icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
                        <span className="font-semibold text-sm">
                          {lead.status_display}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6">
                      <div>
                        <p className="text-gray-600">Storage</p>
                        <p className="font-semibold text-[#1C1C1B]">{lead.storage || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Color</p>
                        <p className="font-semibold text-[#1C1C1B] capitalize">{lead.color || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600">Assigned Partner</p>
                        <p className="font-semibold text-[#1C1C1B]">{lead.assigned_partner_name || 'Pending assignment...'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
                      <div className="mb-4 sm:mb-0 text-center sm:text-left">
                        <p className="text-sm text-gray-600">Estimated Price</p>
                        <span className="text-3xl font-bold text-[#1B8A05]">
                          ₹{parseFloat(lead.estimated_price).toLocaleString('en-IN')}
                        </span>
                        {lead.final_price && (
                          <p className="text-sm text-[#1B8A05] mt-1 font-semibold">
                            (Final: ₹{parseFloat(lead.final_price).toLocaleString('en-IN')})
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleViewDetails(lead.id)}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        View Details
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MyOrderPage;