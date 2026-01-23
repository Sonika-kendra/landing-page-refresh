import { motion } from 'framer-motion';
import { Palette, MessageCircle, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Palette,
    title: 'Handcrafted Designs',
    description: 'Design your jewellery in 3 simple steps and our experts will custom-craft it for you.',
  },
  {
    icon: MessageCircle,
    title: 'Expert Guidance',
    description: 'Chat with us online, on the phone or book an appointment in one of our showrooms.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns & Resizing',
    description: 'Return your item in under 30 days, or have it resized for free in under 60 days.',
  },
  {
    icon: Shield,
    title: 'Sourcing With Care',
    description: 'Explore our collection of independently certified and conflict-free diamonds.',
  },
];

interface FeaturesSectionProps {
  onRegisterClick: () => void;
}

const FeaturesSection = ({ onRegisterClick }: FeaturesSectionProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="henig-container">
        {/* Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Button 
            className="btn-henig-outline"
            size="lg"
            onClick={onRegisterClick}
          >
            Partner With Us
          </Button>
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
                <feature.icon className="w-7 h-7 text-primary" />
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
