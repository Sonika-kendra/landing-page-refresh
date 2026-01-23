import { motion } from 'framer-motion';
import { Diamond, Gem, Users } from 'lucide-react';

const stats = [
  {
    icon: Diamond,
    value: '50,000+',
    label: 'Designs Manufactured',
  },
  {
    icon: Gem,
    value: '85,000+',
    label: 'Production Capacity',
  },
  {
    icon: Users,
    value: '500+',
    label: 'Clients Globally',
  },
];

const certifications = [
  { name: 'GIA', subtitle: '' },
  { name: 'IGI', subtitle: 'International Gemological Institute' },
  { name: 'HRD', subtitle: 'Antwerp' },
  { name: 'Institute of Gemmology', subtitle: '' },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="henig-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="henig-caption text-muted mb-4 block">Henig Diamonds</span>
          <h2 className="henig-heading-section text-foreground mb-6">
            A Heritage of Trust, Innovation,
            <br />
            and Excellence in Diamonds
          </h2>
          <p className="text-lg text-muted font-light max-w-2xl mx-auto">
            Since 1973, we've been crafting timeless pieces that celebrate life's most precious moments.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-4" />
              <p className="font-serif text-2xl md:text-4xl text-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-sm md:text-base text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-border pt-12"
        >
          <p className="text-center text-sm text-muted mb-8 uppercase tracking-widest">
            Certified by Leading Laboratories
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {certifications.map((cert) => (
              <div key={cert.name} className="text-center">
                <p className="font-serif text-lg md:text-xl text-foreground">
                  {cert.name}
                </p>
                {cert.subtitle && (
                  <p className="text-xs text-muted mt-1">{cert.subtitle}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
