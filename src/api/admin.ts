import apiClient from './client';
import { API_CONFIG } from './config';

export interface AdminUser {
  _id: string;
  title?: string;
  firstName: string;
  lastName?: string;
  companyName?: string;
  companyWebsite?: string;
  phone?: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  mobileTelephone?: string;
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  city?: string;
  county?: string;
  country?: string;
  scopes?: string[];
  blockExpires?: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  activeUsers: number;
  rejectedUsers: number;
}

export interface Post {
  _id: string;
  title: string;
  date: string;
  src?: string;
  snippet: string;
  content: string;
  status: 'draft' | 'published';
  related?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfig {
  _id: string;
  type: string;
  fields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const { base, endpoints } = API_CONFIG.admin;

export const adminApi = {
  getStats: () =>
    apiClient.get<AdminStats>(endpoints.stats, undefined, undefined, false, base),

  getUsers: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    apiClient.get<{ users: AdminUser[]; total: number; page: number; limit: number; totalPages: number }>(
      endpoints.users,
      params,
      undefined,
      false,
      base
    ),

  getPendingUsers: () =>
    apiClient.get<{ users: AdminUser[] }>(
      endpoints.pendingUsers,
      undefined,
      undefined,
      false,
      base
    ),

  approveUser: (id: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.approveUser(id), undefined, undefined, base),

  rejectUser: (id: string, reason?: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.rejectUser(id), { reason }, undefined, base),

  getUserDetail: (id: string) =>
    apiClient.get<AdminUserDetail>(endpoints.user(id), undefined, undefined, false, base),

  updateUserDetail: (id: string, data: Partial<AdminUserDetail>) =>
    apiClient.patch<AdminUserDetail>(endpoints.updateUser(id), data, undefined, base),

  // ── Posts ──────────────────────────────────────────────────────────────────
  getPosts: () =>
    apiClient.get<Post[]>(
      API_CONFIG.adminPosts.endpoints.all,
      undefined,
      undefined,
      false,
      API_CONFIG.adminPosts.base
    ),

  createPost: (data: Omit<Post, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Post>(
      API_CONFIG.adminPosts.endpoints.create,
      data,
      undefined,
      API_CONFIG.adminPosts.base
    ),

  updatePost: (id: string, data: Partial<Omit<Post, '_id' | 'createdAt' | 'updatedAt'>>) =>
    apiClient.patch<Post>(
      API_CONFIG.adminPosts.endpoints.update(id),
      data,
      undefined,
      API_CONFIG.adminPosts.base
    ),

  deletePost: (id: string) =>
    apiClient.delete<{ message: string }>(
      API_CONFIG.adminPosts.endpoints.delete(id),
      undefined,
      undefined,
      API_CONFIG.adminPosts.base
    ),

  // ── Configs ────────────────────────────────────────────────────────────────
  getConfigs: () =>
    apiClient.get<SiteConfig[]>(
      API_CONFIG.adminConfigs.endpoints.all,
      undefined,
      undefined,
      false,
      API_CONFIG.adminConfigs.base
    ),

  updateConfig: (id: string, data: { fields: Record<string, unknown> }) =>
    apiClient.patch<SiteConfig>(
      API_CONFIG.adminConfigs.endpoints.update(id),
      data,
      undefined,
      API_CONFIG.adminConfigs.base
    ),
};
