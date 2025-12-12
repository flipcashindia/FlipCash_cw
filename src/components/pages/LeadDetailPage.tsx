// src/pages/leads/LeadDetailComplete.tsx - FULL VERSION
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Loader2, AlertTriangle, X, Package, Wallet, MapPin, User, Shield, CheckCircle,
  Tag, MessageSquare, Activity, Calendar, XCircle, Star, ThumbsUp, ThumbsDown, 
  DollarSign, Clock, MessageCircle, RefreshCw, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import LeadStatusHistory from '../../components/lead/LeadStatusHistory';
import LeadChat from '../../components/lead/LeadChat';
import RaiseDisputeModal from '../../components/lead/RaiseDisputeModal';
import CancelLeadModal from '../lead/CancelLeadModal';
import RescheduleModal from '../lead/RescheduleModal';
import RateLeadModal from '../lead/RateLeadModal';
import LeadDisputesSection from '../lead/LeadDisputesSection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Interfaces
interface DeviceModel { id: string; name: string; }
interface LeadUser { id: string; phone: string; name: string; email: string; }
interface Partner { 
  id: string; 
  user: string; 
  business_name: string; 
  contact_person: string; 
  phone: string; 
  rating_average: string; 
  total_leads_completed: number; 
}
interface PickupAddress { 
  id: string; 
  address_line1: string; 
  address_line2?: string; 
  city: string; 
  state: string; 
  pincode: string; 
  landmark?: string; 
}
interface DevicePhoto { url: string; description: string; }

interface LeadOffer {
  id: string;
  lead: string;
  lead_number: string;
  partner: string;
  partner_name: string;
  system_calculated_price: string;
  partner_offered_price: string;
  price_deviation_percentage: string;
  partner_notes: string;
  inspection_findings: {
    screen_condition?: string;
    body_condition?: string;
    battery_health?: number;
    accessories?: {
      bill_available?: boolean;
      box_available?: boolean;
      charger_available?: boolean;
      earphones_available?: boolean;
    };
    functional_issues?: string[];
    additional_notes?: string;
    pricing_calculation?: {
      max_price_cap?: number;
      min_price_cap?: number;
      pricing_rule_id?: string;
      pricing_rule_name?: string;
    };
  } | string;  // Allow string for backward compatibility
  inspection_photos: string[];
  status: string;
  status_display: string;
  customer_response: string;
  is_expired: boolean;
  created_at: string;
  expires_at: string;
  responded_at: string | null;
}

interface LeadDetail {
  id: string;
  lead_number: string;
  user: LeadUser;
  device_model: DeviceModel;
  brand_name: string;
  storage: string;
  ram: string;
  color: string;
  imei_primary: string;
  condition_responses: Record<string, any>;
  device_photos: DevicePhoto[];
  estimated_price: string;
  quoted_price: string | null;
  final_price: string | null;
  status: string;
  status_display: string;
  assigned_partner: Partner | null;
  pickup_address: PickupAddress;
  preferred_date: string;
  preferred_time_slot: string;
  customer_notes: string;
  created_at: string;
}

interface VisitData {
  id: string;
  visit_number: string;
  verification_code_masked: string;
  verification_code_expires_at: string;
  is_code_verified: boolean;
  verified_at: string | null;
  can_verify: boolean;
  is_code_expired: boolean;
  status: string;
  status_display: string;
}

// Status badges
const STATUS_COLORS: Record<string, string> = {
  'booked': 'bg-blue-100 text-blue-800',
  'partner_assigned': 'bg-[#FEC925]/20 text-[#b48f00]',
  'en_route': 'bg-purple-100 text-purple-800',
  'checked_in': 'bg-indigo-100 text-indigo-800',
  'inspecting': 'bg-orange-100 text-orange-800',
  'offer_made': 'bg-[#FEC925]/30 text-[#b48f00]',
  'negotiating': 'bg-yellow-100 text-yellow-800',
  'accepted': 'bg-[#1B8A05]/20 text-[#1B8A05]',
  'payment_processing': 'bg-cyan-100 text-cyan-800',
  'completed': 'bg-[#1B8A05]/30 text-[#1B8A05]',
  'cancelled': 'bg-[#FF0000]/10 text-[#FF0000]',
  'disputed': 'bg-red-100 text-red-800',
  'expired': 'bg-gray-200 text-gray-600'
};

// Helper to safely convert any value to string for display
const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(item => safeStringify(item)).join(', ');
  }
  if (typeof value === 'object') {
    try {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${safeStringify(v)}`)
        .join(' | ');
    } catch {
      return JSON.stringify(value);
    }
  }
  return String(value);
};

const LeadDetailComplete: React.FC = () => {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();

  const [leadDetails, setLeadDetails] = useState<LeadDetail | null>(null);
  const [offers, setOffers] = useState<LeadOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);
  
  // Modal states
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<LeadOffer | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterNotes, setCounterNotes] = useState('');
  const [respondingToOffer, setRespondingToOffer] = useState(false);

  // Visit verification states
  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [regeneratingCode, setRegeneratingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);




  useEffect(() => {
    if (!leadId) {
      setError("No lead ID provided");
      setLoading(false);
      return;
    }
    loadLeadDetails(leadId);
    loadOffers(leadId);
    loadVisitData(leadId);
  }, [leadId]);


  // Add this near the top with safeStringify
const safeStringify = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => safeStringify(item)).join(', ');
    }
    if (typeof value === 'object') {
      try {
        return Object.entries(value)
          .map(([k, v]) => `${k}: ${safeStringify(v)}`)
          .join(' | ');
      } catch {
        return JSON.stringify(value);
      }
    }
    return String(value);
  };

  const loadLeadDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${API_BASE_URL}/leads/leads/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Lead not found");
        throw new Error("Failed to load lead details");
      }

      const data: LeadDetail = await res.json();
      setLeadDetails(data);
      
      // Check rating status for completed leads
      if (data.status === 'completed' && data.assigned_partner) {
        checkRatingStatus(id);
      }
    } catch (err: any) {
      console.error('Failed to load lead:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Change loadVisitData function:

  const loadVisitData = async (leadId: string) => {
    try {
      setLoadingVisit(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Step 1: Get visit list to get visit ID
      const res = await fetch(`${API_BASE_URL}/visits/visits/?lead=${leadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const visits = data.results || data || [];
        if (visits.length > 0) {
          const visit = visits[0];
          
          // Step 2: Get verification code using the dedicated endpoint
          const codeRes = await fetch(
            `${API_BASE_URL}/visits/visits/${visit.id}/verification_code/`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
          if (codeRes.ok) {
            const codeData = await codeRes.json();
            
            // Merge visit data with verification code data
            setVisitData({
              id: visit.id,
              visit_number: codeData.visit_number,
              verification_code_masked: codeData.verification_code,
              verification_code_expires_at: codeData.expires_at,
              is_code_verified: visit.is_code_verified,
              verified_at: null,
              can_verify: codeData.can_verify,
              is_code_expired: codeData.is_expired,
              status: visit.status,
              status_display: visit.status_display
            });
          } else {
            // If verification code endpoint fails, set basic visit data
            setVisitData({
              id: visit.id,
              visit_number: visit.visit_number,
              verification_code_masked: '******',
              verification_code_expires_at: '',
              is_code_verified: visit.is_code_verified,
              verified_at: null,
              can_verify: visit.can_verify,
              is_code_expired: false,
              status: visit.status,
              status_display: visit.status_display
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load visit data:', err);
    } finally {
      setLoadingVisit(false);
    }
  };





  const regenerateVerificationCode = async () => {
    if (!visitData) return;
    
    try {
      setRegeneratingCode(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${API_BASE_URL}/visits/visits/${visitData.id}/regenerate_code/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Customer requested new code'
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || 'Failed to regenerate code');
      }

      // Refresh visit data to get new code
      if (leadId) {
        await loadVisitData(leadId);
      }
      
      // Show success feedback
      setCodeCopied(false);
      
    } catch (err: any) {
      console.error('Failed to regenerate code:', err);
      setError(err.message);
    } finally {
      setRegeneratingCode(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (visitData && visitData.verification_code_masked !== '******') {
      navigator.clipboard.writeText(visitData.verification_code_masked);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const getTimeRemaining = (expiryDate: string): string => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`;
    }
    return `${minutes}m remaining`;
  };


  const loadOffers = async (id: string) => {
    try {
      setLoadingOffers(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/leads/offers/?lead=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // console.log('offere response : ', res)

      if (res.ok) {
        const data = await res.json();
        // console.log('offer data : ', data)
        setOffers(data.results || data || []);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoadingOffers(false);
    }
  };

  const checkRatingStatus = async (leadId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const userId = localStorage.getItem('user_id');
      const res = await fetch(`${API_BASE_URL}/ops/ratings/?lead=${leadId}&rater=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setHasRated((data.results || data || []).length > 0);
      }
    } catch (err) {
      console.error('Failed to check rating:', err);
    }
  };

  const handleOfferResponse = async (offerId: string, action: 'accept' | 'reject' | 'counter') => {
    try {
      setRespondingToOffer(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      const payload: any = {
        offer_id: offerId,
        action: action
      };

      if (action === 'counter') {
        if (!counterPrice || parseFloat(counterPrice) <= 0) {
          throw new Error('Please enter a valid counter price');
        }
        payload.counter_price = parseFloat(counterPrice);
        payload.response_notes = counterNotes.trim();
      }

      console.log('📤 Responding to offer:', payload);

      const res = await fetch(`${API_BASE_URL}/leads/offers/${offerId}/respond/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || 'Failed to respond to offer');
      }

      console.log('✅ Offer response successful');

      // Refresh data
      if (leadId) {
        await loadLeadDetails(leadId);
        await loadOffers(leadId);
      }

      // Close counter modal
      setIsCounterModalOpen(false);
      setSelectedOffer(null);
      setCounterPrice('');
      setCounterNotes('');

    } catch (err: any) {
      console.error('❌ Offer response error:', err);
      setError(err.message);
    } finally {
      setRespondingToOffer(false);
    }
  };

  // const openCounterModal = (offer: LeadOffer) => {
  //   setSelectedOffer(offer);
  //   const minPrice = Math.min(parseFloat(offer.system_calculated_price), parseFloat(offer.partner_offered_price));
  //   const maxPrice = Math.max(parseFloat(offer.system_calculated_price), parseFloat(offer.partner_offered_price));
  //   const suggestedPrice = Math.round((minPrice + maxPrice) / 2);
  //   setCounterPrice(suggestedPrice.toString());
  //   setIsCounterModalOpen(true);
  // };

 
 
  const formatCurrency = (value: string | number): string => {
    return `₹${parseFloat(value.toString()).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading Lead Details...</p>
        </motion.div>
      </div>
    );
  }

  if (!leadDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <AlertTriangle className="text-[#FF0000] mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-[#1C1C1B] mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Lead not found'}</p>
          <button
            onClick={() => navigate('/leads')}
            className="px-6 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#e5b520]"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const canReschedule = !['completed', 'cancelled', 'payment_processing', 'disputed'].includes(leadDetails.status);
  const canCancel = !['completed', 'cancelled', 'payment_processing'].includes(leadDetails.status);
  const showRateButton = leadDetails.status === 'completed' && leadDetails.assigned_partner && !hasRated;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button 
            onClick={() => navigate('/my-account/my-orders')} 
            className="flex items-center gap-2 text-[#1C1C1B] hover:text-[#FEC925] transition font-semibold"
          >
            <ArrowLeft size={24} />
            Back to Leads
          </button>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-[#FF0000]" size={24} />
                <p className="font-semibold text-[#1C1C1B]">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-[#FF0000]">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1C1C1B] mb-2">
                  Lead #{leadDetails.lead_number}
                </h2>
                <p className="text-gray-600">
                  Created: {formatDate(leadDetails.created_at)}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${STATUS_COLORS[leadDetails.status] || 'bg-gray-200 text-gray-800'}`}>
                  {leadDetails.status_display}
                </span>

                {showRateButton && (
                  <button 
                    onClick={() => setIsRateModalOpen(true)}
                    className="px-4 py-2 bg-[#1B8A05] text-white rounded-lg font-bold hover:bg-[#156d04] transition flex items-center gap-2"
                  >
                    <Star size={16} />
                    Rate Service
                  </button>
                )}

                {leadDetails.status === 'completed' && hasRated && (
                  <div className="px-4 py-2 bg-[#1B8A05]/20 text-[#1B8A05] rounded-lg font-bold flex items-center gap-2">
                    <CheckCircle size={16} />
                    Rated
                  </div>
                )}

                {canReschedule && (
                  <button 
                    onClick={() => setIsRescheduleModalOpen(true)}
                    className="px-4 py-2 bg-[#FEC925]/20 text-[#1C1C1B] rounded-lg font-bold hover:bg-[#FEC925] transition flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    Reschedule
                  </button>
                )}

                {canCancel && (
                  <button 
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-4 py-2 bg-[#FF0000]/10 text-[#FF0000] rounded-lg font-bold hover:bg-[#FF0000] hover:text-white transition flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}

                {!['cancelled', 'completed'].includes(leadDetails.status) && (
                  <button 
                    onClick={() => setIsDisputeModalOpen(true)}
                    className="px-4 py-2 bg-[#FF0000]/10 text-[#FF0000] rounded-lg font-bold hover:bg-[#FF0000] hover:text-white transition flex items-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    Report Issue
                  </button>
                )}
              </div>
            </div>
          </div>

           {/* Visit Verification Code Section - PROMINENT */}
          {visitData && !visitData.is_code_verified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-[#1B8A05]/10 to-[#FEC925]/10 p-6 rounded-2xl shadow-xl border-2 border-[#1B8A05]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="text-[#1B8A05]" size={32} />
                      <div>
                        <h3 className="text-2xl font-bold text-[#1C1C1B]">Verification Code</h3>
                        <p className="text-sm text-gray-600">Share this code with the partner agent on arrival</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border-2 border-[#1B8A05] inline-block">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Your Code</p>
                          <p className="text-4xl font-mono font-bold text-[#1B8A05] tracking-wider">
                            {loadingVisit ? '------' : visitData.verification_code_masked}
                          </p>
                        </div>
                        
                        <button
                          onClick={copyCodeToClipboard}
                          disabled={visitData.verification_code_masked === '******'}
                          className="p-3 bg-[#FEC925]/20 hover:bg-[#FEC925] rounded-lg transition"
                          title="Copy code"
                        >
                          {codeCopied ? (
                            <Check className="text-[#1B8A05]" size={20} />
                          ) : (
                            <Copy className="text-[#1C1C1B]" size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className={`font-semibold ${visitData.is_code_expired ? 'text-[#FF0000]' : 'text-gray-600'}`}>
                        {visitData.is_code_expired ? (
                          '⏰ Code Expired'
                        ) : (
                          `⏰ ${getTimeRemaining(visitData.verification_code_expires_at)}`
                        )}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">Visit #{visitData.visit_number}</span>
                    </div>
                  </div>

                  <button
                    onClick={regenerateVerificationCode}
                    disabled={regeneratingCode}
                    className="px-6 py-3 bg-[#1B8A05] text-white rounded-xl font-bold hover:bg-[#156d04] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {regeneratingCode ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={20} />
                        Get New Code
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>📱 Important:</strong> The partner will ask for this code when they arrive. 
                    Only share it with the verified FlipCash partner at your doorstep.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Code Verified Success */}
          {visitData && visitData.is_code_verified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-[#1B8A05]/10 p-6 rounded-2xl border-2 border-[#1B8A05]">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-[#1B8A05]" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-[#1B8A05]">Verification Complete</h3>
                    <p className="text-sm text-gray-600">
                      Partner verified on {formatDate(visitData.verified_at || '')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Offers Section - PROMINENT DISPLAY */}
          {(loadingOffers || offers.length > 0 || ['offer_made', 'negotiating'].includes(leadDetails.status)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-[#FEC925]/20 to-[#1B8A05]/20 p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#FEC925] rounded-full flex items-center justify-center">
                    <DollarSign className="text-[#1C1C1B]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1C1C1B]">Price Offers</h3>
                    <p className="text-gray-600">Review and respond to partner offers</p>
                  </div>
                </div>

                {loadingOffers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-[#FEC925]" size={32} />
                  </div>
                ) : offers.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl text-center">
                    <Clock className="text-gray-300 mx-auto mb-3" size={48} />
                    <p className="text-gray-600 font-semibold">No offers yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Partner will make an offer after device inspection
                    </p>
                  </div>
                ) : (
                  // inspection_findings
                  <div className="space-y-4">
                    {offers.map((offer, index) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          {/* Offer Details */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-[#1C1C1B]">
                                Offer from {offer.partner_name}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                offer.status === 'pending' ? 'bg-[#FEC925]/20 text-[#b48f00]' :
                                offer.status === 'accepted' ? 'bg-[#1B8A05]/20 text-[#1B8A05]' :
                                offer.status === 'rejected' ? 'bg-[#FF0000]/10 text-[#FF0000]' :
                                'bg-gray-200 text-gray-600'
                              }`}>
                                {offer.status_display}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">System Price</p>
                                <p className="text-xl font-bold text-gray-800">
                                  {formatCurrency(offer.system_calculated_price)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Partner Offer</p>
                                <p className="text-xl font-bold text-[#1B8A05]">
                                  {formatCurrency(offer.partner_offered_price)}
                                </p>
                              </div>
                            </div>

                            {offer.partner_notes && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Partner Notes:</p>
                                <p className="text-sm text-gray-600 italic">"{offer.partner_notes}"</p>
                              </div>
                            )}

                            {offer.inspection_findings && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Inspection Findings:</p>
                                <div className="text-sm text-gray-600 space-y-1">
                                  {typeof offer.inspection_findings === 'object' ? (
                                    <>
                                      {offer.inspection_findings.screen_condition && (
                                        <p>Screen: {offer.inspection_findings.screen_condition}</p>
                                      )}
                                      {offer.inspection_findings.body_condition && (
                                        <p>Body: {offer.inspection_findings.body_condition}</p>
                                      )}
                                      {offer.inspection_findings.battery_health && (
                                        <p>Battery Health: {offer.inspection_findings.battery_health}%</p>
                                      )}
                                      {offer.inspection_findings.functional_issues && offer.inspection_findings.functional_issues.length > 0 && (
                                        <p>Issues: {offer.inspection_findings.functional_issues.join(', ')}</p>
                                      )}
                                      {offer.inspection_findings.additional_notes && (
                                        <p>Notes: {offer.inspection_findings.additional_notes}</p>
                                      )}
                                    </>
                                  ) : (
                                    <p>{String(offer.inspection_findings)}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {offer.inspection_photos && offer.inspection_photos.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Inspection Photos:</p>
                                <div className="flex gap-2 flex-wrap">
                                  {offer.inspection_photos.map((photo, idx) => (
                                    <a 
                                      key={idx} 
                                      href={photo} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="group"
                                    >
                                      <img 
                                        src={photo} 
                                        alt={`Inspection ${idx + 1}`} 
                                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#FEC925] transition"
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Offered: {formatDate(offer.created_at)}</span>
                              {offer.expires_at && (
                                <span className={offer.is_expired ? 'text-[#FF0000]' : ''}>
                                  Expires: {formatDate(offer.expires_at)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {offer.status === 'pending' && !offer.is_expired && (
                            <div className="flex flex-col gap-3 md:min-w-[200px]">
                              <button
                                onClick={() => handleOfferResponse(offer.id, 'accept')}
                                disabled={respondingToOffer}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1B8A05] text-white rounded-lg font-bold hover:bg-[#156d04] transition disabled:opacity-50"
                              >
                                {respondingToOffer ? (
                                  <Loader2 className="animate-spin" size={20} />
                                ) : (
                                  <>
                                    <ThumbsUp size={20} />
                                    Accept
                                  </>
                                )}
                              </button>

                              {/* <button
                                onClick={() => openCounterModal(offer)}
                                disabled={respondingToOffer}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-lg font-bold hover:bg-[#e5b520] transition disabled:opacity-50"
                              >
                                <MessageCircle size={20} />
                                Counter Offer
                              </button> */}

                              <button
                                onClick={() => handleOfferResponse(offer.id, 'reject')}
                                disabled={respondingToOffer}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FF0000]/10 text-[#FF0000] border-2 border-[#FF0000] rounded-lg font-bold hover:bg-[#FF0000] hover:text-white transition disabled:opacity-50"
                              >
                                <ThumbsDown size={20} />
                                Reject
                              </button>
                            </div>
                          )}

                          {offer.status !== 'pending' && (
                            <div className="md:min-w-[200px] flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Response</p>
                                {offer.responded_at && (
                                  <p className="text-xs text-gray-500">
                                    {formatDate(offer.responded_at)}
                                  </p>
                                )}
                                {offer.customer_response && (
                                  <p className="text-sm text-gray-700 italic mt-2">
                                    "{offer.customer_response}"
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Device Details */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Device Details</h3>
                </div>
                <div className="space-y-3">
                  <DetailRow label="Device" value={`${leadDetails.brand_name} ${leadDetails.device_model.name}`} />
                  <DetailRow label="Storage" value={leadDetails.storage} />
                  <DetailRow label="RAM" value={leadDetails.ram} />
                  <DetailRow label="Color" value={leadDetails.color} />
                  <DetailRow label="IMEI" value={leadDetails.imei_primary} />
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Wallet className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Price Details</h3>
                </div>
                <div className="space-y-3">
                  <DetailRow label="Estimated Price" value={formatCurrency(leadDetails.estimated_price)} />
                  <DetailRow label="Quoted Price" value={leadDetails.quoted_price ? formatCurrency(leadDetails.quoted_price) : 'Pending'} />
                  <DetailRow label="Final Price" value={leadDetails.final_price ? formatCurrency(leadDetails.final_price) : 'Pending'} />
                </div>
              </div>

              {/* Condition Report */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Condition Report</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(leadDetails.condition_responses).map(([key, value]) => (
                    <DetailRow 
                      key={key} 
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                      value={safeStringify(value)} 
                    />
                  ))}
                </div>
              </div>

              {/* Device Photos */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Tag className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Device Photos</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {leadDetails.device_photos.length > 0 ? (
                    leadDetails.device_photos.map((photo, idx) => (
                      <a key={idx} href={photo.url} target="_blank" rel="noopener noreferrer" className="group">
                        <img 
                          src={photo.url} 
                          alt={photo.description || `Device ${idx + 1}`} 
                          className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#FEC925] transition"
                        />
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">No photos uploaded</p>
                  )}
                </div>
              </div>

              {/* Pickup Details */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Pickup Details</h3>
                </div>
                <div className="space-y-3">
                  <p className="font-bold text-lg">{leadDetails.pickup_address.address_line1}</p>
                  {leadDetails.pickup_address.address_line2 && <p className="text-gray-700">{leadDetails.pickup_address.address_line2}</p>}
                  {leadDetails.pickup_address.landmark && <p className="text-sm text-gray-600">Landmark: {leadDetails.pickup_address.landmark}</p>}
                  <p className="font-semibold">{leadDetails.pickup_address.city}, {leadDetails.pickup_address.state} - {leadDetails.pickup_address.pincode}</p>
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <DetailRow 
                      label="Date" 
                      value={new Date(leadDetails.preferred_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} 
                    />
                    <DetailRow label="Time Slot" value={leadDetails.preferred_time_slot} />
                  </div>
                  {leadDetails.customer_notes && (
                    <div className="bg-[#F0F7F6] p-3 rounded-lg border border-[#1B8A05]/20 mt-4">
                      <p className="font-semibold text-gray-800">Customer Notes:</p>
                      <p className="text-gray-700 italic">"{leadDetails.customer_notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Disputes */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Disputes & Issues</h3>
                </div>
                <LeadDisputesSection leadId={leadDetails.id} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Chat */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Live Chat</h3>
                </div>
                <LeadChat 
                  leadId={leadDetails.id}
                  currentUserId={leadDetails.user.id}
                  partnerAssigned={!!leadDetails.assigned_partner}
                />
              </div>

              {/* History */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Lead History</h3>
                </div>
                <LeadStatusHistory leadId={leadDetails.id} />
              </div>

              {/* Partner Info */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Assigned Partner</h3>
                </div>
                {leadDetails.assigned_partner ? (
                  <div className="space-y-3">
                    <DetailRow label="Business" value={leadDetails.assigned_partner.business_name} />
                    <DetailRow label="Agent" value={leadDetails.assigned_partner.contact_person} />
                    <DetailRow label="Phone" value={leadDetails.assigned_partner.phone} />
                    <DetailRow label="Rating" value={`${leadDetails.assigned_partner.rating_average} ★`} />
                    <DetailRow label="Leads Done" value={leadDetails.assigned_partner.total_leads_completed} />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Waiting for assignment...</p>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20">
                <div className="flex items-center gap-3 mb-6">
                  <User className="text-[#FEC925]" size={24} />
                  <h3 className="text-2xl font-bold text-[#1C1C1B]">Customer Details</h3>
                </div>
                <div className="space-y-3">
                  <DetailRow label="Name" value={leadDetails.user.name} />
                  <DetailRow label="Phone" value={leadDetails.user.phone} />
                  <DetailRow label="Email" value={leadDetails.user.email} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {leadDetails && (
        <>
          <RaiseDisputeModal
            isOpen={isDisputeModalOpen}
            onClose={() => setIsDisputeModalOpen(false)}
            leadId={leadDetails.id}
            leadNumber={leadDetails.lead_number}
            onSuccess={() => {
              loadLeadDetails(leadDetails.id);
              setIsDisputeModalOpen(false);
            }}
          />

          <CancelLeadModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            leadId={leadDetails.id}
            leadNumber={leadDetails.lead_number}
            onSuccess={() => {
              loadLeadDetails(leadDetails.id);
              setIsCancelModalOpen(false);
            }}
          />

          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            leadId={leadDetails.id}
            leadNumber={leadDetails.lead_number}
            currentDate={leadDetails.preferred_date}
            currentTimeSlot={leadDetails.preferred_time_slot}
            onSuccess={() => {
              loadLeadDetails(leadDetails.id);
              setIsRescheduleModalOpen(false);
            }}
          />

          {leadDetails.assigned_partner && (
            <RateLeadModal
              isOpen={isRateModalOpen}
              onClose={() => setIsRateModalOpen(false)}
              leadId={leadDetails.id}
              leadNumber={leadDetails.lead_number}
              partnerUserId={leadDetails.assigned_partner.user}
              partnerName={leadDetails.assigned_partner.business_name}
              onSuccess={() => {
                setHasRated(true);
                loadLeadDetails(leadDetails.id);
                setIsRateModalOpen(false);
              }}
            />
          )}

          {/* Counter Offer Modal */}
          {selectedOffer && (
            <AnimatePresence>
              {isCounterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
                  >
                    <div className="p-6 border-b-2 border-[#FEC925]/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[#1C1C1B]">Counter Offer</h3>
                        <button 
                          onClick={() => setIsCounterModalOpen(false)}
                          disabled={respondingToOffer}
                          className="text-gray-400 hover:text-[#FF0000] transition"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-2">Price Range</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">System Price</p>
                            <p className="text-lg font-bold">{formatCurrency(selectedOffer.system_calculated_price)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">↔</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Partner Offer</p>
                            <p className="text-lg font-bold">{formatCurrency(selectedOffer.partner_offered_price)}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1C1C1B] mb-2">Your Counter Price *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            value={counterPrice}
                            onChange={(e) => setCounterPrice(e.target.value)}
                            placeholder="Enter your price"
                            disabled={respondingToOffer}
                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FEC925] focus:outline-none font-bold text-lg"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Price must be between system and partner offer
                        </p>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1C1C1B] mb-2">Message to Partner (Optional)</label>
                        <textarea
                          value={counterNotes}
                          onChange={(e) => setCounterNotes(e.target.value)}
                          placeholder="Explain your counter offer..."
                          disabled={respondingToOffer}
                          rows={3}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FEC925] focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="p-6 border-t-2 border-gray-200 flex gap-3">
                      <button
                        onClick={() => setIsCounterModalOpen(false)}
                        disabled={respondingToOffer}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleOfferResponse(selectedOffer.id, 'counter')}
                        disabled={respondingToOffer}
                        className="flex-1 px-6 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#e5b520] transition flex items-center justify-center gap-2"
                      >
                        {respondingToOffer ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <MessageCircle size={20} />
                            Send Counter
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          )}
        </>
      )}
    </section>
  );
};

// Helper Components
// Also update DetailRow to be more defensive
const DetailRow: React.FC<{ label: string; value: any }> = ({ label, value }) => {
  // Ensure value is always a string
  const displayValue = typeof value === 'object' && value !== null 
    ? safeStringify(value) 
    : (value || 'N/A');
    
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="font-semibold text-gray-600">{label}:</span>
      <span className="font-bold text-[#1C1C1B] text-right">{displayValue}</span>
    </div>
  );
};

export default LeadDetailComplete;