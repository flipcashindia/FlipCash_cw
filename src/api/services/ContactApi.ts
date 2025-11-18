// src/services/contactApi.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/contact/submit/`, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to submit form');
    }
    throw new Error('Network error. Please try again.');
  }
};