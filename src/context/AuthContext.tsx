import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { authApi } from '@/api/auth';

const TOKEN_KEY = 'henig-auth-token';
const USER_KEY = 'henig-auth-user';

const PERMISSIONS: Record<string, Record<string, string[]>> = {
  admin:         { users: ['create','read','update','delete','manage'], products: ['create','read','update','delete'], orders: ['create','read','update','delete'], reports: ['read'], settings: ['read','update'], roles: ['assign'] },
  Administrator: { users: ['create','read','update','delete','manage'], products: ['create','read','update','delete'], orders: ['create','read','update','delete'], reports: ['read'], settings: ['read','update'], roles: ['assign'] },
  internalUser:  { products: ['read','update'], orders: ['read','update'], reports: ['read'], users: ['read'] },
  Standard:      { products: ['read','update'], orders: ['read','update'], reports: ['read'], users: ['read'] },
  client:       { products: ['read'], orders: ['create','read'], profile: ['read','update'] },
  user:         { products: ['read'], orders: ['create','read'], profile: ['read','update'] },
  sales:        { products: ['read'], orders: ['create','read','update'], reports: ['read'], profile: ['read','update'] },
  api:          { products: ['read'], orders: ['create','read'] },
};

export interface AuthUser {
  _id: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  companyName?: string;
  email: string;
  role: string;
  scopes?: string[];
  verified: boolean;
  zohoContactId?: string;
  profile?: { name?: string; id?: string };
}

export type ModalInitialView = 'login' | 'register';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isModalOpen: boolean;
  initialView: ModalInitialView;
  redirectAfterLogin: string | null;
  openModal: (view?: ModalInitialView, redirectTo?: string) => void;
  closeModal: () => void;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  waitForLogout: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const logoutPromise = useRef<Promise<void> | null>(null);
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
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  const setAuth = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    // Intercept runs sync (token still in localStorage), so the request carries the auth header.
    // Store the promise so login can await it, preventing the race where logout's tokenVersion
    // increment runs after the new login token is issued and invalidates it.
    const p = authApi.logout().catch(() => {}).then(() => { logoutPromise.current = null; });
    logoutPromise.current = p;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const waitForLogout = (): Promise<void> => logoutPromise.current ?? Promise.resolve();

  const ZOHO_ROLE_MAP: Record<string, string> = { Administrator: 'admin', Standard: 'internalUser' };
  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    const effectiveRole = ZOHO_ROLE_MAP[user.role] ?? user.role;
    return Array.isArray(role) ? role.includes(effectiveRole) : effectiveRole === role;
  };

  const hasPermission = (module: string, action: string) => {
    if (!user) return false;
    const rolePerms = PERMISSIONS[user.role];
    return !!(rolePerms && rolePerms[module]?.includes(action));
  };

  const openModal = useCallback((view: ModalInitialView = 'login', redirectTo?: string) => {
    setInitialView(view);
    setRedirectAfterLogin(redirectTo ?? null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setRedirectAfterLogin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isAuthLoading, isModalOpen, initialView, redirectAfterLogin, openModal, closeModal, setAuth, logout, waitForLogout, hasRole, hasPermission }}
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
