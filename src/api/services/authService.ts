/**
 * Authentication Service - Customer App Only
 * Backend: /api/v1/accounts/
 * ✅ CORRECTED: Admin/Partner functions removed, UUIDs fixed, field names corrected
 */

import apiClient from '../client/apiClient';
import type {
  SendOTPRequest, SendOTPResponse, VerifyOTPRequest, VerifyOTPResponse,
  RefreshTokenRequest, RefreshTokenResponse, LogoutRequest, User,
  UserAddress, CreateAddressRequest, UpdateAddressRequest,
  UploadKYCRequest, UserKYC, PayoutBeneficiary, CreateBeneficiaryRequest, UpdateBeneficiaryRequest
} from '../types/auth.types';

const AUTH_BASE = '/accounts';

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const sendOTP = async (data: SendOTPRequest): Promise<SendOTPResponse> => {
  const response = await apiClient.post(`${AUTH_BASE}/auth/otp/send/`, data);
  return response.data;
};

// ✅ CORRECTED: Response structure - tokens are flat, not nested
export const verifyOTP = async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
  const response = await apiClient.post(`${AUTH_BASE}/auth/otp/verify/`, data);
  if (response.data.tokens) {
    const accessToken = response.data.tokens.access;
    const refreshToken = response.data.tokens.refresh;
    
    // ✅ ADD: Log before saving
    console.log('Saving access token:', accessToken);
    console.log('Saving refresh token:', refreshToken);
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // ✅ ADD: Verify they were saved
    console.log('Stored access token:', localStorage.getItem('access_token'));
    console.log('Stored refresh token:', localStorage.getItem('refresh_token'));
  }
  return response.data;
};

export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post(`${AUTH_BASE}/auth/token/refresh/`, data);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
  }
  return response.data;
};

export const logout = async (data: LogoutRequest): Promise<void> => {
  await apiClient.post(`${AUTH_BASE}/logout/`, data);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// ============================================================================
// USER PROFILE
// ============================================================================

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get(`accounts/me/`); // ✅ CORRECTED: endpoint
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await apiClient.patch(`accounts/me/`, data); // ✅ /me/ not /profile/
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

// ============================================================================
// ADDRESSES
// ============================================================================

export const getAddresses = async (): Promise<UserAddress[]> => {
  const response = await apiClient.get(`${AUTH_BASE}/addresses/`);
  return response.data.results || response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const getAddress = async (id: string): Promise<UserAddress> => {
  const response = await apiClient.get(`${AUTH_BASE}/addresses/${id}/`);
  return response.data;
};

export const createAddress = async (data: CreateAddressRequest): Promise<UserAddress> => {
  const response = await apiClient.post(`${AUTH_BASE}/addresses/`, data);
  return response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const updateAddress = async (id: string, data: UpdateAddressRequest): Promise<UserAddress> => {
  const response = await apiClient.patch(`${AUTH_BASE}/addresses/${id}/`, data);
  return response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const deleteAddress = async (id: string): Promise<void> => {
  await apiClient.delete(`${AUTH_BASE}/addresses/${id}/`);
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const setDefaultAddress = async (id: string): Promise<UserAddress> => {
  const response = await apiClient.post(`${AUTH_BASE}/addresses/${id}/set_default/`);
  return response.data;
};

// ============================================================================
// KYC
// ============================================================================

export const getKYC = async (): Promise<UserKYC> => {
  const response = await apiClient.get(`/accounts/kyc/`);
  return response.data;
};

// ✅ CORRECTED: Field names changed to match backend (document_front_image, etc.)
export const uploadKYC = async (data: UploadKYCRequest): Promise<UserKYC> => {
  const formData = new FormData();
  formData.append('document_type', data.document_type);
  formData.append('document_number', data.document_number);
  
  // ✅ CORRECTED: Backend expects these field names
  if (data.document_front_image instanceof File) {
    formData.append('document_front_image', data.document_front_image);
  }
  if (data.document_back_image instanceof File) {
    formData.append('document_back_image', data.document_back_image);
  }
  if (data.selfie_image instanceof File) {
    formData.append('selfie_image', data.selfie_image);
  }

  const response = await apiClient.patch(`/accounts/kyc/`, formData, { // ✅ CORRECTED: PATCH not POST
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============================================================================
// HELPERS
// ============================================================================

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

// ✅ CORRECTED: Check for 'consumer' role (backend uses 'consumer' not 'customer')
export const isConsumer = (): boolean => {
  const user = getStoredUser();
  return user?.role === 'consumer';
};





// export const getKYC = async () => {
//   const response = await apiClient.get('/user/kyc/');
//   return response.data;
// };

// export const updateKYC = async (formData: FormData) => {
//   const response = await apiClient.patch('/user/kyc/', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
//   return response.data;
// };


// ============================================================================
// BANK ACCOUNTS / BENEFICIARIES
// ============================================================================

export const getBeneficiaries = async (): Promise<PayoutBeneficiary[]> => {
  const response = await apiClient.get('/finance/beneficiaries/');
  return response.data.results || response.data;
};

export const getBeneficiary = async (id: string): Promise<PayoutBeneficiary> => {
  const response = await apiClient.get(`/finance/beneficiaries/${id}/`);
  return response.data;
};

export const createBeneficiary = async (data: CreateBeneficiaryRequest): Promise<PayoutBeneficiary> => {
  const response = await apiClient.post('/finance/beneficiaries/', data);
  return response.data;
};

export const updateBeneficiary = async (id: string, data: UpdateBeneficiaryRequest): Promise<PayoutBeneficiary> => {
  const response = await apiClient.patch(`/finance/beneficiaries/${id}/`, data);
  return response.data;
};

export const deleteBeneficiary = async (id: string): Promise<void> => {
  await apiClient.delete(`/finance/beneficiaries/${id}/`);
};

export const setPrimaryBeneficiary = async (id: string): Promise<PayoutBeneficiary> => {
  const response = await apiClient.post(`/finance/beneficiaries/${id}/set_primary/`);
  return response.data;
};