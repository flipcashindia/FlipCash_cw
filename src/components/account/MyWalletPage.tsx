import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import * as financeService from '../../api/services/financeService';
import type { MenuTab } from './MyAccountPage';

interface MyWalletPageProps {
  username: string;
  onNavClick: (tab: MenuTab | 'Passbook') => void;
  onBreadcrumbClick: (path: string) => void;
  onLogout: () => void;
}

const MyWalletPage: React.FC<MyWalletPageProps> = ({ username, onNavClick, onBreadcrumbClick, onLogout }) => {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const data = await financeService.getWalletBalance();
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeService.createPayout({
        amount: parseFloat(amount),
        method: 'upi',
        account_ref: upiId,
      });
      await loadWallet();
      setAmount('');
      setUpiId('');
      alert('Withdrawal request submitted');
    } catch (error: any) {
      alert(error.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Wallet size={32} />
            <span className="text-xl font-semibold">Available Balance</span>
          </div>
          <div className="text-5xl font-bold">
            {loading ? '...' : `₹${parseFloat(balance).toLocaleString()}`}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4">Withdraw Money</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input
                type="text"
                placeholder="UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-lg"
                min="100"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
              >
                Withdraw
              </button>
            </form>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4">Quick Actions</h3>
            <button
              onClick={() => onNavClick('Passbook' as any)}
              className="w-full py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 mb-3"
            >
              View Passbook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyWalletPage;