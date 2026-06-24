import apiClient from './client';
import { API_CONFIG } from './config';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ProfileUpdatePayload {
  title?: string;
  firstName: string;
  lastName?: string;
  companyName: string;
  phone: string;
  mobileTelephone?: string;
}

export interface RegisterPayload {
  title?: string;
  firstName: string;
  lastName?: string;
  companyName: string;
  companyWebsite?: string;
  phone: string;
  mobileTelephone?: string;
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  city?: string;
  county?: string;
  country?: string;
  tradeReferences?: string;
  email: string;
  password: string;
  acceptTermsAndConditions: boolean;
  accountManagerId?: string;
}

export interface AuthUser {
  _id: string;
  title?: string;
  firstName: string;
  lastName?: string;
  companyName?: string;
  companyWebsite?: string;
  phone?: string;
  email: string;
  role: string;
  scopes?: string[];
  verified: boolean;
}

const { base, endpoints } = API_CONFIG.auth;

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<{ token: string; user: AuthUser }>(endpoints.login, payload, undefined, base),

  register: (payload: RegisterPayload) =>
    apiClient.post<{ user: AuthUser }>(endpoints.register, payload, undefined, base),

  forgotPassword: (email: string) =>
    apiClient.post<{ msg: string; email: string }>(endpoints.forgotPassword, { email }, undefined, base),

  resetPassword: (id: string, password: string) =>
    apiClient.post<{ msg: string }>(endpoints.resetPassword, { id, password }, undefined, base),

  verify: (id: string) =>
    apiClient.post<{ email: string; verified: boolean }>(endpoints.verify, { id }, undefined, base),

  resendVerification: (email: string) =>
    apiClient.post(endpoints.resendVerification, { email }, undefined, base),

  getRefreshToken: () =>
    apiClient.get<{ token: string }>(endpoints.refreshToken, undefined, undefined, false, base),

  getProfile: () =>
    apiClient.get<AuthUser>(endpoints.profile, undefined, undefined, false, base),

  logout: () =>
    apiClient.post<{ message: string }>(endpoints.logout, undefined, undefined, base),

  updateProfile: (data: ProfileUpdatePayload) =>
    apiClient.patch<AuthUser>(
      API_CONFIG.profile.endpoints.update,
      data,
      undefined,
      API_CONFIG.profile.base,
    ),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post<{ msg: string }>(
      API_CONFIG.profile.endpoints.changePassword,
      { oldPassword, newPassword },
      undefined,
      API_CONFIG.profile.base,
    ),

  getAccountManagers: () =>
    apiClient.get<{ ok: boolean; accountManagers: { _id: string; firstName: string; lastName?: string; email: string }[] }>(
      API_CONFIG.users.endpoints.accountManagers,
      undefined,
      undefined,
      false,
      API_CONFIG.users.base,
    ),
};
