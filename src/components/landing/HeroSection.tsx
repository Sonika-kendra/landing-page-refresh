import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-jewelry.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-32 md:pt-40 pb-16 overflow-hidden">
      <div className="henig-container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <h1 className="henig-heading-display text-foreground mb-6">
              Helping You Sell More
              <br />
              <span className="text-primary">Bridal Jewellery</span>
            </h1>
            <p className="henig-body-large text-muted mb-8 max-w-lg">
              Using sample ring boxes enhances bridal jewellery sales by showcasing 
              the elegance awaiting potential buyers on their special day.
            </p>
            <Button 
              className="btn-henig-outline group"
              size="lg"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-sm shadow-elevated">
              <img
                src={heroImage}
                alt="Elegant diamond ring in luxury box"
                className="w-full h-full object-cover"
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-4 -left-4 md:-left-8 bg-secondary p-4 md:p-6 rounded-sm shadow-subtle"
            >
              <p className="text-xs uppercase tracking-widest text-muted mb-1">Since</p>
              <p className="font-serif text-2xl md:text-3xl text-foreground">1973</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
