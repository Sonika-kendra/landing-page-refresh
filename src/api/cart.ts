import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.cart;

export const cartApi = {
  create: (data: { customer_id?: string; currency_code?: string; notes?: string }) =>
    client.post(ep.create, data, undefined, base),

  get: (id: string) =>
    client.get(ep.get(id), undefined, undefined, false, base),

  update: (id: string, data: Record<string, any>) =>
    client.put(ep.update(id), data, undefined, base),

  removeItem: (id: string, lineItemId: string) =>
    client.delete(ep.removeItem(id, lineItemId), undefined, undefined, base),

  checkout: (id: string, data?: Record<string, any>) =>
    client.post(ep.checkout(id), data ?? {}, undefined, base),

  pushOrderForm: (id: string, data?: Record<string, any>) =>
    client.post(ep.pushOrderForm(id), data ?? {}, undefined, base),

  abandon: (id: string) =>
    client.delete(ep.delete(id), undefined, undefined, base),
};
