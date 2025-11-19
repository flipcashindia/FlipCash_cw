// KYCBankPrompt.tsx
// Reusable component to prompt users to complete KYC and add bank account
// Can be used anywhere in the app (wallet, withdrawal, profile, etc.)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Building2, X, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

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

interface KYCBankStatus {
  kyc_status: 'pending' | 'verified' | 'rejected' | 'in_review';
  has_bank_account: boolean;
  has_verified_account: boolean;
}

interface KYCBankPromptProps {
  // Display mode
  mode?: 'full' | 'compact' | 'banner';
  
  // Navigation callbacks
  onKYCClick: () => void;
  onBankClick: () => void;
  
  // Optional: Custom styling
  className?: string;
  
  // Optional: Show/hide close button
  dismissible?: boolean;
  onDismiss?: () => void;
  
  // Optional: Force show even if already completed
  forceShow?: boolean;
  
  // Optional: Custom messages
  title?: string;
  description?: string;
}

const KYCBankPrompt: React.FC<KYCBankPromptProps> = ({
  mode = 'full',
  onKYCClick,
  onBankClick,
  className = '',
  dismissible = false,
  onDismiss,
  forceShow = false,
  title,
  description,
}) => {
  const [status, setStatus] = useState<KYCBankStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      // Fetch KYC status from user profile
      const userResponse = await axios.get('/api/accounts/me/');
      const kycStatus = userResponse.data.kyc_status || 'pending';

      // Fetch bank account status
      const bankResponse = await axios.get('/api/accounts/bank-accounts/check-added/');
      
      setStatus({
        kyc_status: kycStatus,
        has_bank_account: bankResponse.data.has_bank_account,
        has_verified_account: bankResponse.data.has_verified_account,
      });
    } catch (error) {
      console.error('Failed to fetch KYC/Bank status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't show if loading
  if (loading) {
    return null;
  }

  // Don't show if dismissed
  if (dismissed && !forceShow) {
    return null;
  }

  // Don't show if both are completed (unless forced)
  if (!forceShow && status?.kyc_status === 'verified' && status?.has_verified_account) {
    return null;
  }

  const needsKYC = status?.kyc_status !== 'verified';
  const needsBank = !status?.has_verified_account;

  // Don't show if nothing is needed (unless forced)
  if (!forceShow && !needsKYC && !needsBank) {
    return null;
  }

  // FULL MODE - Card with detailed information
  if (mode === 'full') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${className}`}
          style={{ borderColor: COLORS.primary }}
        >
          {/* Header */}
          <div
            className="p-6 flex items-center justify-between"
            style={{ backgroundColor: `${COLORS.primary}20` }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={24} style={{ color: COLORS.primary }} />
              <h3 className="text-xl font-bold" style={{ color: COLORS.text }}>
                {title || 'Complete Your Profile'}
              </h3>
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-white transition-colors"
              >
                <X size={20} style={{ color: COLORS.darkGray }} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              {description || 'To unlock all features and start selling your devices, please complete the following steps:'}
            </p>

            <div className="space-y-4">
              {/* KYC Status */}
              <div
                className="p-4 rounded-lg border-2 flex items-center justify-between"
                style={{
                  borderColor: needsKYC ? COLORS.primary : COLORS.success,
                  backgroundColor: needsKYC ? `${COLORS.primary}10` : `${COLORS.success}10`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: needsKYC ? COLORS.primary : COLORS.success,
                    }}
                  >
                    {needsKYC ? (
                      <ShieldCheck size={24} className="text-white" />
                    ) : (
                      <CheckCircle size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: COLORS.text }}>
                      KYC Verification
                    </h4>
                    <p className="text-sm text-gray-600">
                      {needsKYC
                        ? status?.kyc_status === 'in_review'
                          ? 'Your KYC is under review'
                          : status?.kyc_status === 'rejected'
                          ? 'KYC was rejected - Please resubmit'
                          : 'Verify your identity to proceed'
                        : 'Verified ✓'}
                    </p>
                  </div>
                </div>
                {needsKYC && (
                  <button
                    onClick={onKYCClick}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {status?.kyc_status === 'pending' ? 'Start KYC' : 'View Status'}
                  </button>
                )}
              </div>

              {/* Bank Account Status */}
              <div
                className="p-4 rounded-lg border-2 flex items-center justify-between"
                style={{
                  borderColor: needsBank ? COLORS.primary : COLORS.success,
                  backgroundColor: needsBank ? `${COLORS.primary}10` : `${COLORS.success}10`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: needsBank ? COLORS.primary : COLORS.success,
                    }}
                  >
                    {needsBank ? (
                      <Building2 size={24} className="text-white" />
                    ) : (
                      <CheckCircle size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: COLORS.text }}>
                      Bank Account
                    </h4>
                    <p className="text-sm text-gray-600">
                      {needsBank
                        ? status?.has_bank_account
                          ? 'Bank account pending verification'
                          : 'Add your bank account for payments'
                        : 'Verified ✓'}
                    </p>
                  </div>
                </div>
                {needsBank && (
                  <button
                    onClick={onBankClick}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {status?.has_bank_account ? 'View Accounts' : 'Add Bank'}
                  </button>
                )}
              </div>
            </div>

            {/* Info Note */}
            {(needsKYC || needsBank) && (
              <div
                className="mt-4 p-4 rounded-lg text-sm"
                style={{ backgroundColor: COLORS.lightGray, color: COLORS.darkGray }}
              >
                ℹ️ Both steps are required to receive payments and complete transactions.
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // COMPACT MODE - Smaller card for sidebars
  if (mode === 'compact') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`bg-white rounded-lg shadow-md p-4 ${className}`}
        >
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="float-right p-1 rounded-full hover:bg-gray-100"
            >
              <X size={16} style={{ color: COLORS.darkGray }} />
            </button>
          )}
          
          <h4 className="font-bold mb-3" style={{ color: COLORS.text }}>
            {title || 'Complete Setup'}
          </h4>

          <div className="space-y-2">
            {needsKYC && (
              <button
                onClick={onKYCClick}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <ShieldCheck size={18} style={{ color: COLORS.primary }} />
                <span className="text-sm font-semibold" style={{ color: COLORS.text }}>
                  Complete KYC
                </span>
              </button>
            )}

            {needsBank && (
              <button
                onClick={onBankClick}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <Building2 size={18} style={{ color: COLORS.primary }} />
                <span className="text-sm font-semibold" style={{ color: COLORS.text }}>
                  Add Bank Account
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // BANNER MODE - Top banner notification
  if (mode === 'banner') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`flex items-center justify-between p-4 shadow-md ${className}`}
          style={{ backgroundColor: `${COLORS.primary}20` }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} style={{ color: COLORS.primary }} />
            <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
              {title || 'Complete your profile to unlock all features'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {needsKYC && (
              <button
                onClick={onKYCClick}
                className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
              >
                Complete KYC
              </button>
            )}

            {needsBank && (
              <button
                onClick={onBankClick}
                className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
              >
                Add Bank
              </button>
            )}

            {dismissible && (
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full hover:bg-white transition-colors"
              >
                <X size={18} style={{ color: COLORS.darkGray }} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default KYCBankPrompt;