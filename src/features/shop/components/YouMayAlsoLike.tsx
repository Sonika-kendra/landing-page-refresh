interface Suggestion {
  name: string;
  image: string;
}

interface YouMayAlsoLikeProps {
  items: Suggestion[];
}

const YouMayAlsoLike = ({ items }: YouMayAlsoLikeProps) => {
  const capped = items.slice(0, 5);

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

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
          {capped.map((item, i) => (
            <div key={i} className="group cursor-pointer text-center">
              <div className="mb-3 aspect-square overflow-hidden bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-sm leading-tight text-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
