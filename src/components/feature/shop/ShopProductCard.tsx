import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopProduct } from '@/config/shop/products';

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
        <span
          className={`absolute left-3 top-3 z-10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
            product.badge === 'NEW STOCK'
              ? 'bg-accent text-accent-foreground'
              : 'bg-destructive text-destructive-foreground'
          }`}
        >
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
        }}
        className="absolute right-3 top-3 z-10 text-primary/60 hover:text-primary transition-colors"
      >
        <Heart className={`h-5 w-5 ${liked ? 'fill-primary text-primary' : ''}`} />
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
      <div className="px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link to={`/shop/${product.id}`}>
              <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                {product.name} -...
              </h3>
            </Link>
          </div>
          {product.certificate && (
            <span className="flex items-center gap-0.5 text-[11px] text-muted shrink-0">
              <span className="inline-block h-3.5 w-3.5 rounded-full border border-muted text-center text-[8px] leading-[13px]">©</span>
              {product.certificate}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          {/* Metal pills */}
          <div className="flex gap-1">
            {product.metalOptions.map((m, i) => (
              <span
                key={i}
                className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                  m === '18K'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary/20 text-foreground'
                }`}
              >
                {m}
              </span>
            ))}
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-muted">From</span>
            <span className="text-base font-semibold text-foreground">£{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
