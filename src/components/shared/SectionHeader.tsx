import { motion } from 'framer-motion';

interface SectionHeaderProps {
  caption?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  showSeparator?: boolean;
  className?: string;
}

const SectionHeader = ({
  caption,
  title,
  subtitle,
  centered = true,
  showSeparator = false,
  className = '',
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`${centered ? 'text-center' : ''} mb-12 ${className}`}
    >
      {caption && (
        <span className="henig-caption text-muted mb-4 block">{caption}</span>
      )}
      <h2 className="henig-heading-section text-foreground mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-muted font-light max-w-2xl mx-auto">{subtitle}</p>
      )}
      {showSeparator && <div className="henig-separator mx-auto mt-4" />}
    </motion.div>
  );
};

export default SectionHeader;
