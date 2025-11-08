import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Building, CreditCard, Plus, Trash2, CheckCircle, 
  AlertCircle, Star, Shield, Edit2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/services/authService';
import type { PayoutBeneficiary } from '../../api/types/auth.types';
import type { MenuTab } from './MyAccountPage';

interface BankAccountsPageProps {
  onNavClick: (tab: MenuTab) => void;
  onLogout: () => void;
}

const BankAccountsPage: React.FC<BankAccountsPageProps> = ({ onNavClick }) => {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<PayoutBeneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [accountType, setAccountType] = useState<'bank' | 'upi'>('bank');
  const [formData, setFormData] = useState({
    beneficiary_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
    upi_id: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const data = await authService.getBeneficiaries();
      setBeneficiaries(data);
    } catch (err: any) {
      console.error('Failed to fetch beneficiaries:', err);
      setError('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await authService.createBeneficiary({
        account_type: accountType,
        beneficiary_name: formData.beneficiary_name,
        account_number: accountType === 'bank' ? formData.account_number : undefined,
        ifsc_code: accountType === 'bank' ? formData.ifsc_code : undefined,
        bank_name: accountType === 'bank' ? formData.bank_name : undefined,
        branch_name: accountType === 'bank' ? formData.branch_name : undefined,
        upi_id: accountType === 'upi' ? formData.upi_id : undefined,
      });

      setSuccess('Bank account added successfully!');
      setShowAddForm(false);
      setFormData({
        beneficiary_name: '',
        account_number: '',
        ifsc_code: '',
        bank_name: '',
        branch_name: '',
        upi_id: '',
      });
      await fetchBeneficiaries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to add bank account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) return;

    try {
      await authService.deleteBeneficiary(id);
      setSuccess('Bank account deleted successfully');
      await fetchBeneficiaries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete bank account');
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await authService.setPrimaryBeneficiary(id);
      setSuccess('Primary bank account updated');
      await fetchBeneficiaries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to set primary account');
    }
  };

  const maskAccount = (number: string) => {
    if (!number || number.length <= 4) return '****';
    return `****${number.slice(-4)}`;
  };

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

          {/* Success/Error Messages */}
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

          {/* Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={20} />
              Add New Bank Account
            </button>
          )}

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1C1C1B]">Add New Account</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
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
                      <button
                        type="button"
                        onClick={() => setAccountType('bank')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          accountType === 'bank'
                            ? 'border-[#1B8A05] bg-[#1B8A05]/10'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Building size={24} className="mx-auto mb-2" />
                        <p className="font-bold">Bank Account</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('upi')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          accountType === 'upi'
                            ? 'border-[#FEC925] bg-[#FEC925]/10'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard size={24} className="mx-auto mb-2" />
                        <p className="font-bold">UPI</p>
                      </button>
                    </div>
                  </div>

                  {/* Beneficiary Name */}
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.beneficiary_name}
                      onChange={(e) => setFormData({ ...formData, beneficiary_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  {accountType === 'bank' ? (
                    <>
                      {/* Account Number */}
                      <div>
                        <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.account_number}
                          onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                          placeholder="Enter account number"
                          required
                        />
                      </div>

                      {/* IFSC Code */}
                      <div>
                        <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.ifsc_code}
                          onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                          placeholder="SBIN0001234"
                          maxLength={11}
                          required
                        />
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
                          Branch Name
                        </label>
                        <input
                          type="text"
                          value={formData.branch_name}
                          onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                          placeholder="Patna Main Branch"
                        />
                      </div>
                    </>
                  ) : (
                    /* UPI ID */
                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1B] mb-2">
                        UPI ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.upi_id}
                        onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                        placeholder="yourname@paytm"
                        required
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bank Accounts List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FEC925] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading bank accounts...</p>
              </div>
            ) : beneficiaries.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Building size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold">No bank accounts added yet</p>
                <p className="text-sm text-gray-500 mt-2">Add a bank account to receive withdrawals</p>
              </div>
            ) : (
              beneficiaries.map((beneficiary) => (
                <motion.div
                  key={beneficiary.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br ${
                    beneficiary.is_primary
                      ? 'from-[#FEC925]/10 to-[#1B8A05]/10 border-[#FEC925]'
                      : 'from-gray-50 to-white border-gray-200'
                  } border-2 rounded-xl p-6 relative`}
                >
                  {/* Primary Badge */}
                  {beneficiary.is_primary && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#FEC925] text-[#1C1C1B] px-3 py-1 rounded-full text-xs font-bold">
                      <Star size={14} fill="currentColor" />
                      PRIMARY
                    </div>
                  )}

                  {/* Verified Badge */}
                  {beneficiary.is_verified && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      <Shield size={14} />
                      VERIFIED
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-xl ${
                      beneficiary.account_type === 'bank'
                        ? 'bg-[#1B8A05]/20'
                        : 'bg-[#FEC925]/20'
                    }`}>
                      {beneficiary.account_type === 'bank' ? (
                        <Building size={32} className="text-[#1B8A05]" />
                      ) : (
                        <CreditCard size={32} className="text-[#FEC925]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#1C1C1B]">
                        {beneficiary.beneficiary_name}
                      </h3>
                      
                      {beneficiary.account_type === 'bank' ? (
                        <>
                          <p className="text-sm text-gray-600 mt-1">
                            {beneficiary.bank_name}
                            {beneficiary.branch_name && ` - ${beneficiary.branch_name}`}
                          </p>
                          <p className="text-sm font-mono text-gray-700 mt-2">
                            {maskAccount(beneficiary.account_number)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            IFSC: {beneficiary.ifsc_code}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-700 mt-1">
                          {beneficiary.upi_id}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Added on {new Date(beneficiary.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t-2 border-gray-200">
                    {!beneficiary.is_primary && beneficiary.is_verified && (
                      <button
                        onClick={() => handleSetPrimary(beneficiary.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FEC925] text-[#1C1C1B] font-bold rounded-lg hover:bg-[#FEC925]/80 transition-all"
                      >
                        <Star size={16} />
                        Set as Primary
                      </button>
                    )}
                    
                    {!beneficiary.is_verified && (
                      <button
                        onClick={() => handleDelete(beneficiary.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BankAccountsPage;