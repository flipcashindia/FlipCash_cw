import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Building2, 
  Plus, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as financeService from '../../api/services/financeService';
import axios from 'axios';
import KYCBankPrompt from './KYCBankPrompt';
import useKYCBankStatus from '../../api/services/useKYCBankStatus';
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

interface BankAccount {
  id: string;
  account_holder_name: string;
  masked_account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: 'savings' | 'current';
  verification_status: 'pending' | 'verified' | 'failed' | 'rejected';
  is_verified: boolean;
  verified_at: string | null;
  is_primary: boolean;
  is_active: boolean;
  can_be_used_for_withdrawal: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
}

interface MyWalletPageProps {
  onNavClick: (tab: MenuTab | 'Passbook') => void;
}

const MyWalletPage: React.FC<MyWalletPageProps> = ({ onNavClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { is_profile_complete } = useKYCBankStatus();
  
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [primaryAccount, setPrimaryAccount] = useState<BankAccount | null>(null);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Load wallet balance
      const walletData = await financeService.getWalletBalance();
      setBalance(walletData.balance);
      
      // Load bank accounts
      await loadBankAccounts();
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      setErrorMessage('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const loadBankAccounts = async () => {
    try {
      // Load all bank accounts
      const accountsResponse = await axios.get('/api/accounts/bank-accounts/');
      setBankAccounts(accountsResponse.data.data || []);
      
      // Load primary account
      try {
        const primaryResponse = await axios.get('/api/accounts/bank-accounts/primary/');
        setPrimaryAccount(primaryResponse.data.data);
      } catch (err) {
        setPrimaryAccount(null);
      }
    } catch (error) {
      console.error('Failed to load bank accounts:', error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!is_profile_complete) {
      setErrorMessage('Please complete KYC and add a bank account first');
      return;
    }

    if (!primaryAccount) {
      setErrorMessage('Please set a primary bank account for withdrawals');
      return;
    }

    setWithdrawing(true);
    setErrorMessage('');
    
    try {
      await financeService.createPayout({
        amount: withdrawAmount,
        payout_method: 'bank_transfer',
        bank_account_id: primaryAccount.id,
      });
      
      setSuccessMessage('Withdrawal request submitted successfully!');
      setWithdrawAmount('');
      setShowWithdrawForm(false);
      
      // Reload wallet balance
      await loadWalletData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    try {
      await axios.post('/api/accounts/bank-accounts/set-primary/', {
        bank_account_id: accountId
      });
      
      setSuccessMessage('Primary account updated successfully!');
      await loadBankAccounts();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to set primary account');
    }
  };

  const navigateToBankPage = () => {
    if (navigate) {
      navigate('/my-account/bank', { state: { returnTo: location.pathname } });
    } else {
      onNavClick('Bank' as any);
    }
  };

  const navigateToKYCPage = () => {
    if (navigate) {
      navigate('/my-account/kyc', { state: { returnTo: location.pathname } });
    } else {
      onNavClick('KYC' as any);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        bg: `${COLORS.primary}20`,
        color: COLORS.primary,
        label: '⏳ Pending',
        icon: Clock,
      },
      verified: {
        bg: `${COLORS.success}20`,
        color: COLORS.success,
        label: '✓ Verified',
        icon: CheckCircle,
      },
      failed: {
        bg: `${COLORS.error}20`,
        color: COLORS.error,
        label: '✗ Failed',
        icon: AlertCircle,
      },
      rejected: {
        bg: `${COLORS.error}20`,
        color: COLORS.error,
        label: '✗ Rejected',
        icon: AlertCircle,
      },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <div
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: badge.bg,
          color: badge.color,
        }}
      >
        <Icon size={14} />
        {badge.label}
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavClick('Dashboard' as any)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft size={24} style={{ color: COLORS.text }} />
          </button>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: COLORS.text }}>
              My Wallet
            </h1>
            <p className="text-gray-600">Manage your balance and withdrawals</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3 border-2"
              style={{
                backgroundColor: `${COLORS.success}20`,
                borderColor: `${COLORS.success}40`,
                color: COLORS.success,
              }}
            >
              <CheckCircle size={24} />
              <span className="font-semibold">{successMessage}</span>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3 border-2"
              style={{
                backgroundColor: `${COLORS.error}20`,
                borderColor: `${COLORS.error}40`,
                color: COLORS.error,
              }}
            >
              <AlertCircle size={24} />
              <div className="flex-1">
                <span className="font-semibold">{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage('')}
                className="text-sm underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KYC/Bank Prompt */}
        {!is_profile_complete && (
          <div className="mb-6">
            <KYCBankPrompt
              mode="full"
              onKYCClick={navigateToKYCPage}
              onBankClick={navigateToBankPage}
              title="Complete Profile to Withdraw Funds"
              description="Verify your identity and add a bank account to withdraw money from your wallet."
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Balance & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${COLORS.success}, ${COLORS.primary})`,
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet size={32} />
                  <span className="text-xl font-semibold">Available Balance</span>
                </div>
                <div className="text-5xl font-bold mb-6">
                  {loading ? '...' : `₹${parseFloat(balance).toLocaleString('en-IN')}`}
                </div>
                
                <button
                  onClick={() => navigate('/wallet/withdraw')}
                  // disabled={!is_profile_complete || loading}
                  className="px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'white',
                    color: COLORS.text,
                  }}
                >
                  Withdraw Money
                </button>
              </div>
            </motion.div>

            {/* Withdraw Form Modal */}
            <AnimatePresence>
              {showWithdrawForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowWithdrawForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                        Withdraw Money
                      </h2>
                      <button
                        onClick={() => setShowWithdrawForm(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <AlertCircle size={24} />
                      </button>
                    </div>

                    {primaryAccount ? (
                      <>
                        {/* Primary Account Info */}
                        <div
                          className="mb-6 p-4 rounded-lg"
                          style={{ backgroundColor: COLORS.lightGray }}
                        >
                          <p className="text-sm text-gray-600 mb-2">Withdrawing to:</p>
                          <p className="font-bold" style={{ color: COLORS.text }}>
                            {primaryAccount.bank_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {primaryAccount.masked_account_number}
                          </p>
                        </div>

                        {/* Withdraw Form */}
                        <form onSubmit={handleWithdraw} className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                              Amount (₹)
                            </label>
                            <input
                              type="number"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none"
                              style={{ borderColor: COLORS.mediumGray }}
                              onFocus={(e) => {
                                e.target.style.borderColor = COLORS.primary;
                                e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}30`;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = COLORS.mediumGray;
                                e.target.style.boxShadow = 'none';
                              }}
                              placeholder="Enter amount"
                              min="100"
                              max={balance}
                              required
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              Minimum: ₹100 | Available: ₹{parseFloat(balance).toLocaleString('en-IN')}
                            </p>
                          </div>

                          <button
                            type="submit"
                            disabled={withdrawing}
                            className="w-full py-3 font-bold rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                            style={{
                              backgroundColor: COLORS.primary,
                              color: COLORS.text,
                            }}
                          >
                            {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Building2 size={48} className="mx-auto mb-4" style={{ color: COLORS.primary }} />
                        <p className="text-gray-600 mb-4">
                          You need to add a bank account first
                        </p>
                        <button
                          onClick={navigateToBankPage}
                          className="px-6 py-3 font-bold rounded-xl"
                          style={{
                            backgroundColor: COLORS.primary,
                            color: COLORS.text,
                          }}
                        >
                          Add Bank Account
                        </button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-bold text-xl mb-4" style={{ color: COLORS.text }}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onNavClick('Passbook' as any)}
                  className="flex items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-all"
                  style={{ borderColor: COLORS.mediumGray }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.mediumGray;
                  }}
                >
                  <span className="font-semibold" style={{ color: COLORS.text }}>
                    View Passbook
                  </span>
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={navigateToBankPage}
                  className="flex items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-all"
                  style={{ borderColor: COLORS.mediumGray }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.mediumGray;
                  }}
                >
                  <span className="font-semibold" style={{ color: COLORS.text }}>
                    Manage Banks
                  </span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Bank Accounts */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl" style={{ color: COLORS.text }}>
                  Bank Accounts
                </h3>
                <button
                  onClick={navigateToBankPage}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <Plus size={20} style={{ color: COLORS.primary }} />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto"
                    style={{ borderColor: COLORS.primary }}
                  ></div>
                  <p className="text-gray-600 mt-2">Loading accounts...</p>
                </div>
              ) : bankAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No bank accounts added</p>
                  <button
                    onClick={navigateToBankPage}
                    className="px-6 py-2 font-semibold rounded-lg"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.text,
                    }}
                  >
                    Add Bank Account
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border-2 rounded-xl relative transition-all hover:shadow-md"
                      style={{
                        borderColor: account.is_primary ? COLORS.primary : COLORS.mediumGray,
                        backgroundColor: account.is_primary ? `${COLORS.primary}10` : 'white',
                      }}
                    >
                      {/* Primary Badge */}
                      {account.is_primary && (
                        <div
                          className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: COLORS.primary,
                            color: COLORS.text,
                          }}
                        >
                          PRIMARY
                        </div>
                      )}

                      {/* Bank Name */}
                      <h4 className="font-bold mb-1" style={{ color: COLORS.text }}>
                        {account.bank_name}
                      </h4>

                      {/* Account Number */}
                      <p className="text-sm text-gray-600 mb-2 font-mono">
                        {account.masked_account_number}
                      </p>

                      {/* Status Badge */}
                      <div className="mb-3">
                        {getStatusBadge(account.verification_status)}
                      </div>

                      {/* Set Primary Button */}
                      {!account.is_primary && account.is_verified && (
                        <button
                          onClick={() => handleSetPrimary(account.id)}
                          className="w-full py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-90"
                          style={{
                            backgroundColor: `${COLORS.success}20`,
                            color: COLORS.success,
                          }}
                        >
                          Set as Primary
                        </button>
                      )}

                      {/* Pending Verification Message */}
                      {!account.is_verified && (
                        <p className="text-xs text-gray-600 mt-2">
                          ⏳ Verification pending
                        </p>
                      )}
                    </motion.div>
                  ))}

                  {/* View All Button */}
                  {bankAccounts.length > 0 && (
                    <button
                      onClick={navigateToBankPage}
                      className="w-full py-3 border-2 rounded-xl font-semibold transition-all hover:shadow-md"
                      style={{
                        borderColor: COLORS.primary,
                        color: COLORS.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${COLORS.primary}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      View All Accounts
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.darkGray,
              }}
            >
              <p className="font-semibold mb-2" style={{ color: COLORS.text }}>
                ℹ️ Important Information
              </p>
              <ul className="space-y-1 text-xs">
                <li>• Withdrawals are processed within 24-48 hours</li>
                <li>• Minimum withdrawal amount: ₹100</li>
                <li>• Only verified bank accounts can receive funds</li>
                <li>• Set a primary account for faster withdrawals</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyWalletPage;