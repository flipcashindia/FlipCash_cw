// useKYCBankStatus.ts
// Custom React hook to check KYC and Bank account status
// Can be used anywhere in the app to get real-time status

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface KYCBankStatus {
  // KYC Status
  kyc_status: 'pending' | 'verified' | 'rejected' | 'in_review';
  kyc_verified_at: string | null;
  
  // Bank Account Status
  has_bank_account: boolean;
  total_accounts: number;
  has_verified_account: boolean;
  has_primary_account: boolean;
  
  // Computed flags
  is_kyc_complete: boolean;
  is_bank_complete: boolean;
  is_profile_complete: boolean;
  
  // Loading state
  loading: boolean;
  error: string | null;
}

interface UseKYCBankStatusReturn extends KYCBankStatus {
  refresh: () => Promise<void>;
  checkKYC: () => boolean;
  checkBank: () => boolean;
  checkBoth: () => boolean;
}

const useKYCBankStatus = (): UseKYCBankStatusReturn => {
  const [status, setStatus] = useState<KYCBankStatus>({
    kyc_status: 'pending',
    kyc_verified_at: null,
    has_bank_account: false,
    total_accounts: 0,
    has_verified_account: false,
    has_primary_account: false,
    is_kyc_complete: false,
    is_bank_complete: false,
    is_profile_complete: false,
    loading: true,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));

      // Fetch user profile for KYC status
      const userResponse = await axios.get('/api/accounts/me/');
      const userData = userResponse.data;

      // Fetch bank account status
      const bankResponse = await axios.get('/api/accounts/bank-accounts/check-added/');
      const bankData = bankResponse.data;

      const kycStatus = userData.kyc_status || 'pending';
      const isKYCComplete = kycStatus === 'verified';
      const isBankComplete = bankData.has_verified_account;

      setStatus({
        kyc_status: kycStatus,
        kyc_verified_at: userData.kyc_verified_at || null,
        has_bank_account: bankData.has_bank_account,
        total_accounts: bankData.total_accounts,
        has_verified_account: bankData.has_verified_account,
        has_primary_account: bankData.has_primary_account,
        is_kyc_complete: isKYCComplete,
        is_bank_complete: isBankComplete,
        is_profile_complete: isKYCComplete && isBankComplete,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch KYC/Bank status:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch status',
      }));
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Helper function to check if KYC is complete
  const checkKYC = useCallback((): boolean => {
    return status.is_kyc_complete;
  }, [status.is_kyc_complete]);

  // Helper function to check if Bank is complete
  const checkBank = useCallback((): boolean => {
    return status.is_bank_complete;
  }, [status.is_bank_complete]);

  // Helper function to check if both are complete
  const checkBoth = useCallback((): boolean => {
    return status.is_profile_complete;
  }, [status.is_profile_complete]);

  return {
    ...status,
    refresh: fetchStatus,
    checkKYC,
    checkBank,
    checkBoth,
  };
};

export default useKYCBankStatus;