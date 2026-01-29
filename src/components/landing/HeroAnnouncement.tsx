import { motion } from 'framer-motion';
import { announcementBar } from '@/config/theme';

const HeroAnnouncement = ({ show }: { show: boolean }) => {
  if (!announcementBar.enabled) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={show ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute top-0 left-0 w-full z-10"
    >
      <div className="bg-primary/80 backdrop-blur border-b border-border">
        <div className="henig-container py-2 text-center">
          <p className="text-xs md:text-sm tracking-wide text-foreground">
            {announcementBar.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroAnnouncement;
