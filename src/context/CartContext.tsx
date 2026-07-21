import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { cartApi } from '@/api/cart';
import { useAuth } from './AuthContext';
import { useFavourites } from './FavouritesContext';

const CART_ID_KEY = 'henig-cart-id';

// ─── TESTING: set to true to use dummy cart data without API calls ───────────
const USE_DUMMY_CART = false;

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
  metal?: string;
  size?: string;
  category?: string;
  carat?: string;
}

interface Cart {
  salesorder_id:    string;
  salesorder_number?: string;
  customer_id?:     string;
  customer_name?:   string;
  line_items:       LineItem[];
  sub_total:        number;
  tax_total:        number;
  total:            number;
  currency_code?:   string;
  status?:          string;
}

interface CartContextValue {
  cart: Cart | null;
  cartId: string | null;
  itemCount: number;
  loading: boolean;
  addItem: (item: { item_id: string; name: string; rate: number; quantity?: number; sku?: string; image?: string; metal?: string; size?: string; category?: string; carat?: string }) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { removeFavourite } = useFavourites();
  const [cartId, setCartId] = useState<string | null>(() =>
    USE_DUMMY_CART ? DUMMY_CART.salesorder_id : localStorage.getItem(CART_ID_KEY)
  );
  const [cart, setCart] = useState<Cart | null>(() => USE_DUMMY_CART ? DUMMY_CART : null);
  const [loading, setLoading] = useState(false);

  // Cart mutations are read-modify-write (fetch fresh cart, merge, PUT whole array).
  // Queue them so two calls in flight (e.g. a double-click on "Add to Bag") can't both
  // read stale state and have the second PUT silently overwrite the first's change.
  const mutationQueueRef = useRef<Promise<any>>(Promise.resolve());
  const enqueueMutation = <T,>(fn: () => Promise<T>): Promise<T> => {
    const run = mutationQueueRef.current.then(fn, fn);
    mutationQueueRef.current = run.catch(() => {});
    return run;
  };

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
    const res = await cartApi.create({ customer_id: user?.zohoContactId });
    const id: string = res.data?.cart?.salesorder_id;
    if (!id) throw new Error('Failed to create cart');
    setCartId(id);
    localStorage.setItem(CART_ID_KEY, id);
    return id;
  };

  const recalcTotals = (items: LineItem[]) => {
    const sub_total = items.reduce((s, li) => s + li.rate * li.quantity, 0);
    const tax_total = Math.round(sub_total * 0.2 * 100) / 100;
    return { sub_total, tax_total, total: sub_total + tax_total };
  };

  const addItem = async (item: { item_id: string; name: string; rate: number; quantity?: number; sku?: string; image?: string; metal?: string; size?: string; category?: string; carat?: string }) => {
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
              image: item.image,
              metal: item.metal,
              size: item.size,
              category: item.category,
              carat: item.carat,
            }];
        return { ...prev, ...recalcTotals(newItems), line_items: newItems };
      });
      removeFavourite(item.item_id);
      return;
    }
    return enqueueMutation(async () => {
    setLoading(true);
    try {
      let id = await ensureCart();
      // Fetch fresh cart to avoid stale-state race conditions when items are added quickly
      let freshCart;
      try {
        const freshRes = await cartApi.get(id);
        freshCart = freshRes.data?.cart;
      } catch (err: any) {
        if (err?.response?.status !== 404) throw err;
        // Stale cart id (e.g. it emptied out and was deleted server-side) — start a fresh one
        setCartId(null);
        localStorage.removeItem(CART_ID_KEY);
        id = await ensureCart();
        freshCart = null;
      }

      // If the cart is no longer editable (checked out / voided), discard it and start fresh
      if (freshCart && freshCart.status && freshCart.status !== 'draft') {
        setCart(null);
        setCartId(null);
        localStorage.removeItem(CART_ID_KEY);
        throw new Error('Your cart has expired. Please try again.');
      }

      const currentItems = freshCart?.line_items ?? [];

      // Zoho Inventory requires all-numeric item IDs; static/placeholder IDs (e.g. "prod-1")
      // must be omitted so Zoho treats the line as a custom (non-inventory) item.
      const hasZohoId = /^\d+$/.test(item.item_id);
      const existing = hasZohoId
        ? currentItems.find(li => li.item_id === item.item_id)
        : currentItems.find(li => li.name === item.name);

      const optionalFields = { ...(item.sku && { sku: item.sku }), ...(item.image && { image: item.image }), ...(item.metal && { metal: item.metal }), ...(item.size && { size: item.size }), ...(item.category && { category: item.category }), ...(item.carat && { carat: item.carat }) };
      const newLineItem = hasZohoId
        ? { item_id: item.item_id, name: item.name, rate: item.rate, quantity: item.quantity ?? 1, ...optionalFields }
        : { name: item.name, rate: item.rate, quantity: item.quantity ?? 1, ...optionalFields };

      const newItems = existing
        ? currentItems.map(li => {
            const matches = hasZohoId ? li.item_id === item.item_id : li.name === item.name;
            return matches ? { ...li, quantity: li.quantity + (item.quantity ?? 1) } : li;
          })
        : [...currentItems, newLineItem];

      // Zoho's PUT salesorders/:id requires customer_id in the body
      const updatePayload: Record<string, any> = { line_items: newItems };
      if (freshCart?.customer_id) updatePayload.customer_id = freshCart.customer_id;

      const res = await cartApi.update(id, updatePayload);
      setCart(res.data?.cart ?? null);
      removeFavourite(item.item_id);
    } catch (err: any) {
      console.error('addItem failed:', err);
      // Clear stale cart IDs so the next attempt creates a fresh cart
      if (err?.response?.status === 404 || err?.response?.data?.error === 'Cart not found') {
        setCart(null);
        setCartId(null);
        localStorage.removeItem(CART_ID_KEY);
      }
      throw new Error(err?.response?.data?.error ?? err?.message ?? 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
    });
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
    return enqueueMutation(async () => {
    setLoading(true);
    try {
      const res = await cartApi.removeItem(cartId, lineItemId);
      const updatedCart = res.data?.cart ?? null;
      setCart(updatedCart);
      // Backend deletes the draft cart once it's emptied out — drop the stale local id too
      if (!updatedCart) {
        setCartId(null);
        localStorage.removeItem(CART_ID_KEY);
      }
    } finally {
      setLoading(false);
    }
    });
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
    return enqueueMutation(async () => {
    setLoading(true);
    try {
      // Fetch fresh cart to avoid stale-state race conditions (e.g. checkout firing
      // while a previous quantity update is still in flight)
      const freshRes = await cartApi.get(cartId);
      const freshCart = freshRes.data?.cart;
      const currentItems = freshCart?.line_items ?? cart.line_items;

      const newItems = currentItems.map(li =>
        li.line_item_id === lineItemId ? { ...li, quantity: Math.max(1, quantity) } : li
      );
      const customerId = freshCart?.customer_id ?? cart.customer_id;
      const updatePayload: Record<string, any> = { line_items: newItems };
      if (customerId) updatePayload.customer_id = customerId;
      const res = await cartApi.update(cartId, updatePayload);
      setCart(res.data?.cart ?? null);
    } finally {
      setLoading(false);
    }
    });
  };

  // Detaches the local cart reference only — does not call the abandon API.
  // A checked-out cart is now a real order, so it must never be voided here.
  const clearCart = async () => {
    setCart(null);
    setCartId(null);
    localStorage.removeItem(CART_ID_KEY);
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
