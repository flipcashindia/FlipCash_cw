import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Truck, Search, DollarSign, FileCheck } from 'lucide-react';
import * as leadsService from '../../api/services/leadsService';
import type { Lead } from '../../api/types/leads.types';
import type { MenuTab } from './MyAccountPage';

interface MyOrderPageProps {
  username: string;
  onNavClick: (tab: MenuTab) => void;
  onBreadcrumbClick: (path: string) => void;
  onLogout: () => void;
}

// Status configuration with display names and colors
const STATUS_CONFIG = {
  all: { label: 'All Orders', color: 'bg-gray-100 hover:bg-gray-200', activeColor: 'bg-teal-600' },
  booked: { label: 'Booked', color: 'bg-blue-50 hover:bg-blue-100', activeColor: 'bg-blue-600' },
  partner_assigned: { label: 'Partner Assigned', color: 'bg-indigo-50 hover:bg-indigo-100', activeColor: 'bg-indigo-600' },
  en_route: { label: 'En Route', color: 'bg-purple-50 hover:bg-purple-100', activeColor: 'bg-purple-600' },
  checked_in: { label: 'Checked In', color: 'bg-yellow-50 hover:bg-yellow-100', activeColor: 'bg-yellow-600' },
  inspecting: { label: 'Inspecting', color: 'bg-orange-50 hover:bg-orange-100', activeColor: 'bg-orange-600' },
  offer_made: { label: 'Offer Made', color: 'bg-amber-50 hover:bg-amber-100', activeColor: 'bg-amber-600' },
  negotiating: { label: 'Negotiating', color: 'bg-pink-50 hover:bg-pink-100', activeColor: 'bg-pink-600' },
  accepted: { label: 'Accepted', color: 'bg-green-50 hover:bg-green-100', activeColor: 'bg-green-600' },
  payment_processing: { label: 'Payment Processing', color: 'bg-teal-50 hover:bg-teal-100', activeColor: 'bg-teal-600' },
  completed: { label: 'Completed', color: 'bg-emerald-50 hover:bg-emerald-100', activeColor: 'bg-emerald-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 hover:bg-red-100', activeColor: 'bg-red-600' },
  disputed: { label: 'Disputed', color: 'bg-rose-50 hover:bg-rose-100', activeColor: 'bg-rose-600' },
  expired: { label: 'Expired', color: 'bg-gray-50 hover:bg-gray-100', activeColor: 'bg-gray-600' }
};

const MyOrderPage: React.FC<MyOrderPageProps> = ({ username, onNavClick, onBreadcrumbClick, onLogout }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await leadsService.getLeads(params);
      console.log('lead data: ', data);
      
      // Handle both paginated and direct array responses
      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && data.results && Array.isArray(data.results)) {
        setLeads(data.results);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked': 
        return <Clock className="text-blue-600" size={20} />;
      case 'partner_assigned': 
        return <FileCheck className="text-indigo-600" size={20} />;
      case 'en_route':
        return <Truck className="text-purple-600" size={20} />;
      case 'checked_in': 
        return <CheckCircle className="text-yellow-600" size={20} />;
      case 'inspecting': 
        return <Search className="text-orange-600" size={20} />;
      case 'offer_made':
      case 'negotiating':
        return <DollarSign className="text-amber-600" size={20} />;
      case 'accepted': 
      case 'payment_processing':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'completed': 
        return <CheckCircle className="text-emerald-600" size={20} />;
      case 'cancelled': 
      case 'disputed': 
      case 'expired':
        return <XCircle className="text-red-600" size={20} />;
      default: 
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'text-blue-600 bg-blue-50';
      case 'partner_assigned':
        return 'text-indigo-600 bg-indigo-50';
      case 'en_route':
        return 'text-purple-600 bg-purple-50';
      case 'checked_in':
        return 'text-yellow-600 bg-yellow-50';
      case 'inspecting':
        return 'text-orange-600 bg-orange-50';
      case 'offer_made':
      case 'negotiating':
        return 'text-amber-600 bg-amber-50';
      case 'accepted':
      case 'payment_processing':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-emerald-600 bg-emerald-50';
      case 'cancelled':
      case 'disputed':
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Status Filter Buttons */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                filter === status 
                  ? `${config.activeColor} text-white shadow-md` 
                  : `${config.color} text-gray-700`
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadLeads}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Retry
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No orders found</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-teal-600 hover:underline"
              >
                View all orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{lead.lead_number}</h3>
                    <p className="text-gray-600 text-base">{lead.brand_name} {lead.device_name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {lead.pickup_date_display || new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(lead.status)}`}>
                    {getStatusIcon(lead.status)}
                    <span className="font-semibold text-sm">
                      {lead.status_display}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Storage</p>
                    <p className="font-semibold">{lead.storage || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Color</p>
                    <p className="font-semibold capitalize">{lead.color || 'N/A'}</p>
                  </div>
                  {lead.preferred_time_slot && (
                    <div className="col-span-2">
                      <p className="text-gray-600">Pickup Slot</p>
                      <p className="font-semibold">{lead.preferred_time_slot}</p>
                    </div>
                  )}
                  {lead.assigned_partner_name && (
                    <div className="col-span-2">
                      <p className="text-gray-600">Assigned Partner</p>
                      <p className="font-semibold">{lead.assigned_partner_name}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Estimated Price</p>
                    <span className="text-2xl font-bold text-teal-600">
                      ₹{parseFloat(lead.estimated_price).toLocaleString()}
                    </span>
                    {lead.final_price && (
                      <p className="text-sm text-green-600 mt-1 font-semibold">
                        Final: ₹{parseFloat(lead.final_price).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => {/* TODO: Navigate to lead details */}}
                    className="px-6 py-2 text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-50 font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrderPage;