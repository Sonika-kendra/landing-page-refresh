import apiClient from './client';
import { API_CONFIG } from './config';

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  pageTitle: string;
}

const { base, endpoints } = API_CONFIG.contact;

export const contactApi = {
  sendMessage: (payload: ContactMessagePayload) =>
    apiClient.post<{ messageSent: boolean }>(endpoints.message, payload, undefined, base),

  subscribeNewsletter: (email: string) =>
    apiClient.post<{ subscribed: boolean }>(endpoints.newsletter, { email }, undefined, base),
};
