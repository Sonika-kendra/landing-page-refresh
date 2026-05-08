import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.categories;

export const categoriesApi = {
  list: (params?: Record<string, any>) =>
    client.get(ep.all, params, undefined, false, base),

  tree: () =>
    client.get(ep.tree, undefined, undefined, false, base),

  getOne: (id: string) =>
    client.get(ep.one(id), undefined, undefined, false, base),

  create: (data: Record<string, any>) =>
    client.post(ep.create, data, undefined, base),

  update: (id: string, data: Record<string, any>) =>
    client.patch(ep.update(id), data, undefined, base),

  remove: (id: string) =>
    client.delete(ep.delete(id), undefined, undefined, base),
};
