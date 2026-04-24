import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/auth';

const TOKEN_KEY = 'henig-auth-token';
const USER_KEY = 'henig-auth-user';

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
}

export type ModalInitialView = 'login' | 'register';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  initialView: ModalInitialView;
  openModal: (view?: ModalInitialView) => void;
  closeModal: () => void;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
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
  useEffect(() => {
    if (!token) return;
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
      });
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const openModal = (view: ModalInitialView = 'login') => {
    setInitialView(view);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isModalOpen, initialView, openModal, closeModal, setAuth, logout }}
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
