// src/pages/consumer/ConsumerWithdrawPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Plus, Shield } from 'lucide-react';
import { useWallet, usePayouts, useBankAccounts } from './useFinance';
import { WithdrawalForm, PayoutStatusCard } from './PayoutComponents';
import { 
  Card, 
  // PageHeader, 
  LoadingSpinner, 
  ErrorMessage, 
  Button 
} from './index';
import type { Payout } from './finance.types';

type PageState = 'form' | 'processing' | 'success' | 'error';

const ConsumerWithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: walletData, loading: walletLoading, error: walletError, refetch: refetchWallet } = useWallet();
  const { data: bankAccounts, loading: bankLoading } = useBankAccounts();
  const { estimatePayout, createPayout } = usePayouts();

  const [pageState, setPageState] = useState<PageState>('form');
  const [createdPayout, setCreatedPayout] = useState<Payout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (bankAccountId: string, amount: string, remarks?: string) => {
    setLoading(true);
    setError(null);
    setPageState('processing');

    try {
      const payout = await createPayout(bankAccountId, amount, remarks);
      setCreatedPayout(payout);
      setPageState('success');
      refetchWallet(); // Refresh wallet balance
    } catch (err: any) {
      setError(err.message || 'Failed to process withdrawal');
      setPageState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (pageState === 'form') {
      navigate('/wallet');
    } else {
      setPageState('form');
      setCreatedPayout(null);
      setError(null);
    }
  };

  const handleDone = () => {
    navigate('/wallet');
  };

  if (walletLoading || bankLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <ErrorMessage message={walletError} onRetry={refetchWallet} />
        </div>
      </div>
    );
  }

  // Check if user has any verified bank accounts
  const verifiedAccounts = bankAccounts?.filter(a => a.is_verified) || [];
  const hasVerifiedAccount = verifiedAccounts.length > 0;
  const hasAnyAccount = bankAccounts && bankAccounts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleGoBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1C1C1B]">Withdraw Money</h1>
            <p className="text-sm text-gray-600">Transfer to your bank account</p>
          </div>
        </div>

        {/* NO VERIFIED ACCOUNT - SHOW PROMINENT CTA */}
        {!hasVerifiedAccount && pageState === 'form' && (
          <div className="space-y-4">
            {/* Current Balance Card */}
            {walletData && (
              <Card className="bg-gradient-to-br from-[#FEC925] to-yellow-400 border-none">
                <div className="text-center">
                  <p className="text-sm text-[#1C1C1B]/70 mb-1">Available Balance</p>
                  <p className="text-4xl font-bold text-[#1C1C1B]">
                    ₹{parseFloat(walletData.wallet.available_balance).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-[#1C1C1B]/60 mt-2">
                    Ready to withdraw
                  </p>
                </div>
              </Card>
            )}

            {/* No Bank Account - Big CTA */}
            <Card className="bg-white border-2 border-yellow-400">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1C1B] mb-2">
                  {!hasAnyAccount ? 'Add a Bank Account' : 'Verify Your Bank Account'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {!hasAnyAccount 
                    ? 'You need to add and verify a bank account before you can withdraw money to your account.'
                    : `You have ${bankAccounts.length} bank account(s) but none are verified yet. Verify your account to start withdrawing.`
                  }
                </p>
                
                <Button 
                  size="lg" 
                  onClick={() => navigate('/bank-accounts')}
                  className="mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {!hasAnyAccount ? 'Add Bank Account' : 'Manage Bank Accounts'}
                </Button>

                <p className="text-sm text-gray-500 mt-4">
                  ⚡ Verification takes less than 30 seconds
                </p>
              </div>
            </Card>

            {/* Steps Card */}
            <Card className="bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Quick Setup Steps
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Add your bank details</p>
                    <p className="text-xs text-blue-700">Account number, IFSC code, holder name</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Instant verification</p>
                    <p className="text-xs text-blue-700">We'll verify your account in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Start withdrawing</p>
                    <p className="text-xs text-blue-700">Get your money in 24 hours</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Note */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">100% Secure & Encrypted</span>
              </div>
            </div>
          </div>
        )}

        {/* HAS VERIFIED ACCOUNT - SHOW FORM */}
        {hasVerifiedAccount && pageState === 'form' && walletData && (
          <WithdrawalForm
            bankAccounts={bankAccounts || []}
            availableBalance={walletData.wallet.available_balance}
            onSubmit={handleSubmit}
            onEstimate={estimatePayout}
            loading={loading}
          />
        )}

        {/* Processing State */}
        {pageState === 'processing' && (
          <Card>
            <div className="py-12 text-center">
              <LoadingSpinner size="lg" text="Processing your withdrawal..." />
              <p className="text-sm text-gray-500 mt-4">
                Please wait while we process your request.
              </p>
            </div>
          </Card>
        )}

        {/* Success State */}
        {pageState === 'success' && createdPayout && (
          <div className="space-y-4">
            <PayoutStatusCard payout={createdPayout} />
            
            <Card className="bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800 font-medium">
                    Withdrawal Request Submitted
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your money will be transferred to your bank account within 24 hours.
                    You can track the status in your withdrawal history.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setPageState('form')}>
                Withdraw More
              </Button>
              <Button fullWidth onClick={handleDone}>
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {pageState === 'error' && (
          <div className="space-y-4">
            <Card className="bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    Withdrawal Failed
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {error || 'Something went wrong. Please try again.'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={handleGoBack}>
                Go Back
              </Button>
              <Button fullWidth onClick={() => setPageState('form')}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerWithdrawPage;