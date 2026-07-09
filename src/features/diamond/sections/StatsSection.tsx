import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/shared/common/SectionHeader';
import ImageWithSkeleton from '@/components/shared/common/ImageWithSkeleton';
import { stats } from '@/config/theme';
import { useAuth } from '@/context/AuthContext';

const certificationModules = import.meta.glob(
  '@/assets/landing/certification/*.{png,jpg,jpeg,svg,gif}',
  { eager: true }
);
type ImageModule = string | { default: string };
const certificationImages = Object.values(certificationModules).map((mod) => {
  const image = mod as ImageModule;
  return typeof image === 'string' ? image : image.default;
});

const StatsSection = () => {
  const { openModal } = useAuth();

  return (
    <section className="py-10 md:py-14 section-ivory">
      <div className="henig-container">
        <SectionHeader
          caption="Henig Diamonds"
          title="A Heritage of Trust, Innovation, and Excellence in Diamonds"
          subtitle="Since 1973, supplying the trade with quality diamonds and fine jewellery."
          className="!mb-8"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                {Icon && <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />}
                <p className="font-serif text-2xl md:text-4xl text-foreground mb-1">{stat.value}</p>
                <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-6"
        >
          {certificationImages.map((src, index) => (
            <div
              key={index}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[190px] max-w-[190px] h-16 sm:h-[4.5rem] md:h-20 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden rounded-sm border border-border/60 bg-card/80 dark:bg-card/60 transition-colors"
            >
              <ImageWithSkeleton
                src={src}
                alt={`Certification ${index + 1}`}
                wrapperClassName="w-full h-full flex items-center justify-center px-2"
                className="block w-full h-full object-contain object-center mx-auto"
              />
            </div>
          ))}
        </motion.div>

        <div className="flex items-center">
          <div className="flex-1 border-t border-border" />
          <div className="px-4">
            <Button
              size="sm"
              className="group p-5 whitespace-nowrap bg-accent text-accent-foreground border border-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              onClick={() => openModal('register')}
            >
              Partner With Us
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="flex-1 border-t border-border" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
