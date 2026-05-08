export type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  image?: string;
  quantity: number;
  price: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  createdAt: string;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = ['web_order', 'placed', 'processing', 'shipped', 'delivered'];

const sampleAddress: Address = {
  id: 'addr-1', label: 'Office', fullName: 'Henig Customer',
  line1: '21 Hatton Garden', city: 'London', postcode: 'EC1N 8BA', country: 'United Kingdom',
  phone: '+44 20 1234 5678', isDefault: true,
};

export const mockOrders: Order[] = [
  {
    id: 'ord-1001', reference: 'HD-1001', customerName: 'Sophia Reynolds', customerEmail: 'sophia@example.com',
    status: 'placed', subtotal: 4200, tax: 840, total: 5040,
    items: [{ productId: 'prod-1', name: 'Round Solitaire Ring', sku: 'RI12-W', quantity: 1, price: 4200 }],
    shippingAddress: sampleAddress, createdAt: '2026-05-01',
  },
  {
    id: 'ord-1002', reference: 'HD-1002', customerName: 'James Whitfield', customerEmail: 'james@example.com',
    status: 'processing', subtotal: 2150, tax: 430, total: 2580,
    items: [{ productId: 'prod-2', name: 'Diamond Hoop Earrings', sku: 'ER41-W', quantity: 1, price: 2150 }],
    shippingAddress: sampleAddress, createdAt: '2026-05-02',
  },
  {
    id: 'ord-1003', reference: 'HD-1003', customerName: 'Emma Clarke', customerEmail: 'emma@example.com',
    status: 'shipped', subtotal: 1380, tax: 276, total: 1656,
    items: [{ productId: 'prod-3', name: 'Tennis Bracelet', sku: 'BR07-W', quantity: 1, price: 1380 }],
    shippingAddress: sampleAddress, createdAt: '2026-04-28',
  },
  {
    id: 'ord-1004', reference: 'HD-1004', customerName: 'Oliver Bennett', customerEmail: 'oliver@example.com',
    status: 'delivered', subtotal: 980, tax: 196, total: 1176,
    items: [{ productId: 'prod-4', name: 'Pendant Necklace', sku: 'PD15-W', quantity: 1, price: 980 }],
    shippingAddress: sampleAddress, createdAt: '2026-04-20',
  },
  {
    id: 'ord-1005', reference: 'HD-1005', customerName: 'Ava Mitchell', customerEmail: 'ava@example.com',
    status: 'cancelled', subtotal: 540, tax: 108, total: 648,
    items: [{ productId: 'prod-5', name: 'Stud Earrings', sku: 'ER22-W', quantity: 2, price: 270 }],
    shippingAddress: sampleAddress, createdAt: '2026-04-15',
  },
  {
    id: 'ord-1006', reference: 'HD-1006', customerName: 'Liam Carter', customerEmail: 'liam@example.com',
    status: 'web_order', subtotal: 3200, tax: 640, total: 3840,
    items: [{ productId: 'prod-6', name: 'Princess Cut Ring', sku: 'RI19-W', quantity: 1, price: 3200 }],
    shippingAddress: sampleAddress, createdAt: '2026-05-07',
  },
];

export const mockAddresses: Address[] = [
  sampleAddress,
  {
    id: 'addr-2', label: 'Home', fullName: 'Henig Customer',
    line1: '14 Mayfair Crescent', city: 'London', postcode: 'W1J 8AB', country: 'United Kingdom',
    phone: '+44 20 9876 5432',
  },
];
