import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/auth';

const TOKEN_KEY = 'henig-auth-token';
const USER_KEY = 'henig-auth-user';

const PERMISSIONS: Record<string, Record<string, string[]>> = {
  admin:        { users: ['create','read','update','delete','manage'], products: ['create','read','update','delete'], orders: ['create','read','update','delete'], reports: ['read'], settings: ['read','update'], roles: ['assign'] },
  internalUser: { products: ['read','update'], orders: ['read','update'], reports: ['read'], users: ['read'] },
  client:       { products: ['read'], orders: ['create','read'], profile: ['read','update'] },
  user:         { products: ['read'], orders: ['create','read'], profile: ['read','update'] },
  sales:        { products: ['read'], orders: ['create','read','update'], reports: ['read'], profile: ['read','update'] },
  api:          { products: ['read'], orders: ['create','read'] },
};

export interface AuthUser {
  _id: string;
  title?: string;
  firstName: string;
  lastName?: string;
  companyName?: string;
  email: string;
  role: string;
  scopes?: string[];
  verified: boolean;
  zohoContactId?: string;
}

export type ModalInitialView = 'login' | 'register';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isModalOpen: boolean;
  initialView: ModalInitialView;
  openModal: (view?: ModalInitialView) => void;
  closeModal: () => void;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (!token) {
      setIsAuthLoading(false);
      return;
    }
    authApi.getProfile()
      .then(res => {
        const fresh = res.data;
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsAuthLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialView, setInitialView] = useState<ModalInitialView>('login');

  const setAuth = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    // Fire-and-forget: invalidate token server-side before clearing local state
    authApi.logout().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  };

  const hasPermission = (module: string, action: string) => {
    if (!user) return false;
    const rolePerms = PERMISSIONS[user.role];
    return !!(rolePerms && rolePerms[module]?.includes(action));
  };

  const openModal = (view: ModalInitialView = 'login') => {
    setInitialView(view);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isAuthLoading, isModalOpen, initialView, openModal, closeModal, setAuth, logout, hasRole, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
