import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated, isAuthLoading, openModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openModal('login', location.pathname + location.search);
    }
  }, [isAuthLoading, isAuthenticated, openModal, location]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!isAuthenticated) return <div className="min-h-screen" />;

  return <>{children}</>;
};

export default ProtectedRoute;
