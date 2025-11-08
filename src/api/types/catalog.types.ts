/**
 * Catalog Types - Customer App Only
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category: string[];
  logo: string | null;
  description: string;
  country_of_origin: string;
  website: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  model_number: string;
  launch_year: number | null;
  description: string;
  base_price: string;
  specs: Record<string, any>;
  dimensions: string | null;
  weight: string | null;
  storage_options: string[];
  color_options: string[];
  is_active: boolean;
  is_featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceVariant {
  id: string;
  device_model: string;
  storage: string;
  ram: string;
  color: string;
  variant_price: string | null;
  sku: string;
  is_available: boolean;
  stock_quantity: number;
  created_at: string;
}

export interface DeviceImage {
  id: string;
  device_model: string;
  image: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface PriceEstimateRequest {
  device_model: string;
  storage?: string;
  ram?: string;
  color?: string;
  condition_inputs: Record<string, any>;
}

export interface PriceEstimateResponse {
  estimate_id: string;
  estimate_number: string;
  base_price: string;
  deductions: Array<{
    reason: string;
    value: string;
    amount: string;
  }>;
  additions: Array<{
    reason: string;
    value: string;
    amount: string;
  }>;
  total_deductions: string;
  total_additions: string;
  final_price: string;
  price_range_min: string;
  price_range_max: string;
  pricing_rule_version: string;
  expires_at: string;
  created_at: string;
}