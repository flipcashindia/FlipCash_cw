// src/components/wallet/WalletCard.tsx

import React from 'react';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Wallet, WalletStatistics } from './finance.types';
import { Card, AmountDisplay, StatusBadge } from './index';

// =============================================================================
// WALLET BALANCE CARD
// =============================================================================
interface WalletBalanceCardProps {
  wallet: Wallet;
  onTopUp?: () => void;
  onWithdraw?: () => void;
  userType: 'consumer' | 'partner' | 'admin';
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  wallet,
  onTopUp,
  onWithdraw,
  userType,
}) => {
  return (
    <Card className="bg-gradient-to-br from-[#FEC925] to-yellow-400 border-none">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-[#1C1C1B]" />
          </div>
          <div>
            <p className="text-[#1C1C1B]/70 text-sm font-medium">
              {userType === 'partner' ? 'Partner Wallet' : 'My Wallet'}
            </p>
            <StatusBadge status={wallet.status} size="sm" />
          </div>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-[#1C1C1B]">
          {wallet.currency}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-[#1C1C1B]/70 text-sm mb-1">Available Balance</p>
        <p className="text-4xl font-bold text-[#1C1C1B]">
          ₹{parseFloat(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex gap-3">
        {/* Partner can top-up */}
        {userType === 'partner' && onTopUp && (
          <button
            onClick={onTopUp}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1C1C1B] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Add Money
          </button>
        )}

        {/* Consumer can withdraw */}
        {userType === 'consumer' && onWithdraw && (
          <button
            onClick={onWithdraw}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1C1C1B] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
        )}
      </div>
    </Card>
  );
};

// =============================================================================
// WALLET STATISTICS CARD
// =============================================================================
interface WalletStatsCardProps {
  statistics: WalletStatistics;
}

export const WalletStatsCard: React.FC<WalletStatsCardProps> = ({ statistics }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#1C1C1B] mb-4">Wallet Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Total Credits */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Total Credits</span>
          </div>
          <AmountDisplay amount={statistics.total_credits} type="credit" size="lg" />
        </div>

        {/* Total Debits */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-600">Total Debits</span>
          </div>
          <AmountDisplay amount={statistics.total_debits} type="debit" size="lg" />
        </div>

        {/* Transaction Count */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
          <p className="text-xl font-semibold text-[#1C1C1B]">
            {statistics.transaction_count}
          </p>
        </div>

        {/* Daily Limit */}
        {statistics.daily_withdrawal_limit && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Daily Withdrawal Limit</p>
            <AmountDisplay amount={statistics.daily_withdrawal_limit} size="lg" />
          </div>
        )}
      </div>

      {statistics.last_transaction_at && (
        <p className="text-xs text-gray-500 mt-4">
          Last transaction: {new Date(statistics.last_transaction_at).toLocaleString()}
        </p>
      )}
    </Card>
  );
};

// =============================================================================
// MINI WALLET BALANCE (For Header/Sidebar)
// =============================================================================
interface MiniWalletBalanceProps {
  balance: string;
  status: string;
  onClick?: () => void;
}

export const MiniWalletBalance: React.FC<MiniWalletBalanceProps> = ({
  balance,
  status,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-[#FEC925] hover:bg-yellow-400 px-3 py-2 rounded-lg transition-colors"
    >
      <WalletIcon className="w-4 h-4 text-[#1C1C1B]" />
      <span className="font-semibold text-[#1C1C1B]">
        ₹{parseFloat(balance).toLocaleString('en-IN')}
      </span>
      {status !== 'active' && (
        <span className="w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
};