// src/pages/disputes/DisputeDetail_FIXED.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Download,
  X,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  evidence: {
    photos: string[];
    documents: string[];
    notes: string;
  };
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

const DISPUTE_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  'pricing': { label: 'Pricing Dispute', icon: '💰' },
  'device_condition': { label: 'Device Condition', icon: '📱' },
  'missing_items': { label: 'Missing Items', icon: '📦' },
  'partner_behavior': { label: 'Partner Behavior', icon: '👤' },
  'payment': { label: 'Payment Issue', icon: '💳' },
  'other': { label: 'Other', icon: '❓' }
};

const PRIORITY_CONFIG: Record<string, { color: string; bgColor: string }> = {
  'low': { color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
  'medium': { color: '#FEC925', bgColor: 'rgba(254, 201, 37, 0.1)' },
  'high': { color: '#FF6B00', bgColor: 'rgba(255, 107, 0, 0.1)' },
  'urgent': { color: '#FF0000', bgColor: 'rgba(255, 0, 0, 0.1)' }
};

const RESOLUTION_LABELS: Record<string, string> = {
  'favor_customer': 'Resolved in Customer\'s Favor',
  'favor_partner': 'Resolved in Partner\'s Favor',
  'split': 'Split Resolution',
  'no_fault': 'No Fault Found'
};

const DisputeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { disputeId } = useParams<{ disputeId: string }>();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (disputeId) {
      loadDisputeDetails(disputeId);
    }
  }, [disputeId]);

  const loadDisputeDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${API_BASE_URL}/ops/disputes/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Dispute not found');
        }
        if (res.status === 403) {
          throw new Error('You do not have permission to view this dispute');
        }
        throw new Error('Failed to load dispute details');
      }

      const data: Dispute = await res.json();
      
      // Ensure evidence structure exists
      if (!data.evidence) {
        data.evidence = { photos: [], documents: [], notes: '' };
      }
      if (!Array.isArray(data.evidence.photos)) {
        data.evidence.photos = [];
      }
      if (!Array.isArray(data.evidence.documents)) {
        data.evidence.documents = [];
      }
      
      console.log('📥 Loaded dispute:', {
        id: data.id,
        photos: data.evidence.photos.length,
        documents: data.evidence.documents.length
      });
      
      setDispute(data);

    } catch (err: any) {
      console.error('Failed to load dispute:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string): ReactNode => {
    switch (status) {
      case 'pending':
        return <Clock className="text-[#FEC925]" size={24} />;
      case 'under_review':
        return <FileText className="text-blue-600" size={24} />;
      case 'resolved':
        return <CheckCircle className="text-[#1B8A05]" size={24} />;
      case 'escalated':
        return <TrendingUp className="text-[#FF0000]" size={24} />;
      default:
        return <AlertTriangle className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status: string): { text: string; bg: string } => {
    switch (status) {
      case 'pending':
        return { text: 'text-[#FEC925]', bg: 'bg-[#FEC925]/10' };
      case 'under_review':
        return { text: 'text-blue-600', bg: 'bg-blue-100' };
      case 'resolved':
        return { text: 'text-[#1B8A05]', bg: 'bg-[#1B8A05]/10' };
      case 'escalated':
        return { text: 'text-[#FF0000]', bg: 'bg-[#FF0000]/10' };
      default:
        return { text: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const downloadBase64File = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <p className="text-[#1C1C1B] text-xl font-semibold">Loading Dispute Details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md"
        >
          <AlertTriangle className="text-[#FF0000] mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-[#1C1C1B] mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Dispute not found'}</p>
          <button
            onClick={() => navigate('/disputes')}
            className="px-6 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#e5b520] transition"
          >
            Back to Disputes
          </button>
        </motion.div>
      </div>
    );
  }

  const statusColor = getStatusColor(dispute.status);
  const priorityConfig = PRIORITY_CONFIG[dispute.priority] || PRIORITY_CONFIG['medium'];
  const disputeTypeInfo = DISPUTE_TYPE_LABELS[dispute.dispute_type] || { label: dispute.dispute_type, icon: '❓' };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/disputes')}
            className="flex items-center gap-2 text-[#1C1C1B] hover:text-[#FEC925] transition mb-6 font-semibold"
          >
            <ArrowLeft size={24} />
            Back to Disputes
          </button>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                {getStatusIcon(dispute.status)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1B] mb-2">
                  {dispute.dispute_number}
                </h1>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${statusColor.text} ${statusColor.bg}`}>
                    {formatStatus(dispute.status)}
                  </span>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      color: priorityConfig.color,
                      backgroundColor: priorityConfig.bgColor
                    }}
                  >
                    {formatStatus(dispute.priority)} Priority
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/lead/${dispute.lead}`)}
              className="px-6 py-3 bg-[#FEC925] text-[#1C1C1B] rounded-xl font-bold hover:bg-[#e5b520] transition flex items-center gap-2"
            >
              <FileText size={20} />
              View Lead #{dispute.lead_number}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Dispute Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20"
            >
              <h2 className="text-2xl font-bold text-[#1C1C1B] mb-6 flex items-center gap-3">
                <AlertTriangle className="text-[#FEC925]" size={24} />
                Dispute Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Dispute Type</label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-3xl">{disputeTypeInfo.icon}</span>
                    <span className="font-bold text-lg text-[#1C1C1B]">{disputeTypeInfo.label}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dispute.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Evidence Section */}
            {(dispute.evidence?.photos?.length > 0 || dispute.evidence?.documents?.length > 0 || dispute.evidence?.notes) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20"
              >
                <h2 className="text-2xl font-bold text-[#1C1C1B] mb-6 flex items-center gap-3">
                  <Shield className="text-[#FEC925]" size={24} />
                  Supporting Evidence
                </h2>

                <div className="space-y-6">
                  {/* Photos */}
                  {dispute.evidence.photos && dispute.evidence.photos.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                        <ImageIcon size={16} />
                        Photos ({dispute.evidence.photos.length})
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dispute.evidence.photos.map((photo, idx) => (
                          <div key={idx} className="relative group cursor-pointer">
                            <img
                              src={photo}
                              alt={`Evidence ${idx + 1}`}
                              onClick={() => setSelectedImage(photo)}
                              className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-[#FEC925] transition shadow-lg"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadBase64File(photo, `evidence-photo-${idx + 1}.jpg`);
                              }}
                              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <Download size={16} className="text-[#1C1C1B]" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-xl">
                              <p className="text-white text-xs font-semibold">Photo {idx + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {dispute.evidence.documents && dispute.evidence.documents.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        Documents ({dispute.evidence.documents.length})
                      </label>
                      <div className="space-y-2">
                        {dispute.evidence.documents.map((doc, idx) => (
                          <button
                            key={idx}
                            onClick={() => downloadBase64File(doc, `evidence-document-${idx + 1}.pdf`)}
                            className="w-full flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-[#FEC925] transition group"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="text-[#FEC925]" size={24} />
                              <span className="font-semibold text-[#1C1C1B]">Document {idx + 1}</span>
                            </div>
                            <Download size={20} className="text-gray-400 group-hover:text-[#1C1C1B]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {dispute.evidence.notes && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <MessageSquare size={16} />
                        Additional Notes
                      </label>
                      <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dispute.evidence.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Resolution Section */}
            {dispute.status === 'resolved' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1B8A05]/10 border-2 border-[#1B8A05] p-6 rounded-2xl"
              >
                <h2 className="text-2xl font-bold text-[#1B8A05] mb-6 flex items-center gap-3">
                  <CheckCircle size={24} />
                  Resolution
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Resolution Type</label>
                    <p className="font-bold text-lg text-[#1C1C1B]">
                      {RESOLUTION_LABELS[dispute.resolution_type] || formatStatus(dispute.resolution_type)}
                    </p>
                  </div>

                  {dispute.resolution_amount && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Resolution Amount</label>
                      <p className="font-bold text-2xl text-[#1B8A05]">
                        ₹{parseFloat(dispute.resolution_amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}

                  {dispute.resolution_notes && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Resolution Notes</label>
                      <div className="p-4 bg-white rounded-xl border-2 border-[#1B8A05]/20">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dispute.resolution_notes}</p>
                      </div>
                    </div>
                  )}

                  {dispute.resolved_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-[#1B8A05]/20">
                      <Calendar size={16} />
                      <span>Resolved on {formatDate(dispute.resolved_at)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Timeline and Info */}
          <div className="space-y-8">
            
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20"
            >
              <h3 className="text-xl font-bold text-[#1C1C1B] mb-6 flex items-center gap-3">
                <Calendar className="text-[#FEC925]" size={20} />
                Timeline
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#FEC925]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-[#FEC925]" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1C1B]">Dispute Raised</p>
                    <p className="text-sm text-gray-600">{formatDate(dispute.created_at)}</p>
                  </div>
                </div>

                {dispute.resolved_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#1B8A05]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-[#1B8A05]" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C1C1B]">Resolved</p>
                      <p className="text-sm text-gray-600">{formatDate(dispute.resolved_at)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1C1B]">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(dispute.updated_at)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Raised By */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20"
            >
              <h3 className="text-xl font-bold text-[#1C1C1B] mb-4 flex items-center gap-3">
                <User className="text-[#FEC925]" size={20} />
                Raised By
              </h3>
              <p className="font-semibold text-lg text-[#1C1C1B]">{dispute.raised_by_name}</p>
            </motion.div>

            {/* Assigned To */}
            {dispute.assigned_to_name && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20"
              >
                <h3 className="text-xl font-bold text-[#1C1C1B] mb-4 flex items-center gap-3">
                  <Shield className="text-[#FEC925]" size={20} />
                  Assigned To
                </h3>
                <p className="font-semibold text-lg text-[#1C1C1B]">{dispute.assigned_to_name}</p>
                <p className="text-sm text-gray-600 mt-1">Support Agent</p>
              </motion.div>
            )}

            {/* Related Lead */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#FEC925]/20"
            >
              <h3 className="text-xl font-bold text-[#1C1C1B] mb-4 flex items-center gap-3">
                <FileText className="text-[#FEC925]" size={20} />
                Related Lead
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-lg text-[#1C1C1B]">#{dispute.lead_number}</p>
                <p className="text-sm text-gray-600">Status: {formatStatus(dispute.lead_status)}</p>
                <button
                  onClick={() => navigate(`/leads/${dispute.lead}`)}
                  className="w-full mt-4 px-4 py-2 bg-[#FEC925] text-[#1C1C1B] rounded-lg font-semibold hover:bg-[#e5b520] transition"
                >
                  View Lead Details
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#FEC925] transition"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Evidence"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadBase64File(selectedImage, 'evidence-photo.jpg');
              }}
              className="absolute bottom-4 right-4 px-4 py-2 bg-[#FEC925] text-[#1C1C1B] rounded-lg font-semibold hover:bg-[#e5b520] transition flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default DisputeDetail;