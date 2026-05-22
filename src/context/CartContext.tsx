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
  line_items: [
    {
      line_item_id: 'li-001',
      item_id: '111001',
      name: 'Diamond Solitaire Ring — 1.2ct Round Brilliant',
      description: '18ct White Gold, D/VS1',
      quantity: 1,
      rate: 4850,
      amount: 4850,
      sku: 'DR-WG-1200-D-VS1',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80',
    },
    {
      line_item_id: 'li-002',
      item_id: '111002',
      name: 'Princess Cut Tennis Bracelet',
      description: '18ct Yellow Gold, 3.5ct Total Weight',
      quantity: 1,
      rate: 2990,
      amount: 2990,
      sku: 'TB-YG-350-FG-VS',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&q=80',
    },
    {
      line_item_id: 'li-003',
      item_id: '111003',
      name: 'Emerald Cut Drop Earrings',
      description: '18ct Rose Gold, 0.8ct each',
      quantity: 2,
      rate: 1650,
      amount: 3300,
      sku: 'EE-RG-080-G-SI1',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80',
    },
  ],
  sub_total: 11140,
  tax_total: 2228,
  total: 13368,
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

  const addItem = async (item: { item_id: string; name: string; rate: number; quantity?: number; sku?: string }) => {
    if (USE_DUMMY_CART) return;
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
    if (USE_DUMMY_CART || !cartId) return;
    setLoading(true);
    try {
      const res = await cartApi.removeItem(cartId, lineItemId);
      setCart(res.data?.cart ?? null);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (USE_DUMMY_CART || !cartId || !cart) return;
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
