import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { announcementBar } from '@/config/landing/theme';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
  }),
};

const HeroAnnouncement = ({ show }: { show: boolean }) => {
  const [[index, direction], setIndex] = useState([0, 1]);

  const messages = announcementBar.messages;

  // Automatic rotation every 5s
  useEffect(() => {
    if (!announcementBar.enabled || messages.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(([prev]) => [(prev + 1) % messages.length, 1]);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!announcementBar.enabled) return null;

  const handlePrev = () => {
    if (messages.length <= 1) return;
    setIndex(([prev]) => [(prev - 1 + messages.length) % messages.length, -1]);
  };

  const handleNext = () => {
    if (messages.length <= 1) return;
    setIndex(([prev]) => [(prev + 1) % messages.length, 1]);
  };

  return (
    <div className="absolute top-0 left-0 w-full z-20">
      <div className="bg-accent backdrop-blur border-b border-accent-foreground/10 relative">
        <div className="henig-container py-2 text-center flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            className="text-accent-foreground/60 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 overflow-hidden relative h-4 md:h-5">
            <AnimatePresence initial={false} custom={direction}>
              <motion.p
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 text-[10px] md:text-[12px] tracking-[0.12em] text-accent-foreground/80 uppercase whitespace-nowrap text-center"
              >
                {messages[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            onClick={handleNext}
            className="text-accent-foreground/60 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroAnnouncement;
