import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.orders;

export const ordersApi = {
  list: (params?: { page?: number; per_page?: number; status?: string; customer_id?: string }) =>
    client.get(ep.all, params, undefined, false, base),

  getOne: (id: string) =>
    client.get(ep.one(id), undefined, undefined, false, base),

  create: (data: Record<string, any>) =>
    client.post(ep.create, data, undefined, base),

  update: (id: string, data: Record<string, any>) =>
    client.patch(ep.update(id), data, undefined, base),

  confirm: (id: string, note?: string) =>
    client.post(ep.confirm(id), { note }, undefined, base),

  updateStatus: (id: string, status: string, extras?: { note?: string; trackingNumber?: string; carrier?: string }) =>
    client.patch(ep.updateStatus(id), { status, ...extras }, undefined, base),

  cancel: (id: string) =>
    client.delete(ep.cancel(id), undefined, undefined, base),
};
