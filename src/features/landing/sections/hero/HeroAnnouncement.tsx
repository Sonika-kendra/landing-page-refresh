import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { announcementBar as staticConfig } from '@/config/theme';

type AnnStyle = 'normal' | 'bold' | 'italic' | 'bold-italic';
interface AnnMsg { text: string; link?: string; style?: AnnStyle }

const styleClass = (style?: AnnStyle) => {
  if (style === 'bold') return 'font-bold';
  if (style === 'italic') return 'italic';
  if (style === 'bold-italic') return 'font-bold italic';
  return '';
};

const isHtmlContent = (text: string) => /<[a-z][\s\S]*>/i.test(text);

const toAnnMsg = (raw: unknown): AnnMsg =>
  typeof raw === 'string' ? { text: raw } : (raw as AnnMsg);

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%' }),
};

const HeroAnnouncement = ({ show }: { show: boolean }) => {
  const [[index, direction], setIndex] = useState([0, 1]);

  const { data: configs } = useQuery({
    queryKey: ['admin', 'configs'],
    queryFn: () => adminApi.getConfigs().then(r => r.data),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const annConfig = configs?.find(c => c.type === 'announcement_bar');

  const enabled: boolean =
    annConfig?.fields?.enabled !== undefined
      ? (annConfig.fields.enabled as boolean)
      : staticConfig.enabled;

  const messages: AnnMsg[] = Array.isArray(annConfig?.fields?.messages)
    ? (annConfig!.fields.messages as unknown[]).map(toAnnMsg)
    : staticConfig.messages.map(t => ({ text: t }));

  useEffect(() => {
    if (!enabled || messages.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(([prev]) => [(prev + 1) % messages.length, 1]);
    }, 5000);
    return () => clearInterval(interval);
  }, [enabled, messages.length]);

  useEffect(() => {
    setIndex([0, 1]);
  }, [messages.length]);

  if (!enabled) return null;

  const handlePrev = () => {
    if (messages.length <= 1) return;
    setIndex(([prev]) => [(prev - 1 + messages.length) % messages.length, -1]);
  };

  const handleNext = () => {
    if (messages.length <= 1) return;
    setIndex(([prev]) => [(prev + 1) % messages.length, 1]);
  };

  const current = messages[index];

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
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isHtmlContent(current.text) ? (
                  <span
                    className="text-[10px] md:text-[12px] tracking-[0.12em] text-accent-foreground/80 uppercase whitespace-nowrap [&_a]:underline-offset-2 [&_a]:hover:underline [&_a]:hover:text-accent-foreground [&_a]:transition-colors"
                    dangerouslySetInnerHTML={{ __html: current.text }}
                  />
                ) : current.link ? (
                  <a
                    href={current.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[10px] md:text-[12px] tracking-[0.12em] text-accent-foreground/80 uppercase whitespace-nowrap hover:text-accent-foreground transition-colors underline-offset-2 hover:underline ${styleClass(current.style)}`}
                  >
                    {current.text}
                  </a>
                ) : (
                  <p className={`text-[10px] md:text-[12px] tracking-[0.12em] text-accent-foreground/80 uppercase whitespace-nowrap ${styleClass(current.style)}`}>
                    {current.text}
                  </p>
                )}
              </motion.div>
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
