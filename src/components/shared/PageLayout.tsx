import { ReactNode } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

interface PageLayoutProps {
  children: ReactNode;
  onRegisterClick: () => void;
  className?: string;
}

const PageLayout = ({ children, onRegisterClick, className = '' }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header onRegisterClick={onRegisterClick} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
