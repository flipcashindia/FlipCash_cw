/**
 * Authentication Types - Customer App Only
 * ✅ Admin/Partner types REMOVED
 */

export interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  full_name: string | null;
  role: 'consumer';
  is_active: boolean;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  kyc_verified_at: string | null;
  kyc_status?: 'pending' | 'submitted' | 'verified' | 'rejected';
  profile_completed: boolean;
  device_binding_id: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  profile_completion_percentage: number;
  default_address?: UserAddress | null;
}

export interface UserAddress {
  id: string;
  user: string;
  full_name: string | null;
  name:string;
  type: 'home' | 'office' | 'other';
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface UserKYC {
  id: string;
  user: string;
  document_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
  document_number: string;
  document_front_image: string | null;
  document_back_image: string | null;
  selfie_image: string | null;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  verification_notes: string;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SendOTPRequest {
  phone: string;
  purpose?: 'login' | 'registration';
}

export interface SendOTPResponse {
  request_id: string;
  message: string;
  next_resend_at: string | null;
}

export interface VerifyOTPRequest {
  phone: string;
  code: string;
  // request_id: string;
  device_id?: string;
}

export interface VerifyOTPResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
  created: boolean;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface CreateAddressRequest {
  type: 'home' | 'office' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: String;
  is_default?: boolean ;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export interface UploadKYCRequest {
  document_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
  document_number: string;
  document_front_image: File | string;
  document_back_image?: File | string;
  selfie_image?: File | string;
}




// Bank Account / Beneficiary Types
export interface PayoutBeneficiary {
  id: string;
  wallet: string;
  account_type: 'bank' | 'upi';
  beneficiary_name: string;
  account_number: string;
  account_number_masked?: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  upi_id: string;
  is_verified: boolean;
  verified_at: string | null;
  is_primary: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBeneficiaryRequest {
  account_type: 'bank' | 'upi';
  beneficiary_name: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  branch_name?: string;
  upi_id?: string;
}

export interface UpdateBeneficiaryRequest extends Partial<CreateBeneficiaryRequest> {}