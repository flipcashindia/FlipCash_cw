/**
 * Authentication Modal - Slide-in drawer from right with Profile Completion
 * ✅ CORRECTED: request_id, name verification, profile completion, right-side drawer
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, KeyRound, Smartphone, Shield, Zap, User, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { sendOTP, verifyOTP, refreshUser } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [_requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    

    try {
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.startsWith('91') 
          ? `+${formattedPhone}` 
          : `+91${formattedPhone}`;
      }

      const response = await sendOTP(formattedPhone);
      setRequestId(response.request_id);
      setPhone(formattedPhone);
      setStep('otp');
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('device_id', deviceId);
      }

      await verifyOTP(phone, otp, deviceId);
      
      const user = authService.getStoredUser();
      
      if (!user?.name || user.name.trim() === '') {
        setStep('profile');
        setProfileData({
          name: '',
          email: user?.email || '',
        });
      } else {
        handleSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.updateMe({
        name: profileData.name.trim(),
        email: profileData.email.trim() || null,
      });
      
      await refreshUser();
      handleSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    resetForm();
    onClose();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await sendOTP(phone);
      setRequestId(response.request_id);
      setOtp('');
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setRequestId('');
    setError('');
    setResendCooldown(0);
    setProfileData({ name: '', email: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-br from-[#F0F7F6] via-white to-[#EAF6F4] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-[#FEC925] px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1B]">
                  {step === 'phone' && 'Welcome Back!'}
                  {step === 'otp' && 'Verify OTP'}
                  {step === 'profile' && 'Complete Your Profile'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {step === 'phone' && 'Login or Sign up to continue'}
                  {step === 'otp' && `Code sent to ${phone}`}
                  {step === 'profile' && 'Help us know you better'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-[#1C1C1B]" />
              </button>
            </div>

            <div className="p-6">
              {step === 'phone' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-3 mb-8"
                >
                  <div className="bg-white p-4 rounded-xl border-2 border-[#FEC925]/30 text-center">
                    <Zap className="mx-auto text-[#FEC925] mb-2" size={28} />
                    <p className="text-xs font-semibold text-[#1C1C1B]">Instant Quotes</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-[#1B8A05]/30 text-center">
                    <Shield className="mx-auto text-[#1B8A05] mb-2" size={28} />
                    <p className="text-xs font-semibold text-[#1C1C1B]">100% Safe</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-[#FEC925]/30 text-center">
                    <Smartphone className="mx-auto text-[#FEC925] mb-2" size={28} />
                    <p className="text-xs font-semibold text-[#1C1C1B]">Easy Pickup</p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 'phone' && (
                  <motion.form
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSendOTP}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                        <Phone size={18} className="text-[#FEC925]" />
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phone.replace('+91', '').replace('+', '')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setPhone(value);
                          }}
                          placeholder="9876543210"
                          className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] text-lg font-semibold transition-all"
                          required
                          maxLength={10}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 ml-1">
                        We'll send you a verification code
                      </p>
                    </div>

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

                    <button
                      type="submit"
                      disabled={loading || phone.length < 10}
                      className="w-full py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1C1C1B] border-t-transparent"></div>
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Phone size={20} />
                          Send OTP
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      By continuing, you agree to our{' '}
                      <a href="/terms" className="text-[#1B8A05] font-semibold hover:underline">
                        Terms & Conditions
                      </a>
                    </p>
                  </motion.form>
                )}

                {step === 'otp' && (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleVerifyOTP}
                    className="space-y-6"
                  >
                    <div className="bg-white p-8 rounded-2xl border-2 border-[#FEC925]/50 shadow-lg">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-r from-[#FEC925]/20 to-[#1B8A05]/20 rounded-full">
                          <KeyRound size={40} className="text-[#FEC925]" />
                        </div>
                      </div>
                      
                      <label className="block text-sm font-bold text-[#1C1C1B] mb-4 text-center">
                        Enter 6-Digit OTP
                      </label>
                      
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setOtp(value);
                        }}
                        placeholder="••••••"
                        className="w-full px-4 py-5 text-center text-3xl tracking-[0.5em] font-bold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] transition-all"
                        required
                        maxLength={6}
                        autoFocus
                      />
                    </div>

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

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1C1C1B] border-t-transparent"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield size={20} />
                          Verify & Continue
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('phone');
                          setOtp('');
                          setError('');
                        }}
                        className="text-sm text-gray-600 hover:text-[#1C1C1B] font-semibold transition-colors"
                      >
                        ← Change Number
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading || resendCooldown > 0}
                        className={`text-sm font-bold transition-colors ${
                          resendCooldown > 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-[#1B8A05] hover:text-[#1B8A05]/80'
                        }`}
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : 'Resend OTP'}
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-[#EEEFFF] to-[#FFEFF6] p-4 rounded-xl">
                      <p className="text-xs text-center text-gray-600">
                        <Shield size={14} className="inline mr-1 text-[#1B8A05]" />
                        Your phone number is safe with us. We use it only for verification.
                      </p>
                    </div>
                  </motion.form>
                )}

                {step === 'profile' && (
                  <motion.form
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleProfileComplete}
                    className="space-y-6"
                  >
                    <div className="bg-white p-8 rounded-2xl border-2 border-[#1B8A05]/50 shadow-lg text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-r from-[#1B8A05]/20 to-[#FEC925]/20 rounded-full">
                          <CheckCircle size={48} className="text-[#1B8A05]" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1C1C1B] mb-2">
                        Phone Verified! 🎉
                      </h3>
                      <p className="text-sm text-gray-600">
                        Complete your profile to continue
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                        <User size={18} className="text-[#FEC925]" />
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FEC925]/30 focus:border-[#FEC925] text-lg transition-all"
                        required
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-2 ml-1">
                        This will be used for all communications
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1B] mb-3 flex items-center gap-2">
                        <Mail size={18} className="text-[#1B8A05]" />
                        Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#1B8A05]/30 focus:border-[#1B8A05] text-lg transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2 ml-1">
                        Get order updates and offers via email
                      </p>
                    </div>

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

                    <button
                      type="submit"
                      disabled={loading || !profileData.name.trim()}
                      className="w-full py-4 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1C1C1B] border-t-transparent"></div>
                          Saving Profile...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Complete & Continue
                        </>
                      )}
                    </button>

                    <div className="bg-gradient-to-r from-[#EEEFFF] to-[#FFEFF6] p-4 rounded-xl">
                      <p className="text-xs text-center text-gray-600">
                        <Shield size={14} className="inline mr-1 text-[#1B8A05]" />
                        Your information is secure and will never be shared with third parties.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-white/50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Need help?{' '}
                  <a href="mailto:support@flipcash.in" className="text-[#1B8A05] font-semibold hover:underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;