// src/components/wallet/TransactionList.tsx

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  ChevronDown,
  ChevronRight,
  // ShoppingBag,
  Wallet,
  // RefreshCw,
  // CreditCard,
  Ban
} from 'lucide-react';
import type { Transaction, TransactionCategory, TransactionType } from './finance.types';
import { Card, StatusBadge, AmountDisplay, EmptyState, LoadingSpinner } from './index';

// =============================================================================
// TRANSACTION ITEM
// =============================================================================
interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const isCredit = transaction.transaction_type === 'credit';

  // const getCategoryIcon = (category: TransactionCategory) => {
  //   const iconClass = 'w-5 h-5';
  //   switch (category) {
  //     case 'payment':
  //       return <CreditCard className={iconClass} />;
  //     case 'device_sale':
  //       return <ShoppingBag className={iconClass} />;
  //     case 'payout':
  //     case 'withdrawal':
  //       return <ArrowUpRight className={iconClass} />;
  //     case 'refund':
  //     case 'reversal':
  //       return <RefreshCw className={iconClass} />;
  //     default:
  //       return <Wallet className={iconClass} />;
  //   }
  // };

  const getCategoryLabel = (category: TransactionCategory) => {
    const labels: Record<TransactionCategory, string> = {
      payment: 'Payment Received',
      device_sale: 'Device Sale',
      payout: 'Payout',
      withdrawal: 'Withdrawal',
      refund: 'Refund',
      fee: 'Fee',
      commission: 'Commission',
      adjustment: 'Adjustment',
      transfer: 'Transfer',
      reversal: 'Reversal',
    };
    return labels[category] || category;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {isCredit ? (
          <ArrowDownLeft className="w-5 h-5" />
        ) : (
          <ArrowUpRight className="w-5 h-5" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-[#1C1C1B] truncate">
            {getCategoryLabel(transaction.category)}
          </p>
          <StatusBadge status={transaction.status} size="sm" />
        </div>
        <p className="text-sm text-gray-500 truncate">
          {transaction.description || transaction.transaction_id}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(transaction.created_at).toLocaleString()}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <AmountDisplay
          amount={transaction.amount}
          type={isCredit ? 'credit' : 'debit'}
          showSign
        />
        <p className="text-xs text-gray-500 mt-1">
          Balance: ₹{parseFloat(transaction.balance_after).toLocaleString('en-IN')}
        </p>
      </div>

      {onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
  );
};

// =============================================================================
// TRANSACTION LIST
// =============================================================================
interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
  emptyMessage?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [], // Default to empty array
  loading = false,
  onLoadMore,
  hasMore = false,
  onTransactionClick,
  emptyMessage = 'No transactions yet',
}) => {
  // Ensure transactions is always an array
  const safeTransactions = transactions || [];
  
  if (loading && safeTransactions.length === 0) {
    return (
      <Card>
        <div className="py-8">
          <LoadingSpinner text="Loading transactions..." />
        </div>
      </Card>
    );
  }

  if (safeTransactions.length === 0) {
    return (
      <Card>
        <EmptyState
          title={emptyMessage}
          description="Your transaction history will appear here"
          icon={<Wallet className="w-8 h-8 text-gray-400" />}
        />
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="divide-y divide-gray-100">
        {safeTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onClick={onTransactionClick ? () => onTransactionClick(transaction) : undefined}
          />
        ))}
      </div>

      {hasMore && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full py-2 text-sm text-[#FEC925] hover:text-yellow-600 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                Load More
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </Card>
  );
};

// =============================================================================
// TRANSACTION FILTERS
// =============================================================================
interface TransactionFiltersProps {
  selectedType: TransactionType | 'all';
  selectedCategory: TransactionCategory | 'all';
  onTypeChange: (type: TransactionType | 'all') => void;
  onCategoryChange: (category: TransactionCategory | 'all') => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const typeOptions: Array<{ value: TransactionType | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'credit', label: 'Credits' },
    { value: 'debit', label: 'Debits' },
  ];

  const categoryOptions: Array<{ value: TransactionCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'payment', label: 'Payments' },
    { value: 'device_sale', label: 'Device Sales' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'commission', label: 'Commissions' },
    { value: 'refund', label: 'Refunds' },
  ];

  return (
    <div className="mb-4">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 text-gray-600 mb-2"
      >
        <Filter className="w-4 h-4" />
        Filters
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Options */}
      <div className={`flex flex-col md:flex-row gap-3 ${isOpen ? 'block' : 'hidden md:flex'}`}>
        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as TransactionType | 'all')}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as TransactionCategory | 'all')}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// =============================================================================
// TRANSACTION DETAIL MODAL
// =============================================================================
interface TransactionDetailProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  const isCredit = transaction.transaction_type === 'credit';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 ${isCredit ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <StatusBadge status={transaction.status} />
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <Ban className="w-5 h-5" />
            </button>
          </div>
          <AmountDisplay
            amount={transaction.amount}
            type={isCredit ? 'credit' : 'debit'}
            size="xl"
            showSign
          />
          <p className="text-sm text-gray-600 mt-2">{transaction.transaction_id}</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-medium capitalize">{transaction.transaction_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Category</span>
            <span className="font-medium capitalize">{transaction.category.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Balance Before</span>
            <span className="font-medium">₹{parseFloat(transaction.balance_before).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Balance After</span>
            <span className="font-medium">₹{parseFloat(transaction.balance_after).toLocaleString('en-IN')}</span>
          </div>
          {transaction.description && (
            <div>
              <span className="text-gray-500 block mb-1">Description</span>
              <p className="text-sm">{transaction.description}</p>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{new Date(transaction.created_at).toLocaleString()}</span>
          </div>
          {transaction.reference_type && (
            <div className="flex justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="font-medium">{transaction.reference_type}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};