import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated, isAuthLoading, openModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openModal('login');
    }
  }, [isAuthLoading, isAuthenticated, openModal]);

  if (isAuthLoading) return <div className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location }} />;

  return <>{children}</>;
};

export default ProtectedRoute;
