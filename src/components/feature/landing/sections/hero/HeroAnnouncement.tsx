import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { announcementBar } from '@/config/landing/theme';

const HeroAnnouncement = ({ show }: { show: boolean }) => {
  const [index, setIndex] = useState(0);

  const messages = announcementBar.messages;

  // Automatic rotation every 5s
  useEffect(() => {
    if (!announcementBar.enabled || messages.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!announcementBar.enabled) return null;

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % messages.length);
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

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'linear' }}
                className="text-[10px] md:text-[12px] tracking-[0.12em] text-accent-foreground/80 uppercase whitespace-nowrap"
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
