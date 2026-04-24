import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  onRegisterClick?: () => void;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen ${className}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
