import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, CheckCircle, AlertCircle, FileText, Camera, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/services/authService';
import type { UserKYC } from '../../api/types/auth.types';
import type { MenuTab } from './MyAccountPage';

interface KYCPageProps {
  onNavClick: (tab: MenuTab | 'account' | 'kyc' | 'bank') => void; // Update this
  onLogout?: () => void; // Add this
  username?: string; // Add this
  onBreadcrumbClick?: (path: string) => void; // Add this
}

const KYCPage: React.FC<KYCPageProps> = ({ onNavClick }) => {
  const { user, refreshUser } = useAuth();
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

      await refreshUser();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // ✅ CORRECTION: This call is now valid
        onNavClick('account');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = documentNumber && frontImage && selfieImage;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#FEC925]/20"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#FEC925]/20">
            <button
              // ✅ CORRECTION: This call is now valid
              onClick={() => onNavClick('account')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="p-4 bg-gradient-to-r from-[#FEC925]/20 to-[#1B8A05]/20 rounded-xl">
              <Shield size={32} className="text-[#1B8A05]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1B]">KYC Verification</h1>
              <p className="text-gray-600">Complete your identity verification</p>
            </div>
          </div>

          {/* Status Alerts */}
          {user?.kyc_status === 'submitted' && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={24} className="text-blue-600" />
              <div>
                <p className="font-bold text-blue-800">Under Review</p>
                <p className="text-sm text-blue-600">Your KYC documents are being verified. This typically takes 1-2 business days.</p>
              </div>
            </div>
          )}

          {user?.kyc_status === 'rejected' && kycData?.verification_notes && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={24} className="text-red-600" />
                <p className="font-bold text-red-800">KYC Rejected</p>
              </div>
              <p className="text-sm text-red-600 ml-9">{kycData.verification_notes}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <FileText size={18} className="text-[#FEC925]" />
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all text-lg"
                required
                disabled={user?.kyc_status === 'submitted'}
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3">
                Document Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all text-lg"
                placeholder={
                  documentType === 'aadhaar' ? '1234 5678 9012' :
                  documentType === 'pan' ? 'ABCDE1234F' :
                  'Enter document number'
                }
                required
                disabled={user?.kyc_status === 'submitted'}
              />
            </div>

            {/* Front Image */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <Camera size={18} className="text-[#1B8A05]" />
                Document Front Image <span className="text-red-500">*</span>
              </label>
              {frontPreview || kycData?.document_front_image ? (
                <div className="relative">
                  <img
                    src={frontPreview || kycData?.document_front_image || ''}
                    alt="Document Front"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  {user?.kyc_status !== 'submitted' && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, setFrontImage, setFrontPreview)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload front image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setFrontImage, setFrontPreview)}
                    className="hidden"
                    required={!kycData?.document_front_image}
                    disabled={user?.kyc_status === 'submitted'}
                  />
                </label>
              )}
            </div>

            {/* Back Image */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <Camera size={18} className="text-[#1B8A05]" />
                Document Back Image <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              {backPreview || kycData?.document_back_image ? (
                <div className="relative">
                  <img
                    src={backPreview || kycData?.document_back_image || ''}
                    alt="Document Back"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  {user?.kyc_status !== 'submitted' && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, setBackImage, setBackPreview)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload back image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setBackImage, setBackPreview)}
                    className="hidden"
                    disabled={user?.kyc_status === 'submitted'}
                  />
                </label>
              )}
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <Camera size={18} className="text-[#FEC925]" />
                Selfie with Document <span className="text-red-500">*</span>
              </label>
              {selfiePreview || kycData?.selfie_image ? (
                <div className="relative">
                  <img
                    src={selfiePreview || kycData?.selfie_image || ''}
                    alt="Selfie"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  {user?.kyc_status !== 'submitted' && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, setSelfieImage, setSelfiePreview)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Camera size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to take selfie</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setSelfieImage, setSelfiePreview)}
                    className="hidden"
                    required={!kycData?.selfie_image}
                    disabled={user?.kyc_status === 'submitted'}
                  />
                </label>
              )}
            </div>

            {/* Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border-2 border-green-200"
              >
                <CheckCircle size={24} />
                <span className="font-semibold">KYC submitted successfully! Redirecting...</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200"
              >
                <AlertCircle size={24} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            {user?.kyc_status !== 'submitted' && (
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold text-lg rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1C1C1B] border-t-transparent"></div>
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
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default KYCPage;