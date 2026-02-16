import { motion } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import { stats, certifications } from '@/config/landing/theme';

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="henig-container">
        <SectionHeader
          caption="Henig Diamonds"
          title="A Heritage of Trust, Innovation, and Excellence"
          subtitle="Since 1973, supplying the trade with quality diamonds and fine jewellery."
        />

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
              <p className="font-serif text-2xl md:text-4xl text-foreground mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

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
                <p className="font-serif text-lg md:text-xl text-foreground">{cert.name}</p>
                {cert.subtitle && <p className="text-xs text-muted mt-1">{cert.subtitle}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
