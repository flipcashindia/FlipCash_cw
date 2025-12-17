// src/api/finance.api.ts

import axios, { type AxiosInstance } from 'axios';
import type {
  WalletResponse,
  WalletBalanceResponse,
  Transaction,
  TransactionListResponse,
  CashfreePayment,
  PaymentListResponse,
  CreatePaymentOrderRequest,
  VerifyPaymentResponse,
  Payout,
  PayoutListResponse,
  CreatePayoutRequest,
  PayoutEstimateRequest,
  PayoutEstimateResponse,
  BankAccount,
  BankAccountVerifyResponse,
} from './finance.types';

// =============================================================================
// API CLIENT SETUP
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('Attaching token to request:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login or refresh token
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// WALLET API
// =============================================================================

export const walletApi = {
  /**
   * Get current user's wallet with statistics
   */
  getMyWallet: async (): Promise<WalletResponse> => {
    const response = await apiClient.get('/finance/wallet/');
    return response.data;
  },

  /**
   * Quick wallet balance check
   */
  getBalance: async (): Promise<WalletBalanceResponse> => {
    const response = await apiClient.get('/finance/wallet/balance/');
    return response.data;
  },
};

// =============================================================================
// TRANSACTION API
// =============================================================================

export interface TransactionFilters {
  transaction_type?: 'credit' | 'debit';
  category?: string;
  status?: string;
  page?: number;
}

export const transactionApi = {
  /**
   * Get transaction history with optional filters
   */
  getTransactions: async (filters?: TransactionFilters): Promise<TransactionListResponse> => {
    const params = new URLSearchParams();
    if (filters?.transaction_type) params.append('transaction_type', filters.transaction_type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await apiClient.get(`/finance/transactions/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single transaction detail
   */
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/finance/transactions/${id}/`);
    return response.data;
  },
};

// =============================================================================
// PAYMENT API (Partner Wallet Top-ups)
// =============================================================================

export interface PaymentFilters {
  payment_status?: string;
  payment_method?: string;
  page?: number;
}

export const paymentApi = {
  /**
   * Create payment order for wallet top-up
   */
  createPaymentOrder: async (data: CreatePaymentOrderRequest): Promise<CashfreePayment> => {
    const response = await apiClient.post('/finance/payments/create/', data);
    return response.data;
  },

  /**
   * Verify payment status
   */
  verifyPayment: async (cfOrderId: string): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.get(`/finance/payments/verify/?cf_order_id=${cfOrderId}`);
    return response.data;
  },

  /**
   * Get payment history
   */
  getPayments: async (filters?: PaymentFilters): Promise<PaymentListResponse> => {
    const params = new URLSearchParams();
    if (filters?.payment_status) params.append('payment_status', filters.payment_status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await apiClient.get(`/finance/payments/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single payment detail
   */
  getPayment: async (id: string): Promise<CashfreePayment> => {
    const response = await apiClient.get(`/finance/payments/${id}/`);
    return response.data;
  },
};

// =============================================================================
// PAYOUT API (Consumer Withdrawals)
// =============================================================================

export interface PayoutFilters {
  status?: string;
  payout_method?: string;
  page?: number;
}

export const payoutApi = {
  /**
   * Calculate payout fee and net amount
   */
  estimatePayout: async (data: PayoutEstimateRequest): Promise<PayoutEstimateResponse> => {
    const response = await apiClient.post('/finance/payouts/estimate/', data);
    return response.data;
  },

  /**
   * Create payout (withdrawal request)
   */
  createPayout: async (data: CreatePayoutRequest): Promise<Payout> => {
    const response = await apiClient.post('/finance/payouts/create/', data);
    return response.data;
  },

  /**
   * Get payout history
   */
  getPayouts: async (filters?: PayoutFilters): Promise<PayoutListResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.payout_method) params.append('payout_method', filters.payout_method);
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await apiClient.get(`/finance/payouts/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single payout detail
   */
  getPayout: async (id: string): Promise<Payout> => {
    const response = await apiClient.get(`/finance/payouts/${id}/`);
    return response.data;
  },
};

// =============================================================================
// BANK ACCOUNT API
// =============================================================================

export const bankAccountApi = {
  /**
   * Get user's bank accounts
   */
  getBankAccounts: async (): Promise<BankAccount[]> => {
    const response = await apiClient.get('/accounts/bank-accounts/');
    // console.log('Bank Accounts Response:', response.data);
    // Extract the data array from the response
    return response.data.data || response.data || [];
  },

  /**
   * Verify bank account via penny drop
   */
  verifyBankAccount: async (bankAccountId: string): Promise<BankAccountVerifyResponse> => {
    const response = await apiClient.post(`/finance/bank-accounts/${bankAccountId}/verify/`);
    return response.data.data || response.data;
  },

  /**
   * Set bank account as primary
   */
  // In finance.api.ts - Replace this method:

  setPrimaryBankAccount: async (bankAccountId: string): Promise<BankAccount> => {
    const response = await apiClient.post(`/accounts/bank-accounts/${bankAccountId}/set-primary/`);
    // Handle both response formats
    if (response.data && typeof response.data === 'object') {
      if (response.data.data) {
        return response.data.data; // Unwrap from { success, data }
      }
      return response.data; // Already unwrapped
    }
    throw new Error('Invalid response format');
  },
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export const financeApi = {
  wallet: walletApi,
  transactions: transactionApi,
  payments: paymentApi,
  payouts: payoutApi,
  bankAccounts: bankAccountApi,
};

export default financeApi;