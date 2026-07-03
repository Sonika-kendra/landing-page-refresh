import client from './client';
import { API_CONFIG } from './config';

const { base, endpoints: ep } = API_CONFIG.orderForms;

export interface OrderFormAddress {
  address?: string;
  street?:  string;
  city:     string;
  state?:   string;
  zip?:     string;
  postcode?: string;
  country:  string;
  phone?:   string;
}

export interface OrderFormLineItem {
  item_id?:     string;
  name:         string;
  quantity:     number;
  rate:         number;
  description?: string;
}

export interface CreateOrderFormPayload {
  subject?:          string;
  customer_id?:      string;
  customer_name?:    string;
  order_date?:       string;   // YYYY-MM-DD; defaults to today on the server
  billing_address?:  OrderFormAddress;
  shipping_address?: OrderFormAddress;
  line_items:        OrderFormLineItem[];
  notes?:            string;
  currency_code?:    string;
  approval?:         string;
}

export const orderFormsApi = {
  create: (data: CreateOrderFormPayload) =>
    client.post(ep.create, data, undefined, base),

  getOne: (id: string) =>
    client.get(ep.one(id), undefined, undefined, false, base),
};
