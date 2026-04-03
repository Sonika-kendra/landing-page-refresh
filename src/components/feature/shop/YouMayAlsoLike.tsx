import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface Suggestion {
  name: string;
  image: string;
}

interface YouMayAlsoLikeProps {
  items: Suggestion[];
}

const YouMayAlsoLike = ({ items }: YouMayAlsoLikeProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 240;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="henig-container">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-primary/30" />
          <h2 className="font-serif text-xl md:text-2xl tracking-wide text-foreground uppercase">
            You May Also Like
          </h2>
          <div className="flex-1 h-px bg-primary/30" />
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2"
          >
            {items.map((item, i) => (
              <div key={i} className="flex-shrink-0 w-44 text-center cursor-pointer group">
                <div className="aspect-square overflow-hidden bg-white mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-sm text-foreground leading-tight">{item.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
