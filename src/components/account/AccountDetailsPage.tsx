/**
 * Account Details Page - User profile management
 * ✅ CORRECTED: Field names, FlipCash theme, better UX
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Save, Shield, Calendar, CheckCircle, Building, CreditCard, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/services/authService';
import type { MenuTab } from './MyAccountPage';

interface AccountDetailsPageProps {
  username?: string;
  onNavClick: (tab: MenuTab) => void;
  onLogout: () => void;
}

const AccountDetailsPage: React.FC<AccountDetailsPageProps> = ({ onNavClick }) => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await authService.updateMe({ name: name.trim(), email: email.trim() || null });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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
            <div className="p-4 bg-gradient-to-r from-[#FEC925]/20 to-[#1B8A05]/20 rounded-xl">
              <User size={32} className="text-[#1B8A05]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1B]">Account Details</h1>
              <p className="text-gray-600">Manage your profile information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <User size={18} className="text-[#FEC925]" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all text-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone Field (Disabled) */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <Phone size={18} className="text-[#1B8A05]" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={user?.phone || ''}
                  disabled
                  className="w-full px-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-xl cursor-not-allowed text-lg"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Shield size={20} className="text-[#1B8A05]" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">
                <Shield size={12} className="inline mr-1" />
                Phone number is verified and cannot be changed
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                <Mail size={18} className="text-[#FEC925]" />
                Email Address <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all text-lg"
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Get order updates and offers via email
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border-2 border-green-200"
              >
                <CheckCircle size={24} />
                <span className="font-semibold">Profile updated successfully!</span>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border-2 border-red-200"
              >
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold text-lg rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1C1C1B] border-t-transparent"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </form>

          {/* KYC Status Section */}
          <div className="mt-8 pt-8 border-t-2 border-[#FEC925]/20">
            <h3 className="font-bold text-xl text-[#1C1C1B] mb-4">KYC Verification</h3>
            
            {user?.kyc_status === 'verified' ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle size={40} className="text-green-600" />
                  <div>
                    <p className="font-bold text-green-800 text-lg">KYC Verified</p>
                    <p className="text-sm text-green-600">Your account is fully verified</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-[#FEC925] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Shield size={32} className="text-[#FEC925]" />
                  <div>
                    <p className="font-bold text-[#1C1C1B] text-lg">
                      {user?.kyc_status === 'submitted' ? 'KYC Under Review' : 
                      user?.kyc_status === 'rejected' ? 'KYC Rejected' : 'Complete Your KYC'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user?.kyc_status === 'submitted' ? 'Your documents are being reviewed' : 
                      user?.kyc_status === 'rejected' ? 'Please resubmit your documents' : 
                      'Verify your identity to unlock all features'}
                    </p>
                  </div>
                </div>
                
                {user?.kyc_status !== 'submitted' && (
                  <button
                    onClick={() => onNavClick('KYC')}
                    className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-xl transition-all"
                  >
                    <Shield size={20} />
                    Complete KYC Verification
                  </button>
                )}
              </div>
            )}
          </div>


          {/* Account Information */}
<div className="mt-10 pt-8 border-t-2 border-[#FEC925]/20">
  <h3 className="font-bold text-xl text-[#1C1C1B] mb-6">Account Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4] p-5 rounded-xl border-2 border-[#1B8A05]/20">
      <p className="text-sm text-gray-600 mb-1">Account Status</p>
      <p className="text-2xl font-bold text-[#1B8A05]">
        {user?.is_active ? '✓ Active' : '✗ Inactive'}
      </p>
    </div>
    
    <div className="bg-gradient-to-br from-[#EEEFFF] to-[#FFEFF6] p-5 rounded-xl border-2 border-[#FEC925]/20">
      <p className="text-sm text-gray-600 mb-1">Profile Status</p>
      <p className="text-2xl font-bold text-[#FEC925]">
        {user?.profile_completed ? '✓ Complete' : '⚠ Incomplete'}
      </p>
    </div>
    
    <div className="bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4] p-5 rounded-xl border-2 border-[#1B8A05]/20">
      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
        <Calendar size={14} />
        Member Since
      </p>
      <p className="text-lg font-bold text-[#1C1C1B]">
        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) : 'N/A'}
      </p>
    </div>
    
    <div className="bg-gradient-to-br from-[#EEEFFF] to-[#FFEFF6] p-5 rounded-xl border-2 border-[#FEC925]/20">
      <p className="text-sm text-gray-600 mb-1">Account Type</p>
      <p className="text-lg font-bold text-[#1C1C1B] capitalize">
        {user?.role === 'consumer' ? 'Customer' : user?.role || 'Customer'}
      </p>
    </div>
  </div>
</div>

{/* Bank Account Section */}
<div className="mt-8 pt-8 border-t-2 border-[#FEC925]/20">
  <h3 className="font-bold text-xl text-[#1C1C1B] mb-4 flex items-center gap-2">
    <Building size={24} className="text-[#1B8A05]" />
    Bank Account for Withdrawals
  </h3>
  
  <div className="bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4] border-2 border-[#1B8A05]/20 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <CreditCard size={32} className="text-[#1B8A05]" />
        <div>
          <p className="font-bold text-[#1C1C1B] text-lg">Payment Details</p>
          <p className="text-sm text-gray-600">Manage your bank accounts for withdrawals</p>
        </div>
      </div>
    </div>
    
    <button
      onClick={() => onNavClick('Bank')}
      className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1B8A05] to-[#FEC925] text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Plus size={20} />
      Manage Bank Accounts
    </button>
  </div>
</div>
          
          

        </motion.div>
      </div>
    </section>
  );
};

export default AccountDetailsPage;