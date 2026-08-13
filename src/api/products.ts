import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.products;

export const productsApi = {
  list: (params?: {
    page?: number; per_page?: number; status?: string; cf_status?: string;
    category_id?: string; category?: string;
    sub_category?: string; cf_sub_category?: string; cf_sub_category_type?: string;
    metal?: string; shape?: string;
    stock_type?: string; in_stock?: string;
    price_min?: number; price_max?: number;
    search?: string; sort?: string; currency?: string;
    bestseller?: boolean; new_arrival?: boolean;
    certificate?: string; ring_size?: string;
    carat_min?: number; carat_max?: number;
  }) =>
    client.get(ep.all, params, undefined, false, base),

  listDiamonds: (params?: {
    page?: number; per_page?: number; status?: string;
    category?: string; cf_stock_sub_category?: string; shape?: string;
    stock_type?: string;
    price_min?: number; price_max?: number;
    search?: string; sort?: string; currency?: string;
    certificate?: string;
    carat_min?: number; carat_max?: number;
    colour?: string; clarity?: string; cut?: string; fluorescence?: string;
    polish?: string; symmetry?: string;
    depth_min?: number; depth_max?: number;
    table_min?: number; table_max?: number;
  }) =>
    client.get(ep.diamonds, params, undefined, true, base),

  getCurrencies: () =>
    client.get<{ ok: boolean; currencies: { currency_code: string; currency_symbol: string; currency_name: string; is_base_currency: boolean }[] }>(ep.currencies, undefined, undefined, false, base),

  getCurrency: () =>
    client.get<{ ok: boolean; currency_symbol: string; currency_code: string }>(ep.currency, undefined, undefined, false, base),

  getAllFilterData: (params?: { category?: string }) =>
    client.get<{
      ok: boolean;
      subcategories: Record<string, string[]>;
      metals: string[];
      shapes: string[];
      stockTypes: string[];
      caratValues: number[];
      ringSizes: string[];
      certificates: string[];
    }>(ep.allFilterData, params, undefined, false, base),

  getSubcategories: (params?: { category?: string }) =>
    client.get<{ ok: boolean; subcategories: Record<string, string[]> }>(ep.subcategories, params, undefined, false, base),

  getMetals: (params?: { category?: string }) =>
    client.get<{ ok: boolean; metals: string[] }>(ep.metals, params, undefined, false, base),

  getFilterOptions: (params?: { category?: string }) =>
    client.get<{
      ok: boolean;
      shapes: string[];
      stockTypes: string[];
      caratValues: number[];
      ringSizes: string[];
      certificates: string[];
    }>(ep.filterOptions, params, undefined, false, base),

  getOne: (id: string) =>
    client.get(ep.one(id), undefined, undefined, false, base),

  getOneDiamond: (id: string) =>
    client.get(ep.oneDiamond(id), undefined, undefined, false, base),

  askImageVideo: (id: string) =>
    client.post(ep.askImageVideo(id), undefined, undefined, base),

  getByName: (name: string) =>
    client.get(ep.byName, { name }, undefined, false, base),

  create: (data: Record<string, any>) =>
    client.post(ep.create, data, undefined, base),

  update: (id: string, data: Record<string, any>) =>
    client.patch(ep.update(id), data, undefined, base),

  updateTags: (zohoId: string, tags: { isBestseller?: boolean; isNewArrival?: boolean }) =>
    client.patch(ep.updateTags(zohoId), tags, undefined, base),

  remove: (id: string) =>
    client.delete(ep.delete(id), undefined, undefined, base),

  uploadImage: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('src', file);
    return client.post<{ ok: boolean; src: string }>(ep.uploadImage(id), fd, undefined, base);
  },

  deleteImage: (id: string) =>
    client.delete<{ ok: boolean }>(ep.deleteImage(id), undefined, undefined, base),

  getMedia: (id: string) =>
    client.get<{ ok: boolean; thumbnail: string | null; images: string[]; video: string | null }>(
      ep.media(id), undefined, undefined, false, base
    ),
};
