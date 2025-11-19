/**
 * Finance Types - Customer App Only
 */

export interface Wallet {
  id: string;
  owner_type: 'user' | 'partner' | 'company';
  owner_id: string;
  balance: string;
  currency: string;
  status: 'active' | 'frozen' | 'suspended';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  wallet: string;
  transaction_type: 'credit' | 'debit';
  category: 'payment' | 'payout' | 'refund' | 'fee' | 'commission' | 'topup' | 'penalty' | 'bonus' | 'adjustment';
  amount: string;
  balance_before: string;
  balance_after: string;
  reference_type: string;
  reference_id: string;
  description: string;
  metadata: any;
  idempotency_key: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
  created_at: string;
  completed_at: string | null;
}

export interface Payout {
  id: string;
  payout_id: string;
  wallet: string;
  transaction: string | null;
  amount: string;
  fee: string;
  gst: string;
  net_amount: string;
  payout_method: 'bank_transfer' | 'upi' | 'imps' | 'neft' | 'rtgs';
  beneficiary_name: string;
  account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  bank_name: string | null;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected' | 'cancelled';
  requires_approval: boolean;
  approved_by: string | null;
  approved_at: string | null;
  provider_reference_id: string | null;
  provider_response: any;
  utr_number: string | null;
  failure_reason: string | null;
  notes: string;
  created_at: string;
  initiated_at: string;
  processed_at: string | null;
  completed_at: string | null;
}

export interface CreatePayoutRequest {
  amount: string;
  payout_method: 'bank_transfer' | 'upi' | 'imps' | 'neft' | 'rtgs';
  beneficiary_id?: string;
  beneficiary_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  bank_name?: string;
  notes?: string;
  save_beneficiary?: boolean;
  bank_account_id?:string;
}

export interface Beneficiary {
  id: string;
  wallet: string;
  account_type: 'bank' | 'upi';
  beneficiary_name: string;
  account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  bank_name: string | null;
  is_primary: boolean;
  is_verified: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}