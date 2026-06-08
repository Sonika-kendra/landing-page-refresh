import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.products;

export const productsApi = {
  list: (params?: {
    page?: number; per_page?: number; status?: string;
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

  create: (data: Record<string, any>) =>
    client.post(ep.create, data, undefined, base),

  update: (id: string, data: Record<string, any>) =>
    client.patch(ep.update(id), data, undefined, base),

  updateTags: (zohoId: string, tags: { isBestseller?: boolean; isNewArrival?: boolean }) =>
    client.patch(ep.updateTags(zohoId), tags, undefined, base),

  remove: (id: string) =>
    client.delete(ep.delete(id), undefined, undefined, base),
};
