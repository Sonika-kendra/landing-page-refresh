import { OrderItem, Address, mockAddresses } from './orders';
import imgRing from '@/assets/shop/product/RI12-W (1).jpg';
import imgEarrings from '@/assets/shop/product/ER41-W (2).jpg';

export interface Cart {
  id: string;
  items: (OrderItem & { image?: string })[];
  shippingAddress?: Address;
  status: 'web_order' | 'placed';
  taxRate: number;
}

export const mockCart: Cart = {
  id: 'cart-1',
  status: 'web_order',
  taxRate: 0.2,
  shippingAddress: mockAddresses[0],
  items: [
    { productId: 'prod-1', name: 'Round Solitaire Ring', sku: 'RI12-W', quantity: 1, price: 4200, image: imgRing },
    { productId: 'prod-2', name: 'Diamond Hoop Earrings', sku: 'ER41-W', quantity: 2, price: 2150, image: imgEarrings },
  ],
};

export const calcCart = (cart: Cart) => {
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * cart.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};
