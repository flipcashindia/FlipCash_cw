import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Building, Plus, Trash2, CheckCircle,
  AlertCircle, Star, Shield, Clock
} from 'lucide-react';
import {
  bankAccountAPI,
  validateIFSC,
  validateAccountNumber,
  cleanAccountNumber,
  formatIFSC,
  formatAPIError,
  ACCOUNT_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  type BankAccount,
  type BankAccountCreateRequest,
  // type AccountType,
  type VerificationStatus,
} from '../../api/services/BankAccountApi';
import type { MenuTab } from './MyAccountPage';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface BankAccountsPageProps {
  onNavClick: (tab: MenuTab | 'account') => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BankAccountsPage: React.FC<BankAccountsPageProps> = ({ onNavClick }) => {
  // State Management
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState<BankAccountCreateRequest>({
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
    account_type: 'savings',
  });

  // Load accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  /**
   * Fetch all bank accounts
   */
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bankAccountAPI.getAll();
      setAccounts(data);
    } catch (err: any) {
      console.error('Failed to fetch bank accounts:', err);
      setError(formatAPIError(err) || ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Client-side validation
      const cleanedAccountNumber = cleanAccountNumber(formData.account_number);
      const formattedIFSC = formatIFSC(formData.ifsc_code);

      // Validate IFSC code
      if (!validateIFSC(formattedIFSC)) {
        throw new Error(ERROR_MESSAGES.INVALID_IFSC);
      }

      // Validate account number
      if (!validateAccountNumber(cleanedAccountNumber)) {
        throw new Error(ERROR_MESSAGES.INVALID_ACCOUNT_NUMBER);
      }

      // Create account
      await bankAccountAPI.create({
        ...formData,
        account_number: cleanedAccountNumber,
        ifsc_code: formattedIFSC,
      });

      // Success
      setSuccess(SUCCESS_MESSAGES.ACCOUNT_ADDED);
      setShowAddForm(false);
      resetForm();
      await fetchAccounts();

      // Auto-hide success message
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Failed to create bank account:', err);
      setError(formatAPIError(err) || ERROR_MESSAGES.CREATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle delete account
   */
  const handleDelete = async (id: string, accountName: string) => {
    if (!window.confirm(`Are you sure you want to delete the account: ${accountName}?`)) {
      return;
    }

    try {
      setError('');
      await bankAccountAPI.delete(id);
      setSuccess(SUCCESS_MESSAGES.ACCOUNT_DELETED);
      await fetchAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to delete bank account:', err);
      setError(formatAPIError(err) || ERROR_MESSAGES.DELETE_FAILED);
    }
  };

  /**
   * Handle set primary account
   */
  const handleSetPrimary = async (id: string) => {
    try {
      setError('');
      await bankAccountAPI.setPrimary(id);
      setSuccess(SUCCESS_MESSAGES.PRIMARY_SET);
      await fetchAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to set primary account:', err);
      setError(formatAPIError(err) || ERROR_MESSAGES.SET_PRIMARY_FAILED);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      account_holder_name: '',
      account_number: '',
      ifsc_code: '',
      bank_name: '',
      branch_name: '',
      account_type: 'savings',
    });
  };

  // ============================================================================
  // UI HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get verification status badge
   */
  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            <Shield size={12} />
            VERIFIED
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            <Clock size={12} />
            PENDING
          </div>
        );
      case 'failed':
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle size={12} />
            {status.toUpperCase()}
          </div>
        );
      default:
        return null;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#FEC925]/20"
        >
          {/* ========== HEADER ========== */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#FEC925]/20">
            <button
              onClick={() => onNavClick('account')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="p-4 bg-gradient-to-r from-[#1B8A05]/20 to-[#FEC925]/20 rounded-xl">
              <Building size={32} className="text-[#1B8A05]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1B]">Bank Accounts</h1>
              <p className="text-gray-600">Manage your withdrawal accounts</p>
            </div>
          </div>

          {/* ========== ALERT MESSAGES ========== */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border-2 border-green-200"
              >
                <CheckCircle size={24} />
                <span className="font-semibold">{success}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200"
              >
                <AlertCircle size={24} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========== ADD BUTTON ========== */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={20} />
              Add New Bank Account
            </button>
          )}

          {/* ========== ADD FORM ========== */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1C1C1B]">Add New Bank Account</h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-3">
                      Account Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {ACCOUNT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, account_type: type.value })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.account_type === type.value
                              ? type.value === 'savings'
                                ? 'border-[#1B8A05] bg-[#1B8A05]/10 font-bold'
                                : 'border-[#FEC925] bg-[#FEC925]/10 font-bold'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Building size={24} className="mx-auto mb-2" />
                          <p className="font-semibold">{type.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Holder Name */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.account_holder_name}
                      onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                      placeholder="Enter account holder name as per bank records"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter name exactly as per your bank account</p>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.account_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, account_number: value });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all font-mono"
                      placeholder="Enter 9-18 digit account number"
                      maxLength={18}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">9-18 digits for Indian bank accounts</p>
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ifsc_code}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        setFormData({ ...formData, ifsc_code: value });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all font-mono uppercase"
                      placeholder="SBIN0001234"
                      maxLength={11}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      11 characters: 4 letters, 1 zero, 6 alphanumeric (e.g., HDFC0001234)
                    </p>
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                      placeholder="State Bank of India"
                      required
                    />
                  </div>

                  {/* Branch Name */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                      Branch Name <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.branch_name}
                      onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                      placeholder="Patna Main Branch"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">Verification Process</p>
                        <p>Your bank account will be verified within 24-48 hours. You can use it for withdrawals once verified.</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
                      className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1C1C1B] border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Add Account
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========== ACCOUNTS LIST ========== */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FEC925] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading bank accounts...</p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Building size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold">No bank accounts added yet</p>
                <p className="text-sm text-gray-500 mt-2">Add a bank account to receive withdrawals</p>
              </div>
            ) : (
              accounts.map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br ${
                    account.is_primary
                      ? 'from-[#FEC925]/10 to-[#1B8A05]/10 border-[#FEC925]'
                      : 'from-gray-50 to-white border-gray-200'
                  } border-2 rounded-xl p-6 relative`}
                >
                  {/* Badges Container */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    {account.is_primary && (
                      <div className="flex items-center gap-1.5 bg-[#FEC925] text-[#1C1C1B] px-3 py-1 rounded-full text-xs font-bold">
                        <Star size={12} fill="currentColor" />
                        PRIMARY
                      </div>
                    )}
                    {getVerificationBadge(account.verification_status)}
                  </div>

                  <div className="flex items-start gap-4 pr-32">
                    <div className="p-4 rounded-xl bg-[#1B8A05]/20">
                      <Building size={32} className="text-[#1B8A05]" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#1C1C1B]">
                        {account.account_holder_name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {account.bank_name}
                        {account.branch_name && ` - ${account.branch_name}`}
                      </p>
                      
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-mono text-gray-700 flex items-center gap-2">
                          <span className="text-xs text-gray-500">Account:</span>
                          <span className="font-bold">{account.masked_account_number}</span>
                        </p>
                        <p className="text-sm font-mono text-gray-700 flex items-center gap-2">
                          <span className="text-xs text-gray-500">IFSC:</span>
                          <span className="font-bold">{account.ifsc_code}</span>
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {account.account_type} Account
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 mt-3">
                        Added on {new Date(account.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>

                      {account.verified_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Verified on {new Date(account.verified_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t-2 border-gray-200">
                    {!account.is_primary && account.is_verified && (
                      <button
                        onClick={() => handleSetPrimary(account.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FEC925] text-[#1C1C1B] font-bold rounded-lg hover:bg-[#FEC925]/80 transition-all"
                      >
                        <Star size={16} />
                        Set as Primary
                      </button>
                    )}
                    
                    {!account.is_primary && (
                      <button
                        onClick={() => handleDelete(account.id, account.account_holder_name)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}

                    {account.verification_status === 'pending' && (
                      <div className="flex-1 text-center text-sm text-gray-500 py-2">
                        Verification in progress...
                      </div>
                    )}

                    {account.verification_status === 'failed' && (
                      <div className="flex-1 text-center text-sm text-red-600 py-2 font-semibold">
                        Verification failed - Please contact support
                      </div>
                    )}

                    {account.can_be_used_for_withdrawal && (
                      <div className="flex-1 text-center text-sm text-green-600 py-2 font-semibold">
                        ✓ Ready for withdrawals
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* ========== INFO FOOTER ========== */}
          {accounts.length > 0 && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-1">Need Help?</p>
                  <p>If you face any issues with verification or have questions about your bank account, please contact our support team.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BankAccountsPage;