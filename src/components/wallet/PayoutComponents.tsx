// src/components/payout/PayoutComponents.tsx

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import type { Payout, BankAccount, PayoutEstimateResponse } from './finance.types';
import { Card, StatusBadge, AmountDisplay, EmptyState, LoadingSpinner, Button } from './index';

// =============================================================================
// WITHDRAWAL FORM
// =============================================================================
interface WithdrawalFormProps {
  bankAccounts: BankAccount[];
  availableBalance: string;
  onSubmit: (bankAccountId: string, amount: string, remarks?: string) => void;
  onEstimate: (amount: string) => Promise<PayoutEstimateResponse>;
  loading?: boolean;
}

export const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  bankAccounts,
  availableBalance,
  onSubmit,
  onEstimate,
  loading = false,
}) => {
  const [selectedBankId, setSelectedBankId] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [estimate, setEstimate] = useState<PayoutEstimateResponse | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);

  const verifiedAccounts = bankAccounts.filter(acc => acc.is_verified && acc.is_active);
  const balance = parseFloat(availableBalance);

  // Auto-select primary or first verified account
  useEffect(() => {
    if (verifiedAccounts.length > 0 && !selectedBankId) {
      const primary = verifiedAccounts.find(acc => acc.is_primary);
      setSelectedBankId(primary?.id || verifiedAccounts[0].id);
    }
  }, [verifiedAccounts, selectedBankId]);

  // Calculate estimate when amount changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount >= 1) {
        setEstimateLoading(true);
        try {
          const result = await onEstimate(amount);
          setEstimate(result);
        } catch (err) {
          console.error('Estimate error:', err);
        }
        setEstimateLoading(false);
      } else {
        setEstimate(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, onEstimate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedBankId) {
      setError('Please select a bank account');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      setError('Minimum withdrawal amount is ₹1');
      return;
    }
    if (numAmount > balance) {
      setError(`Insufficient balance. Available: ₹${balance.toLocaleString('en-IN')}`);
      return;
    }
    if (numAmount > 100000) {
      setError('Maximum withdrawal amount is ₹1,00,000');
      return;
    }

    onSubmit(selectedBankId, amount, remarks);
  };

  const handleWithdrawAll = () => {
    setAmount(balance.toString());
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#1C1C1B] mb-4">Withdraw Money</h3>

      <form onSubmit={handleSubmit}>
        {/* Available Balance */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
          <div className="flex items-center justify-between">
            <AmountDisplay amount={availableBalance} size="lg" />
            <button
              type="button"
              onClick={handleWithdrawAll}
              className="text-sm text-[#FEC925] hover:text-yellow-600 font-medium"
            >
              Withdraw All
            </button>
          </div>
        </div>

        {/* Bank Account Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Bank Account
          </label>
          {verifiedAccounts.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">No verified bank account</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please add and verify a bank account to withdraw money.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {verifiedAccounts.map((account) => (
                <label
                  key={account.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedBankId === account.id
                      ? 'border-[#FEC925] bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bankAccount"
                    value={account.id}
                    checked={selectedBankId === account.id}
                    onChange={(e) => setSelectedBankId(e.target.value)}
                    className="sr-only"
                  />
                  <Building2 className="w-8 h-8 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium text-[#1C1C1B]">{account.bank_name}</p>
                    <p className="text-sm text-gray-500">
                      {account.masked_account_number} • {account.account_holder_name}
                    </p>
                  </div>
                  {account.is_primary && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                  {selectedBankId === account.id && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Withdraw
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-gray-500">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
              min="1"
              max={Math.min(balance, 100000)}
              step="0.01"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Estimate */}
        {estimate && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Withdrawal Amount</span>
              <span className="font-medium">₹{parseFloat(estimate.amount).toLocaleString('en-IN')}</span>
            </div>
            {parseFloat(estimate.fee) > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="text-red-600">-₹{parseFloat(estimate.fee).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="text-red-600">-₹{parseFloat(estimate.gst).toLocaleString('en-IN')}</span>
                </div>
              </>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">You'll Receive</span>
              <span className="font-semibold text-green-600">
                ₹{parseFloat(estimate.net_amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
        {estimateLoading && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center">
            <LoadingSpinner size="sm" text="Calculating..." />
          </div>
        )}

        {/* Remarks */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks (Optional)
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g., Device sale withdrawal"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
            maxLength={500}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          disabled={verifiedAccounts.length === 0}
        >
          Withdraw ₹{amount || '0'}
        </Button>
      </form>
    </Card>
  );
};

// =============================================================================
// PAYOUT STATUS CARD
// =============================================================================
interface PayoutStatusCardProps {
  payout: Payout;
  onClose?: () => void;
}

export const PayoutStatusCard: React.FC<PayoutStatusCardProps> = ({ payout, onClose }) => {
  const [copied, setCopied] = useState(false);

  const getStatusConfig = () => {
    switch (payout.status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Withdrawal Successful',
          description: 'Money has been transferred to your bank account',
          bgColor: 'bg-green-50',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Withdrawal Failed',
          description: payout.failure_reason || 'Something went wrong. Amount has been refunded.',
          bgColor: 'bg-red-50',
        };
      case 'processing':
        return {
          icon: <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />,
          title: 'Processing',
          description: 'Your withdrawal is being processed',
          bgColor: 'bg-blue-50',
        };
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: 'Pending',
          description: 'Your withdrawal request is pending',
          bgColor: 'bg-yellow-50',
        };
      default:
        return {
          icon: <Clock className="w-16 h-16 text-gray-500" />,
          title: payout.status,
          description: 'Withdrawal status',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const config = getStatusConfig();

  const copyUTR = () => {
    if (payout.utr_number) {
      navigator.clipboard.writeText(payout.utr_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={config.bgColor}>
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">{config.icon}</div>
        <h2 className="text-xl font-bold text-[#1C1C1B] mb-2">{config.title}</h2>
        <p className="text-gray-600 mb-4">{config.description}</p>
        
        <AmountDisplay amount={payout.net_amount} size="xl" />
        
        <div className="mt-6 space-y-3 text-left max-w-sm mx-auto">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Bank</span>
            <span className="font-medium">{payout.bank_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account</span>
            <span className="font-medium">{payout.masked_account_number}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payout ID</span>
            <span className="font-medium text-xs">{payout.payout_id}</span>
          </div>
          {payout.utr_number && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">UTR Number</span>
              <button
                onClick={copyUTR}
                className="flex items-center gap-1 font-medium text-[#FEC925] hover:text-yellow-600"
              >
                {payout.utr_number}
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {onClose && (
          <div className="mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// =============================================================================
// PAYOUT HISTORY ITEM
// =============================================================================
interface PayoutHistoryItemProps {
  payout: Payout;
  onClick?: () => void;
}

export const PayoutHistoryItem: React.FC<PayoutHistoryItemProps> = ({ payout, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
        <ArrowUpRight className="w-5 h-5" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-[#1C1C1B] truncate">Withdrawal</p>
          <StatusBadge status={payout.status} size="sm" />
        </div>
        <p className="text-sm text-gray-500 truncate">
          {payout.bank_name} • {payout.masked_account_number}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(payout.initiated_at).toLocaleString()}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <AmountDisplay amount={payout.amount} type="debit" showSign />
        {payout.utr_number && (
          <p className="text-xs text-gray-500 mt-1">
            UTR: {payout.utr_number.slice(-8)}
          </p>
        )}
      </div>

      {onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
  );
};

// =============================================================================
// PAYOUT HISTORY LIST
// =============================================================================
interface PayoutHistoryListProps {
  payouts: Payout[];
  loading?: boolean;
  onPayoutClick?: (payout: Payout) => void;
}

export const PayoutHistoryList: React.FC<PayoutHistoryListProps> = ({
  payouts = [], // Default to empty array
  loading = false,
  onPayoutClick,
}) => {
  // Ensure payouts is always an array
  const safePayouts = payouts || [];
  
  if (loading && safePayouts.length === 0) {
    return (
      <Card>
        <div className="py-8">
          <LoadingSpinner text="Loading withdrawals..." />
        </div>
      </Card>
    );
  }

  if (safePayouts.length === 0) {
    return (
      <Card>
        <EmptyState
          title="No withdrawals yet"
          description="Your withdrawal history will appear here"
          icon={<ArrowUpRight className="w-8 h-8 text-gray-400" />}
        />
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="divide-y divide-gray-100">
        {safePayouts.map((payout) => (
          <PayoutHistoryItem
            key={payout.id}
            payout={payout}
            onClick={onPayoutClick ? () => onPayoutClick(payout) : undefined}
          />
        ))}
      </div>
    </Card>
  );
};