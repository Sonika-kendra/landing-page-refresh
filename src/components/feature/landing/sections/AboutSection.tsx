import { motion } from 'framer-motion';
import { stats, brandConfig } from '@/config/landing/theme';

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
            Since {brandConfig.foundedYear}, supplying the trade with quality diamonds and fine jewellery.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center"
              >
                {Icon && (
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
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
      </div>
    </section>
  );
};

export default AboutSection;
