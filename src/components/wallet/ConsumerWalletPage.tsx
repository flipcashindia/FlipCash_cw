// src/pages/consumer/ConsumerWalletPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowUpRight, History, ChevronRight } from 'lucide-react';
import { useWallet, useTransactions } from './useFinance';
import { WalletBalanceCard, WalletStatsCard } from '../../components/wallet/WalletCard';
import { 
  TransactionList, 
  TransactionFilters, 
  TransactionDetailModal 
} from '../../components/wallet/TransactionList';
import { 
  Card, 
  PageHeader, 
  LoadingSpinner, 
  ErrorMessage, 
  Button, 
  COLORS
} from './index';
import type { Transaction, TransactionType, TransactionCategory } from './finance.types';

const ConsumerWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: walletData, loading: walletLoading, error: walletError, refetch: refetchWallet } = useWallet();
  const { 
    data: transactions, 
    loading: txLoading, 
    pagination, 
    updateFilters, 
    loadMore 
  } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');

  const handleWithdraw = () => {
    navigate('/wallet/withdraw');
  };

  const handleTypeChange = (type: TransactionType | 'all') => {
    setTypeFilter(type);
    updateFilters({
      transaction_type: type === 'all' ? undefined : type,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
    });
  };

  const handleCategoryChange = (category: TransactionCategory | 'all') => {
    setCategoryFilter(category);
    updateFilters({
      transaction_type: typeFilter === 'all' ? undefined : typeFilter,
      category: category === 'all' ? undefined : category,
    });
  };

  if (walletLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading wallet..." />
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <ErrorMessage message={walletError} onRetry={refetchWallet} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <PageHeader
          title="My Wallet"
          subtitle="Manage your earnings and withdrawals"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={refetchWallet}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          }
        />

        {/* Wallet Balance Card */}
        {walletData && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <WalletBalanceCard
              wallet={walletData.wallet}
              userType="consumer"
              onWithdraw={handleWithdraw}
            />
            {/* <WalletStatsCard statistics={walletData.statistics} /> */}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleWithdraw}
            className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#FEC925] hover:bg-yellow-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-[#1C1C1B]">Withdraw</p>
              <p className="text-xs text-gray-500">To bank account</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/wallet/history')}
            className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#FEC925] hover:bg-yellow-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-[#1C1C1B]">History</p>
              <p className="text-xs text-gray-500">View all transactions</p>
            </div>
          </button>
        </div>

        {/* Quick Actions */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 mb-3"
            >
              <h3 className="font-bold text-xl mb-4" style={{ color: COLORS.text }}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  // onClick={() => onNavClick('Passbook' as any)}
                  onClick={() => navigate('/my-account/passbook')}
                  className="flex items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-all"
                  style={{ borderColor: COLORS.lightGray }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.lightGray;
                  }}
                >
                  <span className="font-semibold" style={{ color: COLORS.text }}>
                    View Passbook
                  </span>
                  <ChevronRight size={20} />
                </button>

                <button
                  // onClick={navigateToBankPage}
                  onClick={() => navigate('/bank-accounts')}
                  className="flex items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-all"
                  style={{ borderColor: COLORS.lightGray }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.lightGray;
                  }}
                >
                  <span className="font-semibold" style={{ color: COLORS.text }}>
                    Manage Banks
                  </span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1C1C1B]">Recent Transactions</h2>
            <button
              onClick={() => navigate('/wallet/history')}
              className="text-sm text-[#FEC925] hover:text-yellow-600 font-medium"
            >
              View All
            </button>
          </div>

          <TransactionFilters
            selectedType={typeFilter}
            selectedCategory={categoryFilter}
            onTypeChange={handleTypeChange}
            onCategoryChange={handleCategoryChange}
          />

          <TransactionList
            transactions={transactions.slice(0, 10)}
            loading={txLoading}
            onTransactionClick={setSelectedTransaction}
            hasMore={pagination.next !== null && transactions.length < 10}
            onLoadMore={loadMore}
          />
        </Card>

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={selectedTransaction !== null}
          onClose={() => setSelectedTransaction(null)}
        />
      </div>
    </div>
  );
};

export default ConsumerWalletPage;