import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopProduct } from '@/config/shop/products';
import { getMetalType } from '@/config/shop/metalTypes';
import igiLogo from '@/assets/landing/certification/BACKDROP LOGOS-07.svg';

interface ShopProductCardProps {
  product: ShopProduct;
}

const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="group relative border border-border/40 bg-card transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded bg-primary text-primary-foreground">
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
        }}
        className="absolute right-2.5 top-2.5 z-10 transition-colors"
      >
        <Heart
          className={`h-6 w-6 transition-colors ${
            liked ? 'fill-primary text-primary' : 'text-primary/70 hover:text-primary'
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
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-foreground leading-snug line-clamp-2">
              {product.name} -...
            </h3>
          </Link>
          {product.certificate && (
            <div className="shrink-0 mt-0.5 flex flex-col items-center gap-0.5">
              <img
                src={igiLogo}
                alt={product.certificate}
                className="h-6 w-auto object-contain"
              />
              <span className="text-[8px] text-foreground/50 leading-none font-medium uppercase tracking-wide">
                {product.certificate}
              </span>
            </div>
          )}
        </div>

        {/* Metal badges + price */}
        <div className="mt-2 flex items-end justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-medium leading-none">Metal type</span>
            <div className="flex flex-wrap gap-1">
              {product.metalOptions.map((m, i) => {
                const metal = getMetalType(m);
                return (
                  <span
                    key={i}
                    title={metal.name}
                    style={{ backgroundColor: metal.bg, color: metal.color }}
                    className="rounded px-1.5 py-[3px] text-[9px] font-bold leading-none uppercase tracking-wide"
                  >
                    {metal.label}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="shrink-0 flex items-baseline gap-0.5">
            <span className="text-[9px] text-foreground/50 leading-none mb-0.5">From</span>
            <span className="text-xl font-bold text-foreground leading-none">£{product.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
