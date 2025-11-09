import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import * as financeService from '../../api/services/financeService';
import type { Transaction } from '../../api/types/finance.types';
// import type { MenuTab } from './MyAccountPage';

interface PassbookPageProps {
  // ✅ CORRECTION: Removed unused props
  // username: string;
  // onNavClick: (tab: MenuTab) => void;
  // onBreadcrumbClick: (path: string) => void;
  // onLogout: () => void;
}

// ✅ CORRECTION: Removed unused props from destructuring
const PassbookPage: React.FC<PassbookPageProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setError(null);
      const data = await financeService.getTransactions({ ordering: '-created_at' });
      
      // Handle paginated response from Django REST Framework
      if (data && data.results && Array.isArray(data.results)) {
        setTransactions(data.results);
      } else if (Array.isArray(data)) {
        // Fallback if API returns array directly
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setError('Failed to load transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Passbook</h1>
        
        {loading ? (
          <div className="text-center py-16">Loading transactions...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No transactions yet</div>
        ) : (
          <div className="space-y-3">
            {transactions.map(txn => (
              <div key={txn.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {txn.transaction_type === 'credit' ? (
                    <ArrowDownLeft className="text-green-600" size={24} />
                  ) : (
                    <ArrowUpRight className="text-red-600" size={24} />
                  )}
                  <div>
                    <p className="font-semibold">
                      {txn.transaction_type === 'credit' ? 'Money Received' : 'Money Sent'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(txn.created_at).toLocaleString()}
                    </p>
                    {txn.description && (
                      <p className="text-xs text-gray-500 mt-1">{txn.description}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xl font-bold ${
                  txn.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.transaction_type === 'credit' ? '+' : '-'}₹{parseFloat(txn.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PassbookPage;