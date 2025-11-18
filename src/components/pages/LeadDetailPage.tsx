// src/pages/leads/LeadDetailPageComplete.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2,
  AlertTriangle,
  X,
  Package,
  Wallet,
  MapPin,
  User,
  Shield,
  CheckCircle,
  Tag,
  MessageSquare,
  Activity,
  Calendar,
  XCircle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import modals and components
import LeadStatusHistory from '../lead/LeadStatusHistory';
import LeadChat from '../lead/LeadChat';
import RaiseDisputeModal from '../../components/lead/RaiseDisputeModal';
import CancelLeadModal from '../../components/lead/Cancelleadmodal';
import RescheduleModal from '../../components/lead/Reschedulemodal';
import RateLeadModal from '../../components/lead/Rateleadmodal';
import LeadDisputesSection from '../../components/lead/Leaddisputessection';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interfaces
interface DeviceModel { 
  id: string;
  name: string;
}

interface LeadUser { id: string; phone: string; name: string; email: string; }
interface Partner { id: string; user: string; business_name: string; contact_person: string; phone: string; rating_average: string; total_leads_completed: number; }
interface PickupAddress { id: string; address_line1: string; address_line2?: string; city: string; state: string; pincode: string; landmark?: string; }
interface DevicePhoto { url: string; description: string; }
interface LatestOffer { id: string; partner_offered_price: string; message: string; status: string; created_at: string; }

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
  latest_offer: LatestOffer | null;
  created_at: string;
}

// Helper Components
interface ErrorDisplayProps { message: string; onDismiss: () => void; }
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-[#FF0000]/10 border-2 border-[#FF0000] rounded-xl flex items-center justify-between">
    <div className="flex items-center gap-3"><AlertTriangle className="text-[#FF0000] flex-shrink-0" size={24} /><p className="font-semibold text-[#1C1C1B]">{message}</p></div>
    <button onClick={onDismiss} className="text-[#FF0000] hover:opacity-70"><X size={20} /></button>
  </motion.div>
);

interface DetailCardProps { icon: React.ReactNode; title: string; children: React.ReactNode; }
const DetailCard: React.FC<DetailCardProps> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20 hover:shadow-2xl transition-shadow">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-[#FEC925]/20 rounded-full flex items-center justify-center flex-shrink-0">{icon}</div>
      <h3 className="font-bold text-2xl text-[#1C1C1B]">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

interface DetailRowProps { label: string; value: string | number | null; }
const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="font-bold text-[#1C1C1B] text-right">{value || 'N/A'}</span>
  </div>
);

const renderStatusBadge = (status: string) => {
  let colorClasses = "bg-gray-200 text-gray-800";
  if (status.includes("Completed") || status.includes("Accepted")) colorClasses = "bg-[#1B8A05]/20 text-[#1B8A05]";
  else if (status.includes("Booked") || status.includes("Pending") || status.includes("Assigned")) colorClasses = "bg-[#FEC925]/20 text-[#b48f00]";
  else if (status.includes("Cancelled") || status.includes("Rejected")) colorClasses = "bg-[#FF0000]/10 text-[#FF0000]";
  return (<span className={`px-4 py-1.5 rounded-full text-sm font-bold ${colorClasses}`}>{status}</span>);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Main Component
const LeadDetailPageComplete: React.FC = () => {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();

  const [leadDetails, setLeadDetails] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [checkingRating, setCheckingRating] = useState(false);
  
  // Modal states
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  useEffect(() => {
    if (!leadId) {
      setError("No lead ID provided in the URL.");
      setLoading(false);
      return;
    }
    loadLeadDetails(leadId);
  }, [leadId]);

  const loadLeadDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("You must be logged in to view this page.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/leads/leads/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Lead not found.");
        if (res.status === 401 || res.status === 403) throw new Error("You are not authorized to view this lead.");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `An error occurred (${res.status})`);
      }
      const data: LeadDetail = await res.json();
      setLeadDetails(data);
      
      // Check if lead is completed and check rating status
      if (data.status === 'completed' && data.assigned_partner) {
        checkRatingStatus(id, data.assigned_partner.user);
      }
    } catch (error: any) {
      console.error('Failed to load lead details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkRatingStatus = async (leadId: string, _partnerUserId: string) => {
    try {
      setCheckingRating(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Check if user has already rated this lead
      const res = await fetch(`${API_BASE_URL}/ops/ratings/?lead=${leadId}&rater=${localStorage.getItem('user_id')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const ratings = data.results || data;
        setHasRated(ratings.length > 0);
      }
    } catch (err) {
      console.error('Failed to check rating status:', err);
    } finally {
      setCheckingRating(false);
    }
  };

  const handleActionSuccess = () => {
    if (leadId) {
      loadLeadDetails(leadId);
    }
  };

  const canCancelOrReschedule = (status: string): boolean => {
    const nonCancellableStatuses = ['completed', 'cancelled', 'payment_processing', 'disputed'];
    return !nonCancellableStatuses.includes(status.toLowerCase());
  };

  const shouldShowRateButton = (): boolean => {
    return (
      leadDetails?.status === 'completed' &&
      leadDetails?.assigned_partner !== null &&
      !hasRated &&
      !checkingRating
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-4" size={64} />
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading Lead Details...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#1C1C1B] hover:text-[#FEC925] transition mb-6 font-semibold">
            <ArrowLeft size={24} />
            Back to Leads
          </button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
          )}
        </AnimatePresence>

        {leadDetails && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Top Info Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20 mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Lead Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#1C1C1B] mb-1">
                    Lead #{leadDetails.lead_number}
                  </h2>
                  <p className="text-gray-600">
                    Created on: {new Date(leadDetails.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Status & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  {renderStatusBadge(leadDetails.status_display)}
                  
                  {/* Rate Button - Only show for completed leads that haven't been rated */}
                  {shouldShowRateButton() && (
                    <button 
                      onClick={() => setIsRateModalOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#1B8A05] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#156d04] transition-all shadow-lg"
                    >
                      <Star size={16} />
                      Rate Service
                    </button>
                  )}

                  {/* Show rating status if already rated */}
                  {leadDetails.status === 'completed' && hasRated && (
                    <div className="flex-1 sm:flex-none px-4 py-2 bg-[#1B8A05]/20 text-[#1B8A05] rounded-lg font-bold flex items-center justify-center gap-2">
                      <CheckCircle size={16} />
                      Rated
                    </div>
                  )}
                  
                  {canCancelOrReschedule(leadDetails.status) && (
                    <div className="flex gap-3">
                      {/* Reschedule Button */}
                      <button 
                        onClick={() => setIsRescheduleModalOpen(true)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#FEC925]/20 text-[#1C1C1B] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#FEC925] transition-all"
                      >
                        <Calendar size={16} />
                        Reschedule
                      </button>
                      
                      {/* Cancel Button */}
                      <button 
                        onClick={() => setIsCancelModalOpen(true)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#FF0000]/10 text-[#FF0000] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#FF0000] hover:text-white transition-all"
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {/* Report Issue Button */}
                  {leadDetails.status !== 'cancelled' && leadDetails.status !== 'completed' && (
                    <button 
                      onClick={() => setIsDisputeModalOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#FF0000]/10 text-[#FF0000] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#FF0000] hover:text-white transition-all"
                    >
                      <AlertTriangle size={16} />
                      Report Issue
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content (Left Column) */}
              <div className="lg:col-span-2 space-y-8">
                
                <DetailCard icon={<Package size={24} className="text-[#FEC925]" />} title="Device Details">
                  <DetailRow label="Device" value={`${leadDetails.brand_name} ${leadDetails.device_model.name}`} />
                  <DetailRow label="Storage" value={leadDetails.storage} />
                  <DetailRow label="RAM" value={leadDetails.ram} />
                  <DetailRow label="Color" value={leadDetails.color} />
                  <DetailRow label="IMEI" value={leadDetails.imei_primary} />
                </DetailCard>

                <DetailCard icon={<Wallet size={24} className="text-[#FEC925]" />} title="Price Details">
                  <DetailRow label="Estimated Price" value={`₹${parseFloat(leadDetails.estimated_price).toLocaleString('en-IN')}`} />
                  <DetailRow label="Quoted Price" value={leadDetails.quoted_price ? `₹${parseFloat(leadDetails.quoted_price).toLocaleString('en-IN')}` : 'Pending'} />
                  <DetailRow label="Final Price" value={leadDetails.final_price ? `₹${parseFloat(leadDetails.final_price).toLocaleString('en-IN')}` : 'Pending'} />
                  {leadDetails.latest_offer && (
                    <div className="bg-[#EEEFFF] p-4 rounded-lg border-l-4 border-[#FEC925]">
                      <p className="font-bold text-lg text-[#1C1C1B]">Latest Offer: ₹{parseFloat(leadDetails.latest_offer.partner_offered_price).toLocaleString('en-IN')}</p>
                      <p className="text-gray-700 italic">"{leadDetails.latest_offer.message}"</p>
                      <p className="text-sm font-semibold mt-2">Status: <span className="text-[#1B8A05]">{leadDetails.latest_offer.status}</span></p>
                    </div>
                  )}
                </DetailCard>

                <DetailCard icon={<CheckCircle size={24} className="text-[#FEC925]" />} title="Condition Report">
                  {Object.entries(leadDetails.condition_responses).map(([key, value]) => (
                    <DetailRow key={key} label={capitalize(key.replace(/_/g, ' '))} value={Array.isArray(value) ? value.join(', ') : String(value)} />
                  ))}
                </DetailCard>

                <DetailCard icon={<Tag size={24} className="text-[#FEC925]" />} title="Device Photos">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {leadDetails.device_photos.length > 0 ? leadDetails.device_photos.map((photo, idx) => (
                      <a key={idx} href={photo.url} target="_blank" rel="noopener noreferrer" className="aspect-square group">
                        <img src={photo.url} alt={photo.description || `Device photo ${idx + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#FEC925] transition" />
                      </a>
                    )) : (
                      <p className="text-gray-500 col-span-full">No photos were uploaded for this lead.</p>
                    )}
                  </div>
                </DetailCard>
                
                <DetailCard icon={<MapPin size={24} className="text-[#FEC925]" />} title="Pickup Details">
                  <p className="font-bold text-lg text-[#1C1C1B]">{leadDetails.pickup_address.address_line1}</p>
                  {leadDetails.pickup_address.address_line2 && <p className="text-gray-700">{leadDetails.pickup_address.address_line2}</p>}
                  {leadDetails.pickup_address.landmark && <p className="text-sm text-gray-600">Landmark: {leadDetails.pickup_address.landmark}</p>}
                  <p className="text-gray-700 font-semibold">{leadDetails.pickup_address.city}, {leadDetails.pickup_address.state} - {leadDetails.pickup_address.pincode}</p>
                  <div className="border-t pt-4 mt-4">
                    <DetailRow label="Date" value={new Date(leadDetails.preferred_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} />
                    <DetailRow label="Slot" value={leadDetails.preferred_time_slot} />
                  </div>
                  {leadDetails.customer_notes && (
                    <div className="bg-[#F0F7F6] p-3 rounded-lg border border-[#1B8A05]/20">
                      <p className="font-semibold text-gray-800">Customer Notes:</p>
                      <p className="text-gray-700 italic">"{leadDetails.customer_notes}"</p>
                    </div>
                  )}
                </DetailCard>

                {/* Disputes Section */}
                <DetailCard icon={<AlertTriangle size={24} className="text-[#FEC925]" />} title="Disputes & Issues">
                  <LeadDisputesSection leadId={leadDetails.id} />
                </DetailCard>

              </div>
              
              {/* Sidebar (Right Column) */}
              <div className="lg:col-span-1 space-y-8">
                
                <DetailCard icon={<MessageSquare size={24} className="text-[#FEC925]" />} title="Live Chat">
                  <LeadChat 
                    leadId={leadDetails.id} 
                    currentUserId={leadDetails.user.id} 
                    partnerAssigned={!!leadDetails.assigned_partner} 
                  />
                </DetailCard>

                <DetailCard icon={<Activity size={24} className="text-[#FEC925]" />} title="Lead History">
                  <LeadStatusHistory leadId={leadDetails.id} />
                </DetailCard>

                <DetailCard icon={<Shield size={24} className="text-[#FEC925]" />} title="Assigned Partner">
                  {leadDetails.assigned_partner ? (
                    <>
                      <DetailRow label="Business" value={leadDetails.assigned_partner.business_name} />
                      <DetailRow label="Agent" value={leadDetails.assigned_partner.contact_person} />
                      <DetailRow label="Phone" value={leadDetails.assigned_partner.phone} />
                      <DetailRow label="Rating" value={`${leadDetails.assigned_partner.rating_average} ★`} />
                      <DetailRow label="Leads Done" value={leadDetails.assigned_partner.total_leads_completed} />
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Waiting for a partner to be assigned...</p>
                  )}
                </DetailCard>

                <DetailCard icon={<User size={24} className="text-[#FEC925]" />} title="Customer Details">
                  <DetailRow label="Name" value={leadDetails.user.name} />
                  <DetailRow label="Phone" value={leadDetails.user.phone} />
                  <DetailRow label="Email" value={leadDetails.user.email} />
                </DetailCard>

              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {leadDetails && (
        <>
          <RaiseDisputeModal
            isOpen={isDisputeModalOpen}
            onClose={() => setIsDisputeModalOpen(false)}
            leadId={leadDetails.id}
            leadNumber={leadDetails.lead_number}
            onSuccess={handleActionSuccess}
          />

          <CancelLeadModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            leadId={leadDetails.id}
            leadNumber={leadDetails.lead_number}
            onSuccess={handleActionSuccess}
          />

          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            leadId={leadDetails.id}
            leadNumber={leadDetails.lead_number}
            currentDate={leadDetails.preferred_date}
            currentTimeSlot={leadDetails.preferred_time_slot}
            onSuccess={handleActionSuccess}
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
                handleActionSuccess();
              }}
            />
          )}
        </>
      )}
    </section>
  );
};

export default LeadDetailPageComplete;