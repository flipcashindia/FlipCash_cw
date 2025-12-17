// src/pages/consumer/ConsumerPaymentCallbackPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Home, RefreshCw } from 'lucide-react';
import { paymentApi } from './finance.api';
import type { VerifyPaymentResponse } from './finance.types';
import { Card, LoadingSpinner, Button, AmountDisplay } from './index';

type PageState = 'loading' | 'success' | 'failed' | 'pending' | 'error';

const ConsumerPaymentCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [pageState, setPageState] = useState<PageState>('loading');
  const [paymentData, setPaymentData] = useState<VerifyPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get order_id from URL params (Cashfree redirects with this)
  const orderId = searchParams.get('order_id') || searchParams.get('cf_order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setError('Invalid payment reference');
        setPageState('error');
        return;
      }

      try {
        const result = await paymentApi.verifyPayment(orderId);
        setPaymentData(result);

        switch (result.status) {
          case 'PAID':
            setPageState('success');
            break;
          case 'FAILED':
          case 'CANCELLED':
          case 'USER_DROPPED':
            setPageState('failed');
            break;
          case 'ACTIVE':
            setPageState('pending');
            break;
          default:
            setPageState('pending');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to verify payment');
        setPageState('error');
      }
    };

    verifyPayment();
  }, [orderId]);

  const handleRetry = () => {
    window.location.reload();
  };

  const renderContent = () => {
    switch (pageState) {
      case 'loading':
        return (
          <Card>
            <div className="py-16 text-center">
              <LoadingSpinner size="lg" text="Verifying your payment..." />
              <p className="text-sm text-gray-500 mt-4">
                Please wait while we confirm your payment status.
              </p>
            </div>
          </Card>
        );

      case 'success':
        return (
          <Card className="bg-green-50 border-green-200">
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h1>
              <p className="text-green-700 mb-6">
                Your wallet has been credited successfully.
              </p>
              
              {paymentData && (
                <div className="mb-6">
                  <AmountDisplay amount={paymentData.amount} size="xl" type="credit" />
                </div>
              )}

              <div className="bg-white rounded-lg p-4 mb-6 max-w-sm mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-medium">{paymentData?.order_id}</span>
                  </div>
                  {paymentData?.payment_details?.[0]?.bank_reference && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference</span>
                      <span className="font-medium">{paymentData.payment_details[0].bank_reference}</span>
                    </div>
                  )}
                  {paymentData?.payment_details?.[0]?.payment_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium">
                        {new Date(paymentData.payment_details[0].payment_time).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={() => navigate('/wallet')} size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go to Wallet
              </Button>
            </div>
          </Card>
        );

      case 'failed':
        return (
          <Card className="bg-red-50 border-red-200">
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-red-800 mb-2">Payment Failed</h1>
              <p className="text-red-700 mb-6">
                Your payment could not be processed. Please try again.
              </p>
              
              {paymentData && (
                <div className="bg-white rounded-lg p-4 mb-6 max-w-sm mx-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium">{paymentData.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium">₹{parseFloat(paymentData.amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-red-600">{paymentData.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/wallet')}>
                  Go to Wallet
                </Button>
                <Button onClick={() => navigate('/wallet/add-money')}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'pending':
        return (
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-yellow-800 mb-2">Payment Pending</h1>
              <p className="text-yellow-700 mb-6">
                Your payment is being processed. This may take a few moments.
              </p>
              
              {paymentData && (
                <div className="bg-white rounded-lg p-4 mb-6 max-w-sm mx-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium">{paymentData.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium">₹{parseFloat(paymentData.amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/wallet')}>
                  Go to Wallet
                </Button>
                <Button onClick={handleRetry}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Again
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'error':
        return (
          <Card className="bg-gray-50">
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
              <p className="text-gray-600 mb-6">
                {error || 'We could not verify your payment status.'}
              </p>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/wallet')}>
                  Go to Wallet
                </Button>
                <Button onClick={handleRetry}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default ConsumerPaymentCallbackPage;