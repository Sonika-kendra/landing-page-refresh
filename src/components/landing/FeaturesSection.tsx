import { motion } from 'framer-motion';
import { Palette, MessageCircle, RotateCcw, Shield, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { features } from '@/config/theme';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  MessageCircle,
  RotateCcw,
  Shield,
};

interface FeaturesSectionProps {
  onRegisterClick: () => void;
}

// Import all partner images dynamically
const partnerImages = import.meta.glob('@/assets/partner/*.{jpg,png,webp}', { eager: true });
const partnerImageList = Object.values(partnerImages).map((img: any) => img.default || img);

const FeaturesSection = ({ onRegisterClick }: FeaturesSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="henig-container">
        {/* Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Button 
            className="btn-henig-outline"
            size="lg"
            onClick={onRegisterClick}
          >
            Partner With Us
          </Button>
        </motion.div>

        {/* Partner Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-16 items-center"
        >
          {partnerImageList.map((src, idx) => (
            <div
              key={idx}
              className="w-20 h-20 rounded-full bg-accent flex items-center justify-center p-2"
            >
              <img
                src={src}
                alt={`Partner ${idx + 1}`}
                className="max-h-12 object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                {(() => {
                  const IconComponent = iconMap[feature.icon];
                  return IconComponent ? <IconComponent className="w-7 h-7 text-primary" /> : null;
                })()}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
