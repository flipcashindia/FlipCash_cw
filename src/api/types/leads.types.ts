/**
 * Leads Types - Customer App Only
 */

export interface DeviceModelSummary {
  id: string;
  name: string;
  base_price: string;
  brand_name: string;
  category_name: string;
  brand_logo: string;
  thumbnail: string;
  storage_options: string[];
  color_options: string[];
  slug: string;
  model_number: string;
  launch_year: number | null;
  is_featured: boolean;
}

export interface Lead {
  id: string;
  lead_number: string;
  device_name: string;
  brand_name: string;
  device_model: DeviceModelSummary; // Nested device model details
  storage: string;
  color: string;
  estimated_price: string;
  final_price: string | null;
  pricing_version?: string;
  pickup_date_display?: string;
  preferred_date: string;
  preferred_time_slot: string;
  status: 'booked' | 'partner_assigned' | 'en_route' | 'checked_in' | 'inspecting' | 
          'offer_made' | 'negotiating' | 'accepted' | 'payment_processing' | 
          'completed' | 'cancelled' | 'disputed' | 'expired';
  status_display: string;
  assigned_partner_name?: string | null | undefined;
  is_flagged: boolean;
  is_urgent: boolean;
  days_old?: number;
  created_at: string;
  updated_at?: string;
  
  // Additional fields from full lead object
  user?: string;
  imei_primary?: string;
  imei_secondary?: string | null;
  condition_responses?: Record<string, any>;
  device_photos?: string[];
  ram?: string;
  pickup_address?: string;
  actual_pickup_date?: string | null;
  assigned_partner?: string | null;
  assigned_at?: string | null;
  claim_fee_deducted?: string | null;
  flagged_reason?: string;
  priority_score?: number;
  customer_notes?: string;
  internal_notes?: string;
  cancellation_reason?: string;
  rejection_reason?: string;
  expires_at?: string;
  booked_at?: string;
  completed_at?: string | null;
}

export interface CreateLeadRequest {
  estimate_id: string;
  pickup_address_id: string;
  preferred_date: string;
  time_slot: string;
  special_instructions?: string;
}

export interface LeadStats {
  total_leads: number;
  active_leads: number;
  completed_leads: number;
  cancelled_leads: number;
  total_earnings: string;
  average_price: string;
}

export interface LeadOffer {
  id: string;
  lead: string;
  partner: string;
  system_calculated_price: string;
  partner_offered_price: string;
  price_deviation_percentage: number;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
  customer_response: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  responded_at: string | null;
}

export interface ChatMessage {
  id: string;
  lead: string;
  sender: string;
  message: string;
  message_type: 'text' | 'image' | 'system';
  attachment_url: string | null;
  is_read: boolean;
  sent_at: string;
  read_at: string | null;
}