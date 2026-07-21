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
  status: 'draft' | 'pending' | 'approved' | 'inactive' | 'blocked' | 'rejected';
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
  draftUsers: number;
  pendingApprovals: number;
  activeUsers: number;
  rejectedUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  zohoOrderFormErrors: number;
  zohoSyncErrors: number;
  zohoContactsCount: number;
  totalOrders: number;
  activeCarts: number;
  lowStockCount: number;
}

export interface Post {
  _id: string;
  title: string;
  date: string;
  src?: string;
  images?: string[];
  snippet: string;
  content: string;
  design?: object;
  status: 'draft' | 'published';
  related?: string[];
  buttons?: { label: string; url: string }[];
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

export interface EmailTemplateDoc {
  _id: string;
  name: string;
  subject: string;
  recipients: string[];
  dynamicRecipient?: boolean;
  html: string;
  design: object | null;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'draft' | 'pending' | 'approved' | 'inactive' | 'blocked' | 'rejected';

export interface UserStatusLogEntry {
  _id: string;
  userId: string;
  fromStatus?: string;
  toStatus: string;
  action: string;
  reason?: string;
  changedBy?: { _id: string; firstName: string; lastName?: string; email: string };
  createdAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface ZohoStatus {
  ok: boolean;
  configured: boolean;
  modules: string[];
}

export interface ZohoScheduleEntry {
  cron: string;
  description: string;
  nextRun: string;
}

export interface ZohoSchedule {
  ok: boolean;
  dailySync: ZohoScheduleEntry;
}

export interface FilterConfigStatus {
  ok: boolean;
  exists: boolean;
  summary: Record<string, number> | null;
  updatedAt: string | null;
}

export interface FilterConfigRebuildResult {
  ok: boolean;
  message: string;
  summary: Record<string, number>;
}

export interface ZohoSyncLog {
  _id: string;
  module: string;
  zohoId?: string;
  mongoId?: string;
  direction: 'zoho_to_mongo' | 'mongo_to_zoho';
  action: 'create' | 'update' | 'delete' | 'skip' | 'sync';
  status: 'success' | 'error';
  error?: string;
  meta?: { synced: number; errors: number; total: number };
  createdAt: string;
}

export interface StaffUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  profile?: { name?: string; id?: string };
  createdAt?: string;
}

export interface ZohoSyncResult {
  ok: boolean;
  synced?: number;
  errors?: number;
  total?: number;
  message?: string;
}

export interface ZohoContactPerson {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimaryContact?: boolean;
}

export interface ZohoContactRow {
  _id: string;
  _zohoId?: string;
  name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  contactPersons?: ZohoContactPerson[];
  [key: string]: unknown;
}

export interface ZohoInventoryItem {
  item_id: string;
  name: string;
  sku?: string;
  description?: string;
  rate?: number;
  purchase_rate?: number;
  status?: string;
  item_type?: string;
  unit?: string;
  category_id?: string;
  category_name?: string;
  image_name?: string;
  image_document_id?: string;
  last_modified_time?: string;
  [key: string]: unknown;
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

  getStaff: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<{ staff: StaffUser[]; total: number; page: number; limit: number; totalPages: number }>(
      endpoints.staff,
      params,
      undefined,
      false,
      base
    ),

  getZohoContacts: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ contacts: ZohoContactRow[]; total: number; page: number; limit: number; totalPages: number }>(
      endpoints.zohoContacts,
      params,
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

  createPost: (data: FormData) =>
    apiClient.post<Post>(
      API_CONFIG.adminPosts.endpoints.create,
      data,
      undefined,
      API_CONFIG.adminPosts.base
    ),

  updatePost: (id: string, data: FormData) =>
    apiClient.patch<Post>(
      API_CONFIG.adminPosts.endpoints.update(id),
      data,
      undefined,
      API_CONFIG.adminPosts.base
    ),

  uploadPostImage: (data: FormData) =>
    apiClient.post<{ url: string }>(
      API_CONFIG.adminPosts.endpoints.uploadImage,
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

  updateConfig: (id: string, data: { type?: string; fields: Record<string, unknown> }) =>
    apiClient.patch<SiteConfig>(
      API_CONFIG.adminConfigs.endpoints.update(id),
      data,
      undefined,
      API_CONFIG.adminConfigs.base
    ),

  createConfig: (data: { type: string; fields: Record<string, unknown> }) =>
    apiClient.post<SiteConfig>(
      API_CONFIG.adminConfigs.endpoints.create,
      data,
      undefined,
      API_CONFIG.adminConfigs.base
    ),

  getAnnouncementBar: () =>
    apiClient.get<SiteConfig | null>(
      API_CONFIG.adminConfigs.endpoints.announcementBar,
      undefined,
      undefined,
      false,
      API_CONFIG.adminConfigs.base
    ),

  getAllEmailTemplates: () =>
    apiClient.get<EmailTemplateDoc[]>(
      API_CONFIG.adminEmailTemplates.endpoints.all,
      undefined,
      undefined,
      false,
      API_CONFIG.adminEmailTemplates.base
    ),

  getEmailTemplateById: (id: string) =>
    apiClient.get<EmailTemplateDoc>(
      API_CONFIG.adminEmailTemplates.endpoints.byId(id),
      undefined,
      undefined,
      false,
      API_CONFIG.adminEmailTemplates.base
    ),

  createEmailTemplate: (name = 'New Template') =>
    apiClient.post<EmailTemplateDoc>(
      API_CONFIG.adminEmailTemplates.endpoints.create,
      { name },
      undefined,
      API_CONFIG.adminEmailTemplates.base
    ),

  saveEmailTemplate: (id: string, design: object, html: string, name?: string, subject?: string, recipients?: string[], dynamicRecipient?: boolean) =>
    apiClient.patch<EmailTemplateDoc>(
      API_CONFIG.adminEmailTemplates.endpoints.byId(id),
      {
        ...(name !== undefined && { name }),
        ...(subject !== undefined && { subject }),
        ...(recipients !== undefined && { recipients }),
        ...(dynamicRecipient !== undefined && { dynamicRecipient }),
        design,
        html,
      },
      undefined,
      API_CONFIG.adminEmailTemplates.base
    ),

  deleteEmailTemplate: (id: string) =>
    apiClient.delete<{ message: string }>(
      API_CONFIG.adminEmailTemplates.endpoints.byId(id),
      undefined,
      undefined,
      API_CONFIG.adminEmailTemplates.base
    ),

  previewEmailTemplate: (id: string, tags?: Record<string, string>) =>
    apiClient.post<{ subject: string; html: string }>(
      API_CONFIG.adminEmailTemplates.endpoints.preview(id),
      { tags },
      undefined,
      API_CONFIG.adminEmailTemplates.base
    ),

  sendTestEmailTemplate: (id: string, email: string, tags?: Record<string, string>) =>
    apiClient.post<{ sent: boolean }>(
      API_CONFIG.adminEmailTemplates.endpoints.sendTest(id),
      { email, tags },
      undefined,
      API_CONFIG.adminEmailTemplates.base
    ),

  deleteConfig: (id: string) =>
    apiClient.delete<{ message: string }>(
      API_CONFIG.adminConfigs.endpoints.delete(id),
      undefined,
      undefined,
      API_CONFIG.adminConfigs.base
    ),

  // ── User status actions ────────────────────────────────────────────────────
  createAdminUser: (data: CreateUserPayload) =>
    apiClient.post<AdminUser>(
      '/users',
      data,
      undefined,
      API_CONFIG.admin.base
    ),

  blockUser: (id: string, reason?: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.blockUser(id), { reason }, undefined, base),

  unblockUser: (id: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.unblockUser(id), undefined, undefined, base),

  activateUser: (id: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.activateUser(id), undefined, undefined, base),

  deactivateUser: (id: string, reason?: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.deactivateUser(id), { reason }, undefined, base),

  deleteUser: (id: string) =>
    apiClient.delete<{ message: string }>(endpoints.deleteUser(id), undefined, undefined, base),

  getStatusLog: (id: string) =>
    apiClient.get<{ logs: UserStatusLogEntry[] }>(endpoints.statusLog(id), undefined, undefined, false, base),

  assignRole: (id: string, role: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.assignRole(id), { role }, undefined, base),

  assignScopes: (id: string, scopes: string[]) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.assignScopes(id), { scopes }, undefined, base),

  getDraftUsers: () =>
    apiClient.get<{ users: AdminUser[] }>(endpoints.draftUsers, undefined, undefined, false, base),

  submitDraftUser: (id: string) =>
    apiClient.patch<{ user: AdminUser }>(endpoints.submitDraftUser(id), undefined, undefined, base),

  // ── Zoho ───────────────────────────────────────────────────────────────────
  getZohoStatus: () =>
    apiClient.get<ZohoStatus>(
      API_CONFIG.adminZoho.endpoints.status,
      undefined,
      undefined,
      false,
      API_CONFIG.adminZoho.base
    ),

  getZohoSchedule: () =>
    apiClient.get<ZohoSchedule>(
      API_CONFIG.adminZoho.endpoints.schedule,
      undefined,
      undefined,
      false,
      API_CONFIG.adminZoho.base
    ),

  getZohoLogs: (params?: { module?: string; direction?: string; status?: string }) =>
    apiClient.get<{ ok: boolean; logs: ZohoSyncLog[] }>(
      API_CONFIG.adminZoho.endpoints.logs,
      params,
      undefined,
      false,
      API_CONFIG.adminZoho.base
    ),

  zohoSyncAll: () =>
    apiClient.post<ZohoSyncResult>(
      API_CONFIG.adminZoho.endpoints.syncAll,
      undefined,
      undefined,
      API_CONFIG.adminZoho.base
    ),

  zohoSyncModule: (module: string) =>
    apiClient.post<ZohoSyncResult>(
      API_CONFIG.adminZoho.endpoints.syncModule(module),
      undefined,
      undefined,
      API_CONFIG.adminZoho.base
    ),

  zohoTriggerProductsSync: () =>
    apiClient.post<{ ok: boolean; message: string }>(
      API_CONFIG.adminZoho.endpoints.triggerProductsSync,
      undefined,
      undefined,
      API_CONFIG.adminZoho.base
    ),

  zohoSyncDirectory: () =>
    apiClient.post<ZohoSyncResult>(
      API_CONFIG.adminZoho.endpoints.syncDirectory,
      undefined,
      undefined,
      API_CONFIG.adminZoho.base
    ),

  getZohoInventoryItems: (params?: { search?: string; category_id?: string; status?: string }) =>
    apiClient.get<{ ok: boolean; total: number; items: ZohoInventoryItem[] }>(
      API_CONFIG.adminZoho.endpoints.inventoryItems,
      params,
      undefined,
      false,
      API_CONFIG.adminZoho.base
    ),

  // ── Filter Config ──────────────────────────────────────────────────────────
  getFilterConfigStatus: () =>
    apiClient.get<FilterConfigStatus>(
      API_CONFIG.adminFilterConfig.endpoints.status,
      undefined,
      undefined,
      false,
      API_CONFIG.adminFilterConfig.base
    ),

  rebuildFilterConfig: () =>
    apiClient.post<FilterConfigRebuildResult>(
      API_CONFIG.adminFilterConfig.endpoints.rebuild,
      undefined,
      undefined,
      API_CONFIG.adminFilterConfig.base
    ),

  getDiamondsFilterConfigStatus: () =>
    apiClient.get<FilterConfigStatus>(
      API_CONFIG.adminFilterConfig.endpoints.diamondsStatus,
      undefined,
      undefined,
      false,
      API_CONFIG.adminFilterConfig.base
    ),

  rebuildDiamondsFilterConfig: () =>
    apiClient.post<FilterConfigRebuildResult>(
      API_CONFIG.adminFilterConfig.endpoints.diamondsRebuild,
      undefined,
      undefined,
      API_CONFIG.adminFilterConfig.base
    ),
};
