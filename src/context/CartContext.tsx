import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { cartApi } from '@/api/cart';
import { useAuth } from './AuthContext';

const CART_ID_KEY = 'henig-cart-id';

interface LineItem {
  line_item_id: string;
  item_id: string;
  name: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
  sku?: string;
  image?: string;
}

interface Cart {
  salesorder_id: string;
  salesorder_number?: string;
  line_items: LineItem[];
  sub_total: number;
  tax_total: number;
  total: number;
  currency_code?: string;
  status?: string;
}

interface CartContextValue {
  cart: Cart | null;
  cartId: string | null;
  itemCount: number;
  loading: boolean;
  addItem: (item: { item_id: string; name: string; rate: number; quantity?: number; sku?: string }) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartId, setCartId] = useState<string | null>(() => localStorage.getItem(CART_ID_KEY));
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async (id: string) => {
    try {
      const res = await cartApi.get(id);
      setCart(res.data?.cart ?? null);
    } catch {
      // Cart may be gone (voided/checked out) — clear local ref
      setCart(null);
      setCartId(null);
      localStorage.removeItem(CART_ID_KEY);
    }
  }, []);

  useEffect(() => {
    if (cartId) fetchCart(cartId);
  }, [cartId, fetchCart]);

  const ensureCart = async (): Promise<string> => {
    if (cartId) return cartId;
    const res = await cartApi.create({ customer_id: user?._id });
    const id: string = res.data.cart.salesorder_id;
    setCartId(id);
    localStorage.setItem(CART_ID_KEY, id);
    return id;
  };

  const addItem = async (item: { item_id: string; name: string; rate: number; quantity?: number; sku?: string }) => {
    setLoading(true);
    try {
      const id = await ensureCart();
      const currentItems = cart?.line_items ?? [];
      const existing = currentItems.find(li => li.item_id === item.item_id);
      const newItems = existing
        ? currentItems.map(li =>
            li.item_id === item.item_id
              ? { ...li, quantity: li.quantity + (item.quantity ?? 1) }
              : li
          )
        : [...currentItems, { item_id: item.item_id, name: item.name, rate: item.rate, quantity: item.quantity ?? 1 }];

      const res = await cartApi.update(id, { line_items: newItems });
      setCart(res.data?.cart ?? null);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const res = await cartApi.removeItem(cartId, lineItemId);
      setCart(res.data?.cart ?? null);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (!cartId || !cart) return;
    setLoading(true);
    try {
      const newItems = cart.line_items.map(li =>
        li.line_item_id === lineItemId ? { ...li, quantity: Math.max(1, quantity) } : li
      );
      const res = await cartApi.update(cartId, { line_items: newItems });
      setCart(res.data?.cart ?? null);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cartId) return;
    try {
      await cartApi.abandon(cartId);
    } finally {
      setCart(null);
      setCartId(null);
      localStorage.removeItem(CART_ID_KEY);
    }
  };

  const refreshCart = async () => {
    if (cartId) await fetchCart(cartId);
  };

  const itemCount = cart?.line_items?.reduce((sum, li) => sum + li.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, cartId, itemCount, loading, addItem, removeItem, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
