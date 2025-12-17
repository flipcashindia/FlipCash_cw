// src/pages/consumer/ConsumerWithdrawalHistoryPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, ChevronDown } from 'lucide-react';
import { usePayouts } from './useFinance';
import { PayoutHistoryList, PayoutStatusCard } from './PayoutComponents';
import { 
  Card, 
  // PageHeader, 
  // LoadingSpinner, 
  Button 
} from './index';
import type { Payout, PayoutStatus } from './finance.types';

const ConsumerWithdrawalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: payouts, loading, pagination, filters, setFilters, refetch } = usePayouts();

  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions: Array<{ value: PayoutStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'reversed', label: 'Reversed' },
  ];

  const handleStatusChange = (status: PayoutStatus | 'all') => {
    setStatusFilter(status);
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : status,
    });
  };

  const handlePayoutClick = (payout: Payout) => {
    setSelectedPayout(payout);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/wallet')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1C1C1B]">Withdrawal History</h1>
            <p className="text-sm text-gray-600">{pagination.count} withdrawals</p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 mb-2 md:hidden"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as PayoutStatus | 'all')}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FEC925] focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {payouts.filter(p => p.status === 'success').length}
            </p>
            <p className="text-xs text-gray-500">Successful</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {payouts.filter(p => p.status === 'processing' || p.status === 'pending').length}
            </p>
            <p className="text-xs text-gray-500">Processing</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {payouts.filter(p => p.status === 'failed').length}
            </p>
            <p className="text-xs text-gray-500">Failed</p>
          </Card>
        </div>

        {/* Payout List */}
        <PayoutHistoryList
          payouts={payouts}
          loading={loading}
          onPayoutClick={handlePayoutClick}
        />

        {/* Load More */}
        {pagination.next && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}>
              Load More
            </Button>
          </div>
        )}

        {/* Payout Detail Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full">
              <PayoutStatusCard
                payout={selectedPayout}
                onClose={() => setSelectedPayout(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerWithdrawalHistoryPage;