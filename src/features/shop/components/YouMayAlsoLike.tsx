import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Suggestion {
  name: string;
  image: string;
}

interface YouMayAlsoLikeProps {
  items: Suggestion[];
  hasActiveFilters?: boolean;
}

const YouMayAlsoLike = ({ items, hasActiveFilters }: YouMayAlsoLikeProps) => {
  return (
    <section className="border-t border-border/30 bg-gray-50 py-12 md:py-16">
      <div className="henig-container">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-foreground/20" />
          <h2 className="font-serif text-xl uppercase tracking-wide text-foreground md:text-2xl">
            You May Also Like
          </h2>
          <div className="h-px flex-1 bg-foreground/20" />
        </div>
        {hasActiveFilters && (
          <p className="-mt-4 mb-6 text-center text-xs tracking-wider text-foreground/45 uppercase">
            Not affected by your active filters
          </p>
        )}

        <div className="relative px-12">
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {items.map((item, i) => (
                <CarouselItem key={i} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="group cursor-pointer px-2 text-center">
                    <div className="mb-3 aspect-square overflow-hidden bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm leading-tight text-foreground">{item.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
