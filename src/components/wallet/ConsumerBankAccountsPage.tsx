// src/pages/consumer/ConsumerBankAccountsPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Shield,
  Star,
  // Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useBankAccounts } from './useFinance';
import { 
  Card, 
  // PageHeader, 
  LoadingSpinner, 
  ErrorMessage, 
  Button,
  StatusBadge
} from './index';
import type { BankAccount } from './finance.types';

type ModalState = 'closed' | 'add' | 'verify' | 'delete';

const ConsumerBankAccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: bankAccounts, loading, error, verifyBankAccount, setPrimaryBankAccount, refetch } = useBankAccounts();

  const [modalState, setModalState] = useState<ModalState>('closed');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);

  const handleVerify = async (account: BankAccount) => {
    // console.log('');
    // console.log('═══════════════════════════════════════');
    // console.log('🟢 MANUAL VERIFICATION TRIGGERED');
    // console.log('═══════════════════════════════════════');
    // console.log('🔵 Account ID:', account.id);
    // console.log('📝 Bank:', account.bank_name);
    // console.log('📝 IFSC:', account.ifsc_code);
    // console.log('📝 Holder:', account.account_holder_name);
    // console.log('📝 Masked Account:', account.masked_account_number);
    // console.log('⏰ Time:', new Date().toISOString());
    // console.log('───────────────────────────────────────');
    
    setVerifying(true);
    setVerifyError(null);
    
    try {
      console.log('🌐 Calling verifyBankAccount API...');
      const startTime = Date.now();
      
      const result = await verifyBankAccount(account.id);
      
      const duration = Date.now() - startTime;
      console.log('');
      console.log('✅ VERIFICATION SUCCESS');
      console.log('⏱️ Duration:', duration, 'ms');
      console.log('📊 Result:', JSON.stringify(result, null, 2));
      console.log('═══════════════════════════════════════');
      console.log('');
      
      setModalState('closed');
      setSelectedAccount(null);
      setVerifyError(null);
      refetch();
      
    } catch (err: any) {
      // console.log('');
      // console.log('❌ VERIFICATION FAILED');
      // console.log('📊 Error:', err);
      // console.log('📊 Message:', err.message);
      // console.log('📊 Response:', err.response?.data);
      // console.log('═══════════════════════════════════════');
      // console.log('');
      
      setVerifyError(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleSetPrimary = async (account: BankAccount) => {
    // console.log('🔵 Setting primary account:', account.id);
    
    setSettingPrimary(account.id);
    
    try {
      await setPrimaryBankAccount(account.id);
      // console.log('✅ Primary account set successfully');
      refetch();
    } catch (err: any) {
      // console.error('❌ Failed to set primary:', err);
      alert(err.message || 'Failed to set as primary');
    } finally {
      setSettingPrimary(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading bank accounts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  const verifiedAccounts = bankAccounts.filter(a => a.is_verified);
  const unverifiedAccounts = bankAccounts.filter(a => !a.is_verified);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/wallet')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1C1C1B]">Bank Accounts</h1>
            <p className="text-sm text-gray-600">{bankAccounts.length} accounts</p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setModalState('add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* DEBUG PANEL - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-4 bg-gray-100 border-2 border-blue-300">
            <details>
              <summary className="cursor-pointer font-semibold text-blue-800">
                🔍 Debug Info (Dev Only)
              </summary>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Accounts:</span>
                  <span className="font-mono font-semibold">{bankAccounts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verified:</span>
                  <span className="font-mono font-semibold text-green-600">{verifiedAccounts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unverified:</span>
                  <span className="font-mono font-semibold text-yellow-600">{unverifiedAccounts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Primary Account:</span>
                  <span className="font-mono font-semibold">
                    {bankAccounts.find(a => a.is_primary)?.bank_name || 'None'}
                  </span>
                </div>
              </div>
              <pre className="text-xs mt-3 p-3 bg-white rounded overflow-auto max-h-64 border">
                {JSON.stringify(bankAccounts.map(a => ({
                  id: a.id.slice(0, 8) + '...',
                  bank: a.bank_name,
                  masked: a.masked_account_number,
                  ifsc: a.ifsc_code,
                  holder: a.account_holder_name,
                  status: a.verification_status,
                  verified: a.is_verified,
                  primary: a.is_primary,
                  can_withdraw: a.can_be_used_for_withdrawal,
                })), null, 2)}
              </pre>
            </details>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Bank Account Verification</p>
              <p className="text-sm text-blue-700 mt-1">
                You need at least one verified bank account to withdraw money. 
                Verification is instant and secure via Cashfree penny-drop method.
              </p>
            </div>
          </div>
        </Card>

        {/* Verified Accounts */}
        {verifiedAccounts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1C1C1B] mb-3">
              Verified Accounts ({verifiedAccounts.length})
            </h2>
            <div className="space-y-3">
              {verifiedAccounts.map((account) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  onVerify={() => {
                    console.log('🔘 User clicked Verify button on card');
                    setSelectedAccount(account);
                    setModalState('verify');
                  }}
                  onSetPrimary={() => handleSetPrimary(account)}
                  onDelete={() => {
                    setSelectedAccount(account);
                    setModalState('delete');
                  }}
                  isSettingPrimary={settingPrimary === account.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Unverified Accounts */}
        {unverifiedAccounts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#1C1C1B] mb-3">
              Unverified Accounts ({unverifiedAccounts.length})
            </h2>
            <div className="space-y-3">
              {unverifiedAccounts.map((account) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  onVerify={() => {
                    console.log('🔘 User clicked Verify button on card');
                    setSelectedAccount(account);
                    setModalState('verify');
                  }}
                  onSetPrimary={() => handleSetPrimary(account)}
                  onDelete={() => {
                    setSelectedAccount(account);
                    setModalState('delete');
                  }}
                  isSettingPrimary={settingPrimary === account.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bankAccounts.length === 0 && (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Bank Accounts Added
            </h3>
            <p className="text-gray-500 mb-6">
              Add a bank account to start withdrawing your earnings
            </p>
            <Button onClick={() => setModalState('add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Account
            </Button>
          </Card>
        )}

        {/* Add Bank Account Modal */}
        {modalState === 'add' && (
          <AddBankAccountModal
            onClose={() => setModalState('closed')}
            onSuccess={() => {
              setModalState('closed');
              refetch();
            }}
          />
        )}

        {/* Verify Bank Account Modal */}
        {modalState === 'verify' && selectedAccount && (
          <VerifyBankAccountModal
            account={selectedAccount}
            onClose={() => {
              console.log('🔘 User closed verification modal');
              setModalState('closed');
              setSelectedAccount(null);
              setVerifyError(null);
            }}
            onVerify={handleVerify}
            loading={verifying}
            error={verifyError}
          />
        )}
      </div>
    </div>
  );
};

// =============================================================================
// BANK ACCOUNT CARD COMPONENT
// =============================================================================
interface BankAccountCardProps {
  account: BankAccount;
  onVerify: () => void;
  onSetPrimary: () => void;
  onDelete: () => void;
  isSettingPrimary?: boolean;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({ 
  account, 
  onVerify, 
  onSetPrimary, 
  onDelete,
  isSettingPrimary = false
}) => {
    
  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Card className={`${
      account.is_verified 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          account.is_verified 
            ? 'bg-green-100' 
            : 'bg-gray-100'
        }`}>
          {getVerificationIcon(account.verification_status)}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900">{account.bank_name}</p>
            {account.is_primary && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FEC925] rounded-full">
                <Star className="w-3 h-3 text-[#1C1C1B] fill-current" />
                <span className="text-xs font-medium text-[#1C1C1B]">Primary</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">{account.account_holder_name}</p>
          <p className="text-sm font-mono text-gray-500">{account.masked_account_number}</p>
          <p className="text-xs text-gray-400 mt-1">{account.ifsc_code}</p>

          {/* Status Badge */}
          <div className="mt-2">
            <StatusBadge 
              status={account.verification_status} 
              size="sm"
            />
          </div>

          {/* Verification Failed Message */}
          {account.verification_status === 'failed' && (
            <p className="text-xs text-red-600 mt-2">
              Verification failed. Please verify again or contact support.
            </p>
          )}

          {/* Name from Bank (if verified) */}
          {account.is_verified && account.verified_at && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Verified on {new Date(account.verified_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {account.is_verified && !account.is_primary && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onSetPrimary}
              loading={isSettingPrimary}
              disabled={isSettingPrimary}
            >
              <Star className="w-3 h-3 mr-1" />
              Set Primary
            </Button>
          )}
          {!account.is_verified && (
            <Button size="sm" onClick={onVerify}>
              <Shield className="w-3 h-3 mr-1" />
              Verify
            </Button>
          )}
          {account.verification_status === 'pending' && (
            <Button size="sm" variant="outline" disabled>
              <Clock className="w-3 h-3 mr-1 animate-pulse" />
              Verifying...
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
  if (!account) {console.log(onDelete)}
};

// =============================================================================
// ADD BANK ACCOUNT MODAL
// =============================================================================
interface AddBankAccountModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc_code: '',
    bank_name: '',
    account_type: 'savings' as 'savings' | 'current',
    branch_name: '',
  });
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔵 Submitting new bank account:', {
      bank: formData.bank_name,
      ifsc: formData.ifsc_code,
      holder: formData.account_holder_name,
    });
    
    // Validation
    if (formData.account_number !== formData.confirm_account_number) {
      setError('Account numbers do not match');
      console.error('❌ Validation failed: Account numbers do not match');
      return;
    }

    if (formData.account_number.length < 9 || formData.account_number.length > 18) {
      setError('Account number must be between 9 and 18 digits');
      console.error('❌ Validation failed: Invalid account number length');
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
      setError('Invalid IFSC code format (e.g., HDFC0001234)');
      console.error('❌ Validation failed: Invalid IFSC format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/accounts/bank-accounts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          account_holder_name: formData.account_holder_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          bank_name: formData.bank_name,
          account_type: formData.account_type,
          branch_name: formData.branch_name,
        }),
      });

      const responseData = await response.json();
      console.log('📊 API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.detail || 'Failed to add bank account');
      }

      console.log('✅ Bank account added successfully');
      onSuccess();
    } catch (err: any) {
      console.error('❌ Failed to add bank account:', err);
      setError(err.message || 'Failed to add bank account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-[#FEC925]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1C1C1B]">Add Bank Account</h2>
            <button onClick={onClose} className="text-[#1C1C1B] hover:text-gray-700 text-2xl leading-none">
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name *
            </label>
            <input
              type="text"
              value={formData.account_holder_name}
              onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
              placeholder="As per bank records"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
              required
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              placeholder="e.g., HDFC Bank, SBI, ICICI"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
              required
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number *
            </label>
            <div className="relative">
              <input
                type={showAccountNumber ? 'text' : 'password'}
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/\D/g, '') })}
                placeholder="Enter account number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Account Number *
            </label>
            <input
              type={showAccountNumber ? 'text' : 'password'}
              value={formData.confirm_account_number}
              onChange={(e) => setFormData({ ...formData, confirm_account_number: e.target.value.replace(/\D/g, '') })}
              placeholder="Re-enter account number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
              required
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code *
            </label>
            <input
              type="text"
              value={formData.ifsc_code}
              onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
              placeholder="e.g., HDFC0001234"
              maxLength={11}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent font-mono"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Format: 4 letters, 0, then 6 characters</p>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type *
            </label>
            <select
              value={formData.account_type}
              onChange={(e) => setFormData({ ...formData, account_type: e.target.value as 'savings' | 'current' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
              required
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Name (Optional)
            </label>
            <input
              type="text"
              value={formData.branch_name}
              onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
              placeholder="e.g., Connaught Place, Delhi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              {loading ? 'Adding...' : 'Add Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =============================================================================
// VERIFY BANK ACCOUNT MODAL - MANUAL TRIGGER ONLY
// =============================================================================
interface VerifyBankAccountModalProps {
  account: BankAccount;
  onClose: () => void;
  onVerify: (account: BankAccount) => void;
  loading: boolean;
  error: string | null;
}

const VerifyBankAccountModal: React.FC<VerifyBankAccountModalProps> = ({
  account,
  onClose,
  onVerify,
  loading,
  error,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleVerifyClick = () => {
    // console.log('');
    // console.log('🟢 USER CLICKED "VERIFY NOW" BUTTON');
    // console.log('🟢 Account ID:', account.id);
    // console.log('🟢 Calling onVerify function...');
    // console.log('');
    
    // Explicitly call the verify function
    onVerify(account);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              disabled={loading}
            >
              ✕
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verify Bank Account</h2>
          <p className="text-sm text-gray-600 mt-1">Instant penny-drop verification via Cashfree</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank</span>
                <span className="font-medium">{account.bank_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Holder</span>
                <span className="font-medium">{account.account_holder_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number</span>
                <span className="font-mono font-medium">{account.masked_account_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IFSC Code</span>
                <span className="font-mono font-medium">{account.ifsc_code}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">How it works:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• We'll deposit ₹1 to verify your account</li>
                  <li>• Bank validates your details instantly</li>
                  <li>• ₹1 is reversed automatically</li>
                  <li>• Takes 5-10 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  console.log('✅ Confirmation checkbox:', e.target.checked ? 'CHECKED' : 'UNCHECKED');
                }}
                disabled={loading}
                className="mt-1 w-4 h-4 text-[#FEC925] border-gray-300 rounded focus:ring-2 focus:ring-[#FEC925]"
              />
              <span className="text-sm text-gray-700">
                I confirm the account details are correct and authorize penny-drop verification
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Verification Failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Verifying your account...</p>
                  <p className="text-sm text-yellow-700">This usually takes 5-10 seconds</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              fullWidth 
              onClick={handleVerifyClick}
              disabled={!confirmed || loading}
              loading={loading}
            >
              <Shield className="w-4 h-4 mr-2" />
              {loading ? 'Verifying...' : 'Verify Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerBankAccountsPage;