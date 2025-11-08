/**
 * Finance Service (NO CACHE - Real-time)
 * Backend: /api/v1/finance/
 * ✅ CORRECTED: All types updated, amount changed to string
 */

import apiClient from '../client/apiClient';
import type {
  Wallet, Transaction, Payout, CreatePayoutRequest, Beneficiary
} from '../types/finance.types';

const FINANCE_BASE = '/finance';

// ============================================================================
// WALLET
// ============================================================================

export const getWallet = async (): Promise<Wallet> => {
  const response = await apiClient.get(`${FINANCE_BASE}/wallet/`);
  return response.data;
};

export const getWalletBalance = async (): Promise<{ balance: string }> => {
  const response = await apiClient.get(`${FINANCE_BASE}/wallet/balance/`);
  return response.data;
};

// ============================================================================
// TRANSACTIONS
// ============================================================================

export const getTransactions = async (params?: {
  transaction_type?: 'credit' | 'debit'; // ✅ CORRECTED: was 'type'
  category?: string;
  status?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
}): Promise<{ results: Transaction[]; count: number; next: string | null; previous: string | null }> => {
  const response = await apiClient.get(`${FINANCE_BASE}/transactions/`, { params });
  return response.data;
};

// ✅ ADDED: Get single transaction
export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await apiClient.get(`${FINANCE_BASE}/transactions/${id}/`);
  return response.data;
};

// ============================================================================
// PAYOUTS
// ============================================================================

export const getPayouts = async (params?: {
  status?: string;
  payout_method?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
}): Promise<{ results: Payout[]; count: number; next: string | null; previous: string | null }> => {
  const response = await apiClient.get(`${FINANCE_BASE}/payouts/`, { params });
  return response.data;
};

// ✅ ADDED: Get single payout
export const getPayout = async (id: string): Promise<Payout> => {
  const response = await apiClient.get(`${FINANCE_BASE}/payouts/${id}/`);
  return response.data;
};

export const createPayout = async (data: CreatePayoutRequest): Promise<Payout> => {
  const response = await apiClient.post(`${FINANCE_BASE}/payouts/`, data);
  return response.data;
};

// ✅ CORRECTED: Request structure changed, amount is string, method is payout_method
export const getPayoutEstimate = async (amount: string, payout_method: string): Promise<{
  amount: string; // ✅ CORRECTED: string not number
  fee: string; // ✅ CORRECTED: string not number
  gst: string; // ✅ ADDED
  net_amount: string; // ✅ CORRECTED: string not number
  total_charges: string; // ✅ ADDED
}> => {
  const response = await apiClient.post(`${FINANCE_BASE}/payouts/estimate/`, { 
    amount, 
    payout_method // ✅ CORRECTED: was 'method'
  });
  return response.data;
};

// ✅ ADDED: Cancel payout
export const cancelPayout = async (id: string): Promise<Payout> => {
  const response = await apiClient.post(`${FINANCE_BASE}/payouts/${id}/cancel/`);
  return response.data;
};

// ✅ ADDED: Retry failed payout
export const retryPayout = async (id: string): Promise<Payout> => {
  const response = await apiClient.post(`${FINANCE_BASE}/payouts/${id}/retry/`);
  return response.data;
};

// ============================================================================
// BENEFICIARIES
// ============================================================================

export const getBeneficiaries = async (): Promise<Beneficiary[]> => {
  const response = await apiClient.get(`${FINANCE_BASE}/beneficiaries/`);
  return response.data.results || response.data;
};

// ✅ ADDED: Get single beneficiary
export const getBeneficiary = async (id: string): Promise<Beneficiary> => {
  const response = await apiClient.get(`${FINANCE_BASE}/beneficiaries/${id}/`);
  return response.data;
};

// ✅ ADDED: Create beneficiary
export const createBeneficiary = async (data: Omit<Beneficiary, 'id' | 'wallet' | 'is_verified' | 'last_used_at' | 'created_at' | 'updated_at'>): Promise<Beneficiary> => {
  const response = await apiClient.post(`${FINANCE_BASE}/beneficiaries/`, data);
  return response.data;
};

// ✅ ADDED: Update beneficiary
export const updateBeneficiary = async (id: string, data: Partial<Beneficiary>): Promise<Beneficiary> => {
  const response = await apiClient.patch(`${FINANCE_BASE}/beneficiaries/${id}/`, data);
  return response.data;
};

// ✅ ADDED: Delete beneficiary
export const deleteBeneficiary = async (id: string): Promise<void> => {
  await apiClient.delete(`${FINANCE_BASE}/beneficiaries/${id}/`);
};

// ✅ ADDED: Set primary beneficiary
export const setPrimaryBeneficiary = async (id: string): Promise<Beneficiary> => {
  const response = await apiClient.post(`${FINANCE_BASE}/beneficiaries/${id}/set_primary/`);
  return response.data;
};