import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated, isAuthLoading, openModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openModal('login');
      navigate(-1);
    }
  }, [isAuthLoading, isAuthenticated, openModal, navigate]);

  if (isAuthLoading || !isAuthenticated) return <div className="min-h-screen" />;

  return <>{children}</>;
};

export default ProtectedRoute;
