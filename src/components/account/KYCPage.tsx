import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, CheckCircle, AlertCircle, FileText, Camera, X, ArrowLeft, Info } from 'lucide-react';
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

interface FileWithSize {
  file: File;
  originalSize: number;
  compressedSize: number;
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
  
  // Updated state to track file sizes
  const [frontImage, setFrontImage] = useState<FileWithSize | null>(null);
  const [backImage, setBackImage] = useState<FileWithSize | null>(null);
  const [selfieImage, setSelfieImage] = useState<FileWithSize | null>(null);
  
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
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

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Image compression function
  const compressImage = async (file: File, _maxSizeMB = 1): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onerror = () => reject(new Error('Failed to load image'));
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions 1920x1080 for quality balance
          const maxWidth = 1920;
          const maxHeight = 1080;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            0.85 // 85% quality - good balance between size and quality
          );
        };
        
        img.src = e.target!.result as string;
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Handle file change with compression
  const handleFileChange = async (
    file: File | null,
    setFile: (file: FileWithSize | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (file) {
      setCompressing(true);
      try {
        const originalSize = file.size;
        
        // Compress image
        const compressedFile = await compressImage(file);
        const compressedSize = compressedFile.size;
        
        // Create file with size info
        const fileWithSize: FileWithSize = {
          file: compressedFile,
          originalSize,
          compressedSize,
        };
        
        setFile(fileWithSize);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(compressedFile);
        
        console.log(`Image compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${Math.round((1 - compressedSize / originalSize) * 100)}% reduction)`);
      } catch (err) {
        console.error('Compression failed:', err);
        setError('Failed to process image. Please try another image.');
      } finally {
        setCompressing(false);
      }
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
      // Calculate total upload size
      const totalSize = 
        (frontImage?.compressedSize || 0) + 
        (backImage?.compressedSize || 0) + 
        (selfieImage?.compressedSize || 0);
      
      console.log(`Total upload size: ${formatFileSize(totalSize)}`);

      await authService.uploadKYC({
        document_type: documentType,
        document_number: documentNumber,
        document_front_image: frontImage!.file,
        document_back_image: backImage?.file || '',
        selfie_image: selfieImage!.file || '',
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

  // Calculate total size for display
  const getTotalUploadSize = () => {
    const total = 
      (frontImage?.compressedSize || 0) + 
      (backImage?.compressedSize || 0) + 
      (selfieImage?.compressedSize || 0);
    return formatFileSize(total);
  };

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

  // File size display component
  const FileSizeDisplay: React.FC<{ fileData: FileWithSize | null; label: string }> = ({ fileData, label }) => {
    if (!fileData) return null;
    
    const reduction = Math.round((1 - fileData.compressedSize / fileData.originalSize) * 100);
    
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-semibold">{label}</p>
            <p className="mt-1">
              Original: <span className="font-mono">{formatFileSize(fileData.originalSize)}</span>
              {' → '}
              Compressed: <span className="font-mono font-bold">{formatFileSize(fileData.compressedSize)}</span>
              {' '}
              <span className="text-green-700">({reduction}% smaller)</span>
            </p>
          </div>
        </div>
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

          {/* Compressing Overlay */}
          {compressing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 rounded-xl p-4 flex items-center gap-3 border-2"
              style={{
                backgroundColor: `${COLORS.primary}20`,
                borderColor: `${COLORS.primary}40`,
              }}
            >
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
              <p className="font-semibold" style={{ color: COLORS.text }}>
                Compressing image for faster upload...
              </p>
            </motion.div>
          )}

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
                <div>
                  <div className="relative">
                    <img
                      src={frontPreview || kycData?.document_front_image || ''}
                      alt="Document Front"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => {
                          setFrontImage(null);
                          setFrontPreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 text-white rounded-lg hover:opacity-90 transition-all"
                        style={{ backgroundColor: COLORS.error }}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <FileSizeDisplay fileData={frontImage} label="Front Image" />
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
                  <p className="text-xs text-gray-400 mt-1">Images will be automatically compressed</p>
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
                <div>
                  <div className="relative">
                    <img
                      src={backPreview || kycData?.document_back_image || ''}
                      alt="Document Back"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => {
                          setBackImage(null);
                          setBackPreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 text-white rounded-lg hover:opacity-90"
                        style={{ backgroundColor: COLORS.error }}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <FileSizeDisplay fileData={backImage} label="Back Image" />
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
                  <p className="text-xs text-gray-400 mt-1">Images will be automatically compressed</p>
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
                <div>
                  <div className="relative">
                    <img
                      src={selfiePreview || kycData?.selfie_image || ''}
                      alt="Selfie"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    {user?.kyc_status !== 'submitted' && user?.kyc_status !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelfieImage(null);
                          setSelfiePreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 text-white rounded-lg hover:opacity-90"
                        style={{ backgroundColor: COLORS.error }}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <FileSizeDisplay fileData={selfieImage} label="Selfie Image" />
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
                  <p className="text-xs text-gray-400 mt-1">Images will be automatically compressed</p>
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

            {/* Total Upload Size */}
            {(frontImage || backImage || selfieImage) && (
              <div className="p-4 rounded-xl border-2 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-bold text-green-800">Ready to Upload</p>
                    <p className="text-sm text-green-700 mt-1">
                      Total size: <span className="font-mono font-bold">{getTotalUploadSize()}</span>
                      {' '}(optimized for fast upload)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.darkGray,
              }}
            >
              ℹ️ <strong>Important:</strong> Images are automatically compressed to reduce upload time while maintaining quality. Your documents will be verified within 24-48 hours.
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
                disabled={loading || !isFormValid || compressing}
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
                    Uploading... {getTotalUploadSize()}
                  </>
                ) : compressing ? (
                  <>
                    <div
                      className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
                      style={{ borderColor: COLORS.text }}
                    ></div>
                    Compressing images...
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