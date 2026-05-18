import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopProduct } from '@/data/shop/products';
import { getMetalType } from '@/data/shop/metalTypes';
import { useFavourites } from '@/context/FavouritesContext';
import igiLogo from '@/assets/landing/certification/BACKDROP LOGOS-07.svg';

interface ShopProductCardProps {
  product: ShopProduct;
}

const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const liked = isFavourite(product.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavourite(product.id);
    if (!liked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  return (
    <div
      className="group relative border border-border/40 bg-card transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ backgroundColor: '#C3AC88' }}>
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={handleLike}
        className={`absolute right-2.5 top-2.5 z-10 transition-all duration-200 ${justLiked ? 'scale-125' : 'scale-100'}`}
        aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Heart
          className={`h-6 w-6 transition-all duration-200 ${
            liked
              ? 'fill-primary text-primary'
              : 'text-primary/70 hover:text-primary'
          }`}
        />
      </button>

      {/* Image */}
      <Link to={`/shop/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-white p-4">
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="px-3 pb-3 pt-2">
        {/* Title + certificate */}
        <div className="flex items-start justify-between gap-1.5">
          <Link to={`/shop/${product.id}`} className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-xs font-medium uppercase leading-snug tracking-wide text-foreground" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {product.name}
            </h3>
          </Link>
          {product.certificate && (
            <div className="mt-0.5 shrink-0">
              <img
                src={igiLogo}
                alt={product.certificate}
                className="h-4 w-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Metal badges + price */}
        <div className="mt-2 flex items-end justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-medium uppercase leading-none tracking-widest text-foreground/40">Metal type</span>
            <div className="flex flex-wrap gap-1">
              {product.metalOptions.map((m, i) => {
                const metal = getMetalType(m);
                return (
                  <span
                    key={i}
                    title={metal.name}
                    style={{
                      backgroundImage: metal.image ? `url(${metal.image})` : undefined,
                      backgroundColor: metal.image ? undefined : metal.bg,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: metal.color,
                    }}
                    className="rounded px-1.5 py-[3px] text-[9px] font-bold uppercase leading-none tracking-wide"
                  >
                    {metal.label}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex shrink-0 items-baseline gap-0.5">
            <span className="mb-0.5 text-[10px] leading-none text-foreground/50">From</span>
            <span className="text-xl font-bold leading-none text-foreground">£{product.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
