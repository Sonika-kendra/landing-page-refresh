import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const CTASection = () => {
  const { openModal } = useAuth();

  return (
    <section className="py-24 bg-accent text-center">
      <h2 className="henig-heading-section mb-6">Register With Us</h2>
      <Button className="btn-henig-gold" onClick={() => openModal('register')}>Partner With Us</Button>
    </section>
  );
};

export default CTASection;
