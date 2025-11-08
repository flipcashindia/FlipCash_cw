/**
 * Catalog Service with 15-min cache
 * Backend: /api/v1/catalog/
 * ✅ CORRECTED: All IDs changed to string (UUID), param names fixed
 */

import apiClient from '../client/apiClient';
import { getCachedData, setCachedData } from '../utils/cache';
import type {
  Category, Brand, Model, DeviceVariant, DeviceImage,
  PriceEstimateRequest, PriceEstimateResponse
} from '../types/catalog.types';

const CATALOG_BASE = '/catalog';
const PRICING_BASE = '/pricing';
const CACHE_DURATION = 10000; // 15 minutes  900000

// ============================================================================
// CATEGORIES (CACHED)
// ============================================================================

export const getCategories = async (): Promise<Category[]> => {
  const cacheKey = 'catalog_categories';
  const cached = getCachedData<Category[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/categories/`);
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const getCategory = async (id: string): Promise<Category> => {
  const cacheKey = `catalog_category_${id}`;
  const cached = getCachedData<Category>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/categories/${id}/`);
  setCachedData(cacheKey, response.data, CACHE_DURATION);
  return response.data;
};

// ============================================================================
// BRANDS (CACHED)
// ============================================================================

// ✅ CORRECTED: param name changed from category_id to category (backend expects 'category')
export const getBrandsByCategory = async (categoryId: string): Promise<Brand[]> => {
  const cacheKey = `catalog_brands_cat_${categoryId}`;
  const cached = getCachedData<Brand[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/brands/`, {
    params: { category: categoryId }, // ✅ CORRECTED: was category_id
  });
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ ADDED: Get all brands (no filter)
export const getAllBrands = async (): Promise<Brand[]> => {
  const cacheKey = 'catalog_brands_all';
  const cached = getCachedData<Brand[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/brands/`);
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const getBrand = async (id: string): Promise<Brand> => {
  const cacheKey = `catalog_brand_${id}`;
  const cached = getCachedData<Brand>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/brands/${id}/`);
  setCachedData(cacheKey, response.data, CACHE_DURATION);
  return response.data;
};

// ============================================================================
// MODELS (CACHED)
// ============================================================================

// ✅ CORRECTED: param name changed from brand_id to brand
export const getModelsByBrand = async (brandId: string): Promise<Model[]> => {
  const cacheKey = `catalog_models_brand_${brandId}`;
  const cached = getCachedData<Model[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/models/`, {
    params: { brand: brandId }, // ✅ CORRECTED: was brand_id
  });
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ CORRECTED: Already correct, keeping as is
export const getModelsByBrandAndCategory = async (brandId: string, categoryId: string): Promise<Model[]> => {
  const cacheKey = `catalog_models_brand_and_category_${brandId}_${categoryId}`;
  const cached = getCachedData<Model[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/models/`, {
    params: { brand: brandId, category: categoryId },
  });
  console.log('Models data : ', response);
  
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ ADDED: Get featured models
export const getFeaturedModels = async (): Promise<Model[]> => {
  const cacheKey = 'catalog_models_featured';
  const cached = getCachedData<Model[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/models/`, {
    params: { featured: true },
  });
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const getModel = async (id: string): Promise<Model> => {
  const cacheKey = `catalog_model_${id}`;
  const cached = getCachedData<Model>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/models/${id}/`);
  setCachedData(cacheKey, response.data, CACHE_DURATION);
  return response.data;
};

// ✅ ADDED: Get model variants
export const getModelVariants = async (modelId: string): Promise<DeviceVariant[]> => {
  const cacheKey = `catalog_model_variants_${modelId}`;
  const cached = getCachedData<DeviceVariant[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/models/${modelId}/variants/`);
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ ADDED: Get model images
export const getModelImages = async (modelId: string): Promise<DeviceImage[]> => {
  const cacheKey = `catalog_model_images_${modelId}`;
  const cached = getCachedData<DeviceImage[]>(cacheKey);
  if (cached) return cached;

  const response = await apiClient.get(`${CATALOG_BASE}/models/${modelId}/images/`);
  const data = response.data.results || response.data;
  
  setCachedData(cacheKey, data, CACHE_DURATION);
  return data;
};

// ✅ ADDED: Search models
export const searchModels = async (query: string): Promise<Model[]> => {
  const response = await apiClient.get(`${CATALOG_BASE}/models/`, {
    params: { search: query },
  });
  return response.data.results || response.data;
};

// ============================================================================
// PRICING (NOT CACHED - Real-time)
// ============================================================================

export const getPriceEstimate = async (data: PriceEstimateRequest): Promise<PriceEstimateResponse> => {
  const response = await apiClient.post(`${PRICING_BASE}/estimate/`, data);
  return response.data;
};

// ✅ ADDED: Get user's estimates
export const getMyEstimates = async (params?: {
  device_model?: string;
  include_expired?: boolean;
}): Promise<PriceEstimateResponse[]> => {
  const response = await apiClient.get(`${PRICING_BASE}/my-estimates/`, { params });
  return response.data.results || response.data;
};

// ✅ ADDED: Get specific estimate
export const getEstimateDetail = async (estimateId: string): Promise<PriceEstimateResponse> => {
  const response = await apiClient.get(`${PRICING_BASE}/estimate-detail/${estimateId}/`);
  return response.data;
};