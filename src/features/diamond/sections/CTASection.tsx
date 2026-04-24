import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const CTASection = () => {
  const { openModal } = useAuth();

  return (
    <section className="py-16 md:py-24 bg-accent text-secondary">
      <div className="henig-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="henig-heading-section mb-6">Register With Us</h2>
          <p className="henig-body-large text-secondary/80 mb-8 max-w-2xl mx-auto">
            Join our network of trusted jewellers and gain access to our full inventory,
            competitive pricing, and expert support.
          </p>
          <Button className="btn-henig-gold" size="lg" onClick={() => openModal('register')}>
            Partner With Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
