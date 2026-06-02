import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { cartApi } from '@/api/cart';
import { useAuth } from './AuthContext';

const CART_ID_KEY = 'henig-cart-id';

// ─── TESTING: set to true to use dummy cart data without API calls ───────────
const USE_DUMMY_CART = true;

const DUMMY_CART = {
  salesorder_id: 'dummy-cart-001',
  salesorder_number: 'SO-DEMO-001',
  currency_code: 'GBP',
  status: 'web_order',
  line_items: [],
  sub_total: 0,
  tax_total: 0,
  total: 0,
};
// ─────────────────────────────────────────────────────────────────────────────

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
  const [cartId, setCartId] = useState<string | null>(() =>
    USE_DUMMY_CART ? DUMMY_CART.salesorder_id : localStorage.getItem(CART_ID_KEY)
  );
  const [cart, setCart] = useState<Cart | null>(() => USE_DUMMY_CART ? DUMMY_CART : null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async (id: string) => {
    if (USE_DUMMY_CART) return;
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
    if (USE_DUMMY_CART) return;
    if (cartId) fetchCart(cartId);
  }, [cartId, fetchCart]);

  const ensureCart = async (): Promise<string> => {
    if (USE_DUMMY_CART) return DUMMY_CART.salesorder_id;
    if (cartId) return cartId;
    const res = await cartApi.create({ customer_id: user?._id });
    const id: string = res.data.cart.salesorder_id;
    setCartId(id);
    localStorage.setItem(CART_ID_KEY, id);
    return id;
  };

  const recalcTotals = (items: LineItem[]) => {
    const sub_total = items.reduce((s, li) => s + li.rate * li.quantity, 0);
    const tax_total = Math.round(sub_total * 0.2);
    return { sub_total, tax_total, total: sub_total + tax_total };
  };

  const addItem = async (item: { item_id: string; name: string; rate: number; quantity?: number; sku?: string }) => {
    if (USE_DUMMY_CART) {
      const qty = item.quantity ?? 1;
      setCart(prev => {
        if (!prev) return prev;
        const existing = prev.line_items.find(li => li.item_id === item.item_id || li.name === item.name);
        const newItems = existing
          ? prev.line_items.map(li =>
              (li.item_id === item.item_id || li.name === item.name)
                ? { ...li, quantity: li.quantity + qty, amount: li.rate * (li.quantity + qty) }
                : li
            )
          : [...prev.line_items, {
              line_item_id: `li-${prev.line_items.length + 1}`,
              item_id: item.item_id,
              name: item.name,
              rate: item.rate,
              amount: item.rate * qty,
              quantity: qty,
              sku: item.sku,
            }];
        return { ...prev, ...recalcTotals(newItems), line_items: newItems };
      });
      return;
    }
    setLoading(true);
    try {
      const id = await ensureCart();
      const currentItems = cart?.line_items ?? [];

      // Zoho Inventory requires all-numeric item IDs; static/placeholder IDs (e.g. "prod-1")
      // must be omitted so Zoho treats the line as a custom (non-inventory) item.
      const hasZohoId = /^\d+$/.test(item.item_id);
      const existing = hasZohoId
        ? currentItems.find(li => li.item_id === item.item_id)
        : currentItems.find(li => li.name === item.name);

      const newLineItem = hasZohoId
        ? { item_id: item.item_id, name: item.name, rate: item.rate, quantity: item.quantity ?? 1 }
        : { name: item.name, rate: item.rate, quantity: item.quantity ?? 1 };

      const newItems = existing
        ? currentItems.map(li => {
            const matches = hasZohoId ? li.item_id === item.item_id : li.name === item.name;
            return matches ? { ...li, quantity: li.quantity + (item.quantity ?? 1) } : li;
          })
        : [...currentItems, newLineItem];

      const res = await cartApi.update(id, { line_items: newItems });
      setCart(res.data?.cart ?? null);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (USE_DUMMY_CART) {
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.line_items.filter(li => li.line_item_id !== lineItemId);
        return { ...prev, ...recalcTotals(newItems), line_items: newItems };
      });
      return;
    }
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
    if (USE_DUMMY_CART) {
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.line_items.map(li =>
          li.line_item_id === lineItemId
            ? { ...li, quantity: Math.max(1, quantity), amount: li.rate * Math.max(1, quantity) }
            : li
        );
        return { ...prev, ...recalcTotals(newItems), line_items: newItems };
      });
      return;
    }
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
    if (USE_DUMMY_CART || !cartId) return;
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
