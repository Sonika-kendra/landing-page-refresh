import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.wishlist;

export const wishlistApi = {
  get: () =>
    client.get<{ ok: boolean; wishlist: string[] }>(ep.get, undefined, undefined, false, base),

  add: (productId: string) =>
    client.put<{ ok: boolean }>(ep.add(productId), undefined, undefined, base),

  remove: (productId: string) =>
    client.delete<{ ok: boolean }>(ep.remove(productId), undefined, undefined, base),
};
