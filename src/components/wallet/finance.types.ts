// src/types/finance.types.ts

// =============================================================================
// WALLET TYPES
// =============================================================================

export type WalletOwnerType = 'user' | 'partner' | 'company';
export type WalletStatus = 'active' | 'frozen' | 'suspended' | 'closed';

export interface Wallet {
  id: string;
  owner_type: WalletOwnerType;
  owner_id: string;
  balance: string;
  available_balance: string;
  currency: string;
  status: WalletStatus;
  daily_withdrawal_limit: string | null;
  min_balance: string;
  created_at: string;
  updated_at: string;
}

export interface WalletStatistics {
  current_balance: string;
  available_balance: string;
  total_credits: string;
  total_debits: string;
  transaction_count: number;
  last_transaction_at: string | null;
  daily_withdrawal_limit: string | null;
}

export interface WalletResponse {
  wallet: Wallet;
  statistics: WalletStatistics;
}

export interface WalletBalanceResponse {
  balance: string;
  currency: string;
  status: WalletStatus;
}

// =============================================================================
// TRANSACTION TYPES
// =============================================================================

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 
  | 'payment' 
  | 'device_sale' 
  | 'payout' 
  | 'withdrawal' 
  | 'refund' 
  | 'fee' 
  | 'commission' 
  | 'adjustment' 
  | 'transfer' 
  | 'reversal';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'reversed';

export interface Transaction {
  id: string;
  transaction_id: string;
  wallet: string;
  transaction_type: TransactionType;
  category: TransactionCategory;
  amount: string;
  balance_before: string;
  balance_after: string;
  description: string;
  reference_type: string;
  reference_id: string | null;
  metadata: Record<string, unknown>;
  status: TransactionStatus;
  created_at: string;
  completed_at: string | null;
}

export interface TransactionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

// =============================================================================
// PAYMENT TYPES (Partner Wallet Top-ups)
// =============================================================================

export type PaymentStatus = 'ACTIVE' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED' | 'USER_DROPPED';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'app' | 'card_emi' | 'paylater' | 'banktransfer';

export interface CashfreePayment {
  id: string;
  cf_order_id: string;
  cf_payment_id: string;
  payment_session_id: string;
  wallet: string;
  transaction: string | null;
  order_amount: string;
  order_currency: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | '';
  customer_id: string;
  customer_phone: string;
  customer_email: string;
  customer_name: string;
  payment_link: string;
  return_url: string;
  reference_type: string;
  reference_id: string | null;
  order_note: string;
  bank_reference: string;
  metadata: Record<string, unknown>;
  created_at: string;
  paid_at: string | null;
}

export interface PaymentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CashfreePayment[];
}

export interface CreatePaymentOrderRequest {
  amount: string;
  purpose?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  order_note?: string;
  return_url?: string;
}

export interface VerifyPaymentResponse {
  order_id: string;
  status: PaymentStatus;
  amount: string;
  order_details: {
    cf_order_id: string;
    order_id: string;
    order_amount: number;
    order_currency: string;
    order_status: string;
    payment_session_id: string;
  };
  payment_details: Array<{
    cf_payment_id: number;
    payment_status: string;
    payment_amount: number;
    payment_currency: string;
    payment_method: Record<string, unknown>;
    payment_time: string;
    bank_reference: string;
  }>;
}

// =============================================================================
// PAYOUT TYPES (Consumer Withdrawals)
// =============================================================================

export type PayoutStatus = 'pending' | 'processing' | 'success' | 'failed' | 'reversed' | 'cancelled';
export type PayoutMethod = 'bank_account' | 'upi';

export interface Payout {
  id: string;
  payout_id: string;
  user: string;
  wallet: string;
  bank_account: string;
  amount: string;
  fee: string;
  gst: string;
  net_amount: string;
  payout_method: PayoutMethod;
  beneficiary_name: string;
  masked_account_number: string;
  ifsc_code: string;
  bank_name: string;
  status: PayoutStatus;
  reference_type: string;
  reference_id: string | null;
  cf_transfer_id: string;
  utr_number: string;
  failure_reason: string;
  remarks: string;
  initiated_at: string;
  processing_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
}

export interface PayoutListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payout[];
}

export interface CreatePayoutRequest {
  bank_account_id: string;
  amount: string;
  remarks?: string;
}

export interface PayoutEstimateRequest {
  amount: string;
}

export interface PayoutEstimateResponse {
  amount: string;
  fee: string;
  gst: string;
  net_amount: string;
  total_deduction: string;
}

// =============================================================================
// BANK ACCOUNT TYPES
// =============================================================================

export type BankAccountVerificationStatus = 'pending' | 'verified' | 'failed' | 'rejected';
export type BankAccountType = 'savings' | 'current';

export interface BankAccount {
  id: string;
  account_holder_name: string;
  masked_account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: BankAccountType;
  verification_status: BankAccountVerificationStatus;
  is_verified: boolean;
  verified_at: string | null;
  is_primary: boolean;
  is_active: boolean;
  can_be_used_for_withdrawal: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
}

export interface BankAccountVerifyResponse {
  verified: boolean;
  account_exists: boolean;
  name_at_bank: string | null;
  reference_id: string;
}

// =============================================================================
// API ERROR TYPE
// =============================================================================

export interface ApiError {
  error?: string;
  detail?: string;
  message?: string;
  [key: string]: unknown;
}