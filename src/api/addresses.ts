import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.addresses;

export interface AddressPayload {
  label?: string;
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
}

export const addressesApi = {
  list: () =>
    client.get(ep.all, undefined, undefined, false, base),

  getOne: (id: string) =>
    client.get(ep.one(id), undefined, undefined, false, base),

  create: (data: AddressPayload) =>
    client.post(ep.create, data, undefined, base),

  update: (id: string, data: Partial<AddressPayload>) =>
    client.patch(ep.update(id), data, undefined, base),

  remove: (id: string) =>
    client.delete(ep.delete(id), undefined, undefined, base),

  setDefault: (id: string) =>
    client.post(ep.setDefault(id), {}, undefined, base),

  unsetDefault: (id: string) =>
    client.patch(ep.update(id), { isDefault: false }, undefined, base),
};
