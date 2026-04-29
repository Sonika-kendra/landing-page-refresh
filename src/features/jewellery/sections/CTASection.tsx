import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { websiteUrlConfig } from '@/config/site';

const CTASection = () => {
  return (
    <section className="py-24 bg-accent text-center">
      <h2 className="henig-heading-section mb-6">Register With Us</h2>
      <Button
        className="bg-accent text-accent-foreground border border-primary hover:bg-primary hover:text-accent hover:border-primary transition-all duration-300 px-8 py-3 text-sm font-normal tracking-widest uppercase"
        asChild
      >
        <Link to={websiteUrlConfig.Contact}>Partner With Us</Link>
      </Button>
    </section>
  );
};

export default CTASection;
