import { Button } from '@/components/ui/button';

const CTASection = ({ onRegisterClick }: { onRegisterClick: () => void }) => (
  <section className="py-24 bg-accent text-center">
    <h2 className="henig-heading-section mb-6">Register With Us</h2>
    <Button className="btn-henig-gold" onClick={onRegisterClick}>Partner With Us</Button>
  </section>
);

export default CTASection;