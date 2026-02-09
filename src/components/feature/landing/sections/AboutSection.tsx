import { motion } from 'framer-motion';
import { Diamond, Gem, Users } from 'lucide-react';
import { stats, brandConfig } from '@/config/landing/theme';

// Icon mapping
const iconMap: Record<number, React.ElementType> = {
  0: Diamond,
  1: Gem,
  2: Users,
};

// Dynamically import all images from src/assets/certification
// const certificationModules = import.meta.glob('@/assets/landing/certification/*.{png,jpg,jpeg,svg,gif}', { eager: true });
// const certificationImages = Object.values(certificationModules).map((mod: any) => mod.default || mod);

const AboutSection = () => {
  return (
    <section id="about" className="py-5 md:py-7 section-white">
      <div className="henig-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="henig-caption text-muted mb-2 block">
            {brandConfig.name}
          </span>

          <h2 className="henig-heading-section text-foreground mb-3">
            A Heritage of Trust, Innovation, and Excellence in Diamonds
          </h2>

          <p className="text-base text-muted font-light max-w-xxl mx-auto">
            Since {brandConfig.foundedYear}, we've been crafting timeless pieces that celebrate life's most precious moments.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[index];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center"
              >
                {IconComponent && (
                  <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                )}

                <p className="font-serif text-xl md:text-2xl text-foreground leading-tight">
                  {stat.value}
                </p>

                <p className="text-xs md:text-sm text-muted">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-border pt-6"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {certificationImages.map((src, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center bg-accent/20 rounded-lg px-3 py-2"
              >
                <img
                  src={src}
                  alt={`Certification ${index + 1}`}
                  className="h-8 md:h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </motion.div> */}

      </div>
    </section>
  );
};

export default AboutSection;
