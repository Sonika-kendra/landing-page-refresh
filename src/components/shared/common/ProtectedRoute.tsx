import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated, isAuthLoading, openModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openModal('login');
      navigate(-1);
    }
  }, [isAuthLoading, isAuthenticated, openModal, navigate]);

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
