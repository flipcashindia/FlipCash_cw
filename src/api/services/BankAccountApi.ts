/**
 * Bank Account API Service
 * Complete service layer for bank account management
 * Uses apiClient with JWT interceptors
 */

import apiClient from '../client/apiClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

/**
 * Account Type Enum
 */
export type AccountType = 'savings' | 'current';

/**
 * Verification Status Enum
 */
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'rejected';

/**
 * Bank Account Model - Matches Django BankAccount model
 */
export interface BankAccount {
  id: string;
  account_holder_name: string;
  account_number?: string; // write_only in Django serializer (only on create)
  masked_account_number: string; // Read-only masked version
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: AccountType;
  verification_status: VerificationStatus;
  is_verified: boolean;
  verified_at: string | null;
  is_primary: boolean;
  is_active: boolean;
  can_be_used_for_withdrawal: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
}

/**
 * Bank Account Create Data
 */
export interface BankAccountCreateRequest {
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name?: string;
  account_type: AccountType;
}

/**
 * Bank Account Update Data (Limited fields)
 */
export interface BankAccountUpdateRequest {
  account_holder_name?: string;
  bank_name?: string;
  branch_name?: string;
}

/**
 * Set Primary Bank Account Request
 */
export interface SetPrimaryBankAccountRequest {
  bank_account_id: string;
}

/**
 * API Response Wrapper - Single Item
 */
export interface BankAccountAPIResponse {
  success: boolean;
  message?: string;
  data: BankAccount;
}

/**
 * API Response Wrapper - List
 */
export interface BankAccountListAPIResponse {
  success: boolean;
  count: number;
  data: BankAccount[];
}

/**
 * Bank Account Status Check Response
 */
export interface BankAccountStatusResponse {
  success: boolean;
  has_bank_account: boolean;
  total_accounts: number;
  has_verified_account: boolean;
  has_primary_account: boolean;
}

/**
 * Primary Account Response
 */
export interface PrimaryAccountAPIResponse {
  success: boolean;
  data: BankAccount | null;
  message?: string;
}

// ============================================================================
// API SERVICE
// ============================================================================

/**
 * Bank Account API Service
 * All methods for managing bank accounts
 */
export const bankAccountAPI = {
  /**
   * Get all bank accounts for the current user
   * GET /accounts/bank-accounts/
   * 
   * @returns Promise<BankAccount[]>
   * @throws Error if request fails
   */
  getAll: async (): Promise<BankAccount[]> => {
    const response: AxiosResponse<BankAccountListAPIResponse> = await apiClient.get(
      '/accounts/bank-accounts/'
    );
    return response.data.data || [];
  },

  /**
   * Get a specific bank account by ID
   * GET /accounts/bank-accounts/{id}/
   * 
   * @param id - Bank account UUID
   * @returns Promise<BankAccount>
   * @throws Error if request fails or account not found
   */
  getById: async (id: string): Promise<BankAccount> => {
    const response: AxiosResponse<BankAccountAPIResponse> = await apiClient.get(
      `/accounts/bank-accounts/${id}/`
    );
    return response.data.data;
  },

  /**
   * Create a new bank account
   * POST /accounts/bank-accounts/
   * 
   * @param accountData - Bank account creation data
   * @returns Promise<BankAccount>
   * @throws Error if validation fails or request fails
   */
  create: async (accountData: BankAccountCreateRequest): Promise<BankAccount> => {
    const response: AxiosResponse<BankAccountAPIResponse> = await apiClient.post(
      '/accounts/bank-accounts/',
      accountData
    );
    return response.data.data;
  },

  /**
   * Update a bank account (limited fields)
   * PATCH /accounts/bank-accounts/{id}/
   * 
   * @param id - Bank account UUID
   * @param accountData - Partial bank account update data
   * @returns Promise<BankAccount>
   * @throws Error if request fails
   */
  update: async (
    id: string,
    accountData: BankAccountUpdateRequest
  ): Promise<BankAccount> => {
    const response: AxiosResponse<BankAccountAPIResponse> = await apiClient.patch(
      `/accounts/bank-accounts/${id}/`,
      accountData
    );
    return response.data.data;
  },

  /**
   * Delete a bank account (soft delete)
   * DELETE /accounts/bank-accounts/{id}/
   * 
   * @param id - Bank account UUID
   * @returns Promise<void>
   * @throws Error if request fails
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accounts/bank-accounts/${id}/`);
  },

  /**
   * Set a bank account as primary
   * POST /accounts/bank-accounts/set-primary/
   * 
   * @param id - Bank account UUID
   * @returns Promise<BankAccount>
   * @throws Error if account is not verified or request fails
   */
  setPrimary: async (id: string): Promise<BankAccount> => {
    const response: AxiosResponse<BankAccountAPIResponse> = await apiClient.post(
      '/accounts/bank-accounts/set-primary/',
      { bank_account_id: id }
    );
    return response.data.data;
  },

  /**
   * Get the primary bank account
   * GET /accounts/bank-accounts/primary/
   * 
   * @returns Promise<BankAccount | null>
   * @throws Error if request fails
   */
  getPrimary: async (): Promise<BankAccount | null> => {
    const response: AxiosResponse<PrimaryAccountAPIResponse> = await apiClient.get(
      '/accounts/bank-accounts/primary/'
    );
    return response.data.data;
  },

  /**
   * Get all verified bank accounts
   * GET /accounts/bank-accounts/verified/
   * 
   * @returns Promise<BankAccount[]>
   * @throws Error if request fails
   */
  getVerified: async (): Promise<BankAccount[]> => {
    const response: AxiosResponse<BankAccountListAPIResponse> = await apiClient.get(
      '/accounts/bank-accounts/verified/'
    );
    return response.data.data || [];
  },

  /**
   * Check if user has added any bank accounts
   * GET /accounts/bank-accounts/check-added/
   * 
   * @returns Promise<BankAccountStatusResponse>
   * @throws Error if request fails
   */
  checkStatus: async (): Promise<BankAccountStatusResponse> => {
    const response: AxiosResponse<BankAccountStatusResponse> = await apiClient.get(
      '/accounts/bank-accounts/check-added/'
    );
    return response.data;
  },
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate IFSC code format
 * Format: 4 letters, 1 zero, 6 alphanumeric (e.g., HDFC0001234)
 * 
 * @param ifscCode - IFSC code to validate
 * @returns boolean
 */
export const validateIFSC = (ifscCode: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode.toUpperCase());
};

/**
 * Validate account number format
 * Indian bank accounts: 9-18 digits
 * 
 * @param accountNumber - Account number to validate
 * @returns boolean
 */
export const validateAccountNumber = (accountNumber: string): boolean => {
  const cleanNumber = accountNumber.replace(/\D/g, '');
  return cleanNumber.length >= 9 && cleanNumber.length <= 18;
};

/**
 * Clean account number (remove non-digits)
 * 
 * @param accountNumber - Account number to clean
 * @returns string - Cleaned account number
 */
export const cleanAccountNumber = (accountNumber: string): string => {
  return accountNumber.replace(/\D/g, '');
};

/**
 * Format IFSC code (uppercase, remove spaces)
 * 
 * @param ifscCode - IFSC code to format
 * @returns string - Formatted IFSC code
 */
export const formatIFSC = (ifscCode: string): string => {
  return ifscCode.toUpperCase().replace(/\s/g, '');
};

/**
 * Get verification status badge color
 * 
 * @param status - Verification status
 * @returns string - Tailwind color class
 */
export const getVerificationColor = (status: VerificationStatus): string => {
  switch (status) {
    case 'verified':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'failed':
    case 'rejected':
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * Get verification status label
 * 
 * @param status - Verification status
 * @returns string - Human-readable label
 */
export const getVerificationLabel = (status: VerificationStatus): string => {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'pending':
      return 'Pending Verification';
    case 'failed':
      return 'Verification Failed';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

/**
 * Format account type label
 * 
 * @param accountType - Account type
 * @returns string - Human-readable label
 */
export const formatAccountType = (accountType: AccountType): string => {
  return accountType.charAt(0).toUpperCase() + accountType.slice(1) + ' Account';
};

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

/**
 * Bank Account API Error
 * Extended error with additional context
 */
export interface BankAccountAPIError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  data?: any;
}

/**
 * Type guard for BankAccountAPIError
 * 
 * @param error - Error to check
 * @returns boolean
 */
export const isBankAccountAPIError = (error: any): error is BankAccountAPIError => {
  return error && typeof error.message === 'string';
};

/**
 * Format API error for display
 * 
 * @param error - Error from API
 * @returns string - Formatted error message
 */
export const formatAPIError = (error: unknown): string => {
  if (isBankAccountAPIError(error)) {
    // Check for field-specific errors
    if (error.errors) {
      const fieldErrors = Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      return fieldErrors || error.message;
    }
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Account types available
 */
export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
];

/**
 * Verification status types
 */
export const VERIFICATION_STATUSES: { value: VerificationStatus; label: string }[] = [
  { value: 'pending', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'failed', label: 'Verification Failed' },
  { value: 'rejected', label: 'Rejected' },
];

/**
 * Default error messages
 */
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to load bank accounts. Please try again.',
  CREATE_FAILED: 'Failed to add bank account. Please check your details.',
  UPDATE_FAILED: 'Failed to update bank account. Please try again.',
  DELETE_FAILED: 'Failed to delete bank account. Please try again.',
  SET_PRIMARY_FAILED: 'Failed to set primary account. Please try again.',
  INVALID_IFSC: 'Invalid IFSC code format. Example: HDFC0001234',
  INVALID_ACCOUNT_NUMBER: 'Account number must be between 9 and 18 digits.',
  NOT_VERIFIED: 'Cannot set unverified account as primary.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ACCOUNT_ADDED: 'Bank account added successfully! It will be verified shortly.',
  ACCOUNT_UPDATED: 'Bank account updated successfully.',
  ACCOUNT_DELETED: 'Bank account deleted successfully.',
  PRIMARY_SET: 'Primary bank account updated successfully.',
};

// Export default
export default bankAccountAPI;