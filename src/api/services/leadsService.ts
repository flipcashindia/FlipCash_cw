/**
 * Leads Service (NO CACHE - Real-time)
 * Backend: /api/v1/leads/
 * ✅ CORRECTED: All IDs to string, endpoints fixed, new functions added
 */

import apiClient from '../client/apiClient';
import type { 
  Lead, CreateLeadRequest, LeadStats, LeadOffer, ChatMessage 
} from '../types/leads.types';

const LEADS_BASE = '/leads';

// ============================================================================
// LEADS CRUD
// ============================================================================

export const createLead = async (data: CreateLeadRequest): Promise<Lead> => {
  const response = await apiClient.post(`${LEADS_BASE}/leads/`, data);
  return response.data;
};

export const getLeads = async (params?: {
  status?: string;
  search?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
}): Promise<{ results: Lead[]; count: number; next: string | null; previous: string | null }> => {
  const response = await apiClient.get(`${LEADS_BASE}/leads/`, { params });
  return response.data.results || response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const getLead = async (id: string): Promise<Lead> => {
  const response = await apiClient.get(`${LEADS_BASE}/leads/${id}/`);
  return response.data.results || response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const updateLead = async (id: string, data: Partial<CreateLeadRequest>): Promise<Lead> => {
  const response = await apiClient.patch(`${LEADS_BASE}/${id}/`, data);
  return response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const cancelLead = async (id: string, reason: string): Promise<Lead> => {
  const response = await apiClient.post(`${LEADS_BASE}/${id}/cancel/`, { 
    cancellation_reason: reason // ✅ CORRECTED: backend expects 'cancellation_reason'
  });
  return response.data;
};

// ✅ ADDED: Get my leads (customer's leads)
export const getMyLeads = async (params?: {
  status?: string;
  ordering?: string;
}): Promise<{ results: Lead[]; count: number }> => {
  const response = await apiClient.get(`${LEADS_BASE}/leads/my-leads/`, { params });
  return response.data;
};

export const getLeadStats = async (): Promise<LeadStats> => {
  const response = await apiClient.get(`${LEADS_BASE}/stats/`);
  return response.data;
};

// ✅ CORRECTED: id changed from number to string (UUID)
export const getStatusHistory = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(`${LEADS_BASE}/${id}/status-logs/`); // ✅ CORRECTED: endpoint name
  return response.data.results || response.data;
};

// ============================================================================
// OFFERS
// ============================================================================

// ✅ ADDED: Get offers for a lead
export const getLeadOffers = async (leadId: string): Promise<LeadOffer[]> => {
  const response = await apiClient.get(`${LEADS_BASE}/${leadId}/offers/`);
  return response.data.results || response.data;
};

// ✅ ADDED: Accept offer
export const acceptOffer = async (leadId: string, offerId: string, response_message?: string): Promise<LeadOffer> => {
  const res = await apiClient.post(`${LEADS_BASE}/${leadId}/offers/${offerId}/accept/`, {
    response_message
  });
  return res.data;
};

// ✅ ADDED: Reject offer
export const rejectOffer = async (leadId: string, offerId: string, response_message?: string): Promise<LeadOffer> => {
  const res = await apiClient.post(`${LEADS_BASE}/${leadId}/offers/${offerId}/reject/`, {
    response_message
  });
  return res.data;
};

// ✅ ADDED: Counter offer
export const counterOffer = async (leadId: string, offerId: string, counter_amount: string, response_message?: string): Promise<LeadOffer> => {
  const res = await apiClient.post(`${LEADS_BASE}/${leadId}/offers/${offerId}/counter/`, {
    counter_amount,
    response_message
  });
  return res.data;
};

// ============================================================================
// CHAT/MESSAGES
// ============================================================================

// ✅ ADDED: Get chat messages for a lead
export const getLeadMessages = async (leadId: string): Promise<ChatMessage[]> => {
  const response = await apiClient.get(`${LEADS_BASE}/${leadId}/messages/`);
  return response.data.results || response.data;
};

// ✅ ADDED: Send message
export const sendMessage = async (leadId: string, message: string, attachment?: File): Promise<ChatMessage> => {
  const formData = new FormData();
  formData.append('message', message);
  if (attachment) {
    formData.append('attachment', attachment);
  }

  const response = await apiClient.post(`${LEADS_BASE}/${leadId}/messages/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ✅ ADDED: Mark messages as read
export const markMessagesRead = async (leadId: string): Promise<void> => {
  await apiClient.post(`${LEADS_BASE}/${leadId}/messages/mark-read/`);
};

// ============================================================================
// TRACKING
// ============================================================================

// ✅ ADDED: Get lead timeline/activity
export const getLeadTimeline = async (leadId: string): Promise<any[]> => {
  const response = await apiClient.get(`${LEADS_BASE}/${leadId}/timeline/`);
  return response.data.results || response.data;
};