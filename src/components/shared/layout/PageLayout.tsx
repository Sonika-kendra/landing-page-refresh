import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';

interface PageLayoutProps {
  children: ReactNode;
  onRegisterClick?: () => void;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  const { isModalOpen } = useAuth();
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setBlocking(true);
    } else {
      // hold through exit animation (~300ms spring)
      const t = setTimeout(() => setBlocking(false), 350);
      return () => clearTimeout(t);
    }
  }, [isModalOpen]);

  return (
    <div className={`min-h-screen ${className}${blocking ? ' pointer-events-none' : ''}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
