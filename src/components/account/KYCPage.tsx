import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, CheckCircle, AlertCircle, FileText, Camera, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import * as authService from '../../api/services/authService';
import useKYCBankStatus from '../../api/services/useKYCBankStatus';
import type { UserKYC } from '../../api/types/auth.types';
import type { MenuTab } from './MyAccountPage';

// FlipCash Brand Colors
const COLORS = {
  primary: '#FEC925',     // Yellow
  success: '#1B8A05',     // Green
  error: '#FF0000',       // Red
  text: '#1C1C1B',        // Black
  lightGray: '#F5F5F5',
  mediumGray: '#CCCCCC',
  darkGray: '#666666',
};

interface KYCPageProps {
  onNavClick?: (tab: MenuTab | 'account' | 'kyc' | 'bank') => void;
  onLogout?: () => void;
  username?: string;
  onBreadcrumbClick?: (path: string) => void;
}

const KYCPage: React.FC<KYCPageProps> = ({ onNavClick }) => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { refresh: refreshKYCStatus } = useKYCBankStatus();
  
  // Get return path from navigation state
  const returnTo = (location.state as any)?.returnTo || '/account';
  
  const [kycData, setKycData] = useState<UserKYC | null>(null);
  const [documentType, setDocumentType] = useState<'aadhaar' | 'pan' | 'passport' | 'driving_license'>('aadhaar');
  const [documentNumber, setDocumentNumber] = useState('');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const data = await authService.getKYC();
      setKycData(data);
      if (data.document_type) setDocumentType(data.document_type);
      if (data.document_number) setDocumentNumber(data.document_number);
    } catch (err: any) {
      console.error('Failed to fetch KYC:', err);
    }
  };

  const handleFileChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleBack = () => {
    if (onNavClick) {
      onNavClick('account');
    } else if (navigate) {
      navigate(returnTo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authService.uploadKYC({
        document_type: documentType,
        document_number: documentNumber,
        document_front_image: frontImage!,
        document_back_image: backImage || '',
        selfie_image: selfieImage || '',
      });

      // Refresh user profile
      await refreshUser();
      
      // Refresh KYC/Bank status
      await refreshKYCStatus();
      
      setSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onNavClick) {
          onNavClick('account');
        } else if (navigate) {
          navigate(returnTo);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = documentNumber && frontImage && selfieImage;

  const getStatusBadge = () => {
    const status = user?.kyc_status || 'pending';
    
    const badges = {
      pending: {
        bg: `${COLORS.primary}20`,
        border: COLORS.primary,
        text: COLORS.primary,
        label: '⏳ Pending',
      },
      in_review: {
        bg: `${COLORS.primary}20`,
        border: COLORS.primary,
        text: COLORS.primary,
        label: '⏳ Under Review',
      },
      submitted: {
        bg: `${COLORS.primary}20`,
        border: COLORS.primary,
        text: COLORS.primary,
        label: '⏳ Under Review',
      },
      verified: {
        bg: `${COLORS.success}20`,
        border: COLORS.success,
        text: COLORS.success,
        label: '✓ Verified',
      },
      rejected: {
        bg: `${COLORS.error}20`,
        border: COLORS.error,
        text: COLORS.error,
        label: '✗ Rejected',
      },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;

    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border-2"
        style={{
          backgroundColor: badge.bg,
          borderColor: badge.border,
          color: badge.text,
        }}
      >
        {badge.label}
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2"
          style={{ borderColor: `${COLORS.primary}20` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2" style={{ borderColor: `${COLORS.primary}20` }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                style={{ color: COLORS.text }}
              >
                <ArrowLeft size={24} />
              </button>
              <div
                className="p-4 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.success}20)`,
                }}
              >
                <Shield size={32} style={{ color: COLORS.success }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  KYC Verification
                </h1>
                <p className="text-gray-600">Complete your identity verification</p>
              </div>
            </div>
            <div>
              {getStatusBadge()}
            </div>
          </div>

          {/* Status Alerts */}
          {(user?.kyc_status === 'submitted') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl p-4 flex items-center gap-3 border-2"
              style={{
                backgroundColor: `${COLORS.primary}20`,
                borderColor: `${COLORS.primary}40`,
              }}
            >
              <AlertCircle size={24} style={{ color: COLORS.primary }} />
              <div>
                <p className="font-bold" style={{ color: COLORS.text }}>
                  Under Review
                </p>
                <p className="text-sm text-gray-600">
                  Your KYC documents are being verified. This typically takes 1-2 business days.
                </p>
              </div>
            </motion.div>
          )}

          {user?.kyc_status === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl p-4 flex items-center gap-3 border-2"
              style={{
                backgroundColor: `${COLORS.success}20`,
                borderColor: `${COLORS.success}40`,
              }}
            >
              <CheckCircle size={24} style={{ color: COLORS.success }} />
              <div>
                <p className="font-bold" style={{ color: COLORS.text }}>
                  KYC Verified ✓
                </p>
                <p className="text-sm text-gray-600">
                  Your identity has been successfully verified. You can now access all features.
                </p>
              </div>
            </motion.div>
          )}

          {user?.kyc_status === 'rejected' && kycData?.verification_notes && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl p-4 border-2"
              style={{
                backgroundColor: `${COLORS.error}20`,
                borderColor: `${COLORS.error}40`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={24} style={{ color: COLORS.error }} />
                <p className="font-bold" style={{ color: COLORS.error }}>
                  KYC Rejected
                </p>
              </div>
              <p className="text-sm ml-9" style={{ color: COLORS.darkGray }}>
                <strong>Reason:</strong> {kycData.verification_notes}
              </p>
              <p className="text-sm ml-9 mt-2" style={{ color: COLORS.darkGray }}>
                Please correct the issues and resubmit your documents.
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                <FileText size={18} style={{ color: COLORS.primary }} />
                Document Type <span style={{ color: COLORS.error }}>*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl transition-all text-lg focus:outline-none"
                style={{
                  borderColor: '#CCCCCC',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}30`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CCCCCC';
                  e.target.style.boxShadow = 'none';
                }}
                required
                disabled={user?.kyc_status === 'submitted' || user?.kyc_status === 'verified'}
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: COLORS.text }}>
                Document Number <span style={{ color: COLORS.error }}>*</span>
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 border-2 rounded-xl transition-all text-lg focus:outline-none"
                style={{
                  borderColor: '#CCCCCC',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}30`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CCCCCC';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder={
                  documentType === 'aadhaar' ? '1234 5678 9012' :
                  documentType === 'pan' ? 'ABCDE1234F' :
                  'Enter document number'
                }
                required
                disabled={user?.kyc_status === 'submitted' || user?.kyc_status === 'verified'}
              />
            </div>

            {/* Front Image */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                <Camera size={18} style={{ color: COLORS.success }} />
                Document Front Image <span style={{ color: COLORS.error }}>*</span>
              </label>
              {frontPreview || kycData?.document_front_image ? (
                <div className="relative">
                  <img
                    src={frontPreview || kycData?.document_front_image || ''}
                    alt="Document Front"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, setFrontImage, setFrontPreview)}
                      className="absolute top-2 right-2 p-2 text-white rounded-lg hover:opacity-90 transition-all"
                      style={{ backgroundColor: COLORS.error }}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                  style={{
                    borderColor: COLORS.mediumGray,
                    backgroundColor: COLORS.lightGray,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E5E5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.lightGray;
                  }}
                >
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload front image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setFrontImage, setFrontPreview)}
                    className="hidden"
                    required={!kycData?.document_front_image}
                    disabled={user?.kyc_status === 'submitted' || user?.kyc_status === 'verified'}
                  />
                </label>
              )}
            </div>

            {/* Back Image */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                <Camera size={18} style={{ color: COLORS.success }} />
                Document Back Image <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              {backPreview || kycData?.document_back_image ? (
                <div className="relative">
                  <img
                    src={backPreview || kycData?.document_back_image || ''}
                    alt="Document Back"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, setBackImage, setBackPreview)}
                      className="absolute top-2 right-2 p-2 text-white rounded-lg hover:opacity-90"
                      style={{ backgroundColor: COLORS.error }}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                  style={{
                    borderColor: COLORS.mediumGray,
                    backgroundColor: COLORS.lightGray,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E5E5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.lightGray;
                  }}
                >
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload back image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setBackImage, setBackPreview)}
                    className="hidden"
                    disabled={user?.kyc_status === 'submitted' || user?.kyc_status === 'verified'}
                  />
                </label>
              )}
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                <Camera size={18} style={{ color: COLORS.primary }} />
                Selfie with Document <span style={{ color: COLORS.error }}>*</span>
              </label>
              {selfiePreview || kycData?.selfie_image ? (
                <div className="relative">
                  <img
                    src={selfiePreview || kycData?.selfie_image || ''}
                    alt="Selfie"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, setSelfieImage, setSelfiePreview)}
                      className="absolute top-2 right-2 p-2 text-white rounded-lg hover:opacity-90"
                      style={{ backgroundColor: COLORS.error }}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                  style={{
                    borderColor: COLORS.mediumGray,
                    backgroundColor: COLORS.lightGray,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E5E5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.lightGray;
                  }}
                >
                  <Camera size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to take selfie</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setSelfieImage, setSelfiePreview)}
                    className="hidden"
                    required={!kycData?.selfie_image}
                    disabled={user?.kyc_status === 'submitted' || user?.kyc_status === 'verified'}
                  />
                </label>
              )}
            </div>

            {/* Info Box */}
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.darkGray,
              }}
            >
              ℹ️ <strong>Important:</strong> Ensure all images are clear and readable. Your documents will be verified within 24-48 hours.
            </div>

            {/* Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl border-2"
                style={{
                  backgroundColor: `${COLORS.success}20`,
                  borderColor: `${COLORS.success}40`,
                  color: COLORS.success,
                }}
              >
                <CheckCircle size={24} />
                <span className="font-semibold">KYC submitted successfully! Redirecting...</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl border-2"
                style={{
                  backgroundColor: `${COLORS.error}20`,
                  borderColor: `${COLORS.error}40`,
                  color: COLORS.error,
                }}
              >
                <AlertCircle size={24} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 font-bold text-lg rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.success})`,
                  color: COLORS.text,
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
                      style={{ borderColor: COLORS.text }}
                    ></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    {user?.kyc_status === 'rejected' ? 'Resubmit KYC' : 'Submit KYC'}
                  </>
                )}
              </button>
            )}

            {/* Already Submitted Info */}
            {(user?.kyc_status === 'submitted') && (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Your KYC is under review. You'll be notified once verification is complete.
                </p>
              </div>
            )}

            {/* Verified Info */}
            {user?.kyc_status === 'verified' && (
              <div className="text-center py-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 font-bold rounded-lg transition-all hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.text,
                  }}
                >
                  Back to Account
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default KYCPage;