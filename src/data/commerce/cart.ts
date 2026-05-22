import { OrderItem, Address } from './orders';

export interface Cart {
  id: string;
  items: (OrderItem & { image?: string })[];
  shippingAddress?: Address;
  status: 'web_order' | 'placed';
  taxRate: number;
}

export const calcCart = (cart: Cart) => {
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * cart.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};
