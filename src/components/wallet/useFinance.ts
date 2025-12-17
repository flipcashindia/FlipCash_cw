// src/hooks/useFinance.ts

import { useState, useEffect, useCallback } from 'react';
import type {
  WalletResponse,
  WalletBalanceResponse,
  Transaction,
  // TransactionListResponse,
  CashfreePayment,
  // PaymentListResponse,
  Payout,
  // PayoutListResponse,
  PayoutEstimateResponse,
  BankAccount,
  BankAccountVerifyResponse,
} from './finance.types';
import {
  walletApi,
  transactionApi,
  paymentApi,
  payoutApi,
  bankAccountApi,
  type TransactionFilters,
  type PaymentFilters,
  type PayoutFilters,
} from './finance.api';

// =============================================================================
// USE WALLET HOOK
// =============================================================================
export const useWallet = () => {
  const [data, setData] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletApi.getMyWallet();
      setData(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { data, loading, error, refetch: fetchWallet };
};

// =============================================================================
// USE WALLET BALANCE HOOK (Quick Balance Check)
// =============================================================================
export const useWalletBalance = () => {
  const [data, setData] = useState<WalletBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletApi.getBalance();
      setData(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { data, loading, error, refetch: fetchBalance };
};

// =============================================================================
// USE TRANSACTIONS HOOK
// =============================================================================
export const useTransactions = (initialFilters?: TransactionFilters) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ 
    count: 0, 
    next: null as string | null, 
    previous: null as string | null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters || {});

  const fetchTransactions = useCallback(async (newFilters?: TransactionFilters, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionApi.getTransactions(newFilters || filters);
      if (append) {
        setData(prev => [...prev, ...(response.results || [])]);
      } else {
        setData(response.results || []);
      }
      setPagination({ 
        count: response.count || 0, 
        next: response.next || null, 
        previous: response.previous || null 
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transactions');
      setData([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const updateFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters);
    fetchTransactions(newFilters);
  }, [fetchTransactions]);

  const loadMore = useCallback(() => {
    if (pagination.next) {
      const nextPage = (filters.page || 1) + 1;
      fetchTransactions({ ...filters, page: nextPage }, true);
    }
  }, [filters, pagination.next, fetchTransactions]);

  return {
    data: data || [], // Always return array
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refetch: () => fetchTransactions(filters),
  };
};

// =============================================================================
// USE PAYMENTS HOOK (Partner)
// =============================================================================
export const usePayments = (initialFilters?: PaymentFilters) => {
  const [data, setData] = useState<CashfreePayment[]>([]);
  const [pagination, setPagination] = useState({ 
    count: 0, 
    next: null as string | null, 
    previous: null as string | null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>(initialFilters || {});

  const fetchPayments = useCallback(async (newFilters?: PaymentFilters, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentApi.getPayments(newFilters || filters);
      if (append) {
        setData(prev => [...prev, ...(response.results || [])]);
      } else {
        setData(response.results || []);
      }
      setPagination({ 
        count: response.count || 0, 
        next: response.next || null, 
        previous: response.previous || null 
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch payments');
      setData([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const createPayment = useCallback(async (amount: string, purpose?: string) => {
    try {
      const payment = await paymentApi.createPaymentOrder({ amount, purpose });
      return payment;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to create payment');
    }
  }, []);

  const verifyPayment = useCallback(async (cfOrderId: string) => {
    try {
      const result = await paymentApi.verifyPayment(cfOrderId);
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to verify payment');
    }
  }, []);

  return {
    data: data || [], // Always return array
    loading,
    error,
    pagination,
    filters,
    setFilters,
    createPayment,
    verifyPayment,
    refetch: () => fetchPayments(filters),
  };
};

// =============================================================================
// USE PAYOUTS HOOK (Consumer)
// =============================================================================
export const usePayouts = (initialFilters?: PayoutFilters) => {
  const [data, setData] = useState<Payout[]>([]);
  const [pagination, setPagination] = useState({ 
    count: 0, 
    next: null as string | null, 
    previous: null as string | null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PayoutFilters>(initialFilters || {});

  const fetchPayouts = useCallback(async (newFilters?: PayoutFilters, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await payoutApi.getPayouts(newFilters || filters);
      if (append) {
        setData(prev => [...prev, ...(response.results || [])]);
      } else {
        setData(response.results || []);
      }
      setPagination({ 
        count: response.count || 0, 
        next: response.next || null, 
        previous: response.previous || null 
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch payouts');
      setData([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const estimatePayout = useCallback(async (amount: string): Promise<PayoutEstimateResponse> => {
    const response = await payoutApi.estimatePayout({ amount });
    return response;
  }, []);

  const createPayout = useCallback(async (bankAccountId: string, amount: string, remarks?: string) => {
    try {
      const payout = await payoutApi.createPayout({
        bank_account_id: bankAccountId,
        amount,
        remarks,
      });
      return payout;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.bank_account_id?.[0] || 'Failed to create payout');
    }
  }, []);

  return {
    data: data || [], // Always return array
    loading,
    error,
    pagination,
    filters,
    setFilters,
    estimatePayout,
    createPayout,
    refetch: () => fetchPayouts(filters),
  };
};

// =============================================================================
// USE BANK ACCOUNTS HOOK
// =============================================================================
interface UseBankAccountsReturn {
  data: BankAccount[];
  loading: boolean;
  error: string | null;
  verifyBankAccount: (bankAccountId: string) => Promise<BankAccountVerifyResponse>;
  setPrimaryBankAccount: (bankAccountId: string) => Promise<BankAccount>;
  refetch: () => Promise<void>;
}

export const useBankAccounts = (): UseBankAccountsReturn => {
  const [data, setData] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBankAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bankAccountApi.getBankAccounts();
      setData(response || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch bank accounts');
      setData([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const verifyBankAccount = useCallback(async (bankAccountId: string): Promise<BankAccountVerifyResponse> => {
    try {
      const result = await bankAccountApi.verifyBankAccount(bankAccountId);
      await fetchBankAccounts(); // Refresh list
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to verify bank account');
    }
  }, [fetchBankAccounts]);

  const setPrimaryBankAccount = useCallback(async (bankAccountId: string): Promise<BankAccount> => {
    try {
      const result = await bankAccountApi.setPrimaryBankAccount(bankAccountId);
      await fetchBankAccounts(); // Refresh list
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to set primary bank account');
    }
  }, [fetchBankAccounts]);

  return {
    data: data || [], // Always return array
    loading,
    error,
    verifyBankAccount,
    setPrimaryBankAccount,
    refetch: fetchBankAccounts,
  };
};