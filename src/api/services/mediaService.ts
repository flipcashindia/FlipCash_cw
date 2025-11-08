/**
 * Media Service - File uploads
 * Backend: /api/v1/media/
 * ✅ CORRECTED: Endpoints verified, presign structure fixed
 */

import apiClient from '../client/apiClient';

const MEDIA_BASE = '/media';

export interface PresignRequest {
  files: Array<{
    file: string;
    content_type: string;
  }>;
}

export interface PresignResponse {
  presigns: Array<{ // ✅ CORRECTED: backend returns 'presigns' not 'presign'
    file: string;
    url: string;
    method: string;
  }>;
}

export interface MediaUploadResponse {
  file: string;
  url: string;
}

// ============================================================================
// PRESIGN URLs (for S3 direct upload)
// ============================================================================

export const getPresignUrls = async (files: Array<{ name: string; type: string }>): Promise<PresignResponse> => {
  const response = await apiClient.post(`${MEDIA_BASE}/presign/`, {
    files: files.map(f => ({ 
      file: f.name, 
      content_type: f.type 
    }))
  });
  return response.data;
};

// ✅ ADDED: Upload to presigned URL
export const uploadToPresignedUrl = async (url: string, file: File): Promise<void> => {
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

// ============================================================================
// DIRECT UPLOAD (to backend, backend handles S3)
// ============================================================================

export const uploadFile = async (file: File): Promise<MediaUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(`${MEDIA_BASE}/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadFiles = async (files: File[]): Promise<MediaUploadResponse[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await apiClient.post(`${MEDIA_BASE}/upload-multiple/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============================================================================
// HELPERS
// ============================================================================

// ✅ CORRECTED: Better error handling
export const uploadDevicePhotos = async (photos: File[]): Promise<string[]> => {
  try {
    const uploads = await uploadFiles(photos);
    return uploads.map(u => u.url);
  } catch (error) {
    console.error('Failed to upload device photos:', error);
    throw new Error('Failed to upload photos. Please try again.');
  }
};

// ✅ ADDED: Upload single KYC document
export const uploadKYCDocument = async (file: File): Promise<string> => {
  const upload = await uploadFile(file);
  return upload.url;
};

// ✅ ADDED: Validate file before upload
export const validateFile = (file: File, maxSizeMB: number = 10, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  
  return { valid: true };
};