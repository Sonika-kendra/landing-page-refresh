import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { ShopProduct } from '@/data/shop/products';
import { getMetalType } from '@/data/shop/metalTypes';
import { productPath } from '@/lib/utils';
import { useFavourites } from '@/context/FavouritesContext';
import igiLogo from '@/assets/jewellery/certification/IGI.svg';
import giaLogo from '@/assets/jewellery/certification/GIA.svg';
import hrdLogo from '@/assets/jewellery/certification/HRDAntwerplogo_notagline-Transperant-Background.png';
import sglLogo from '@/assets/jewellery/certification/SGL.png';
import defaultProductImage from '@/assets/product-placeholder.svg';

/** Map cert lab name (case-insensitive) → logo asset URL. Returns null if no image available. */
const CERT_LOGOS: Record<string, string> = {
  igi: igiLogo,
  gia: giaLogo,
  hrd: hrdLogo,
  sgl: sglLogo,
};

function getCertLogo(cert: string): string | null {
  return CERT_LOGOS[cert.toLowerCase().trim()] ?? null;
}

interface ShopProductCardProps {
  product: ShopProduct;
  listView?: boolean;
  onAddToBag?: (product: ShopProduct) => Promise<void>;
}

const ShopProductCard = ({ product, listView = false, onAddToBag }: ShopProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [bagJustAdded, setBagJustAdded] = useState(false);
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

  const handleAddToBag = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onAddToBag) return;
    try {
      await onAddToBag(product);
      setBagJustAdded(true);
      setTimeout(() => setBagJustAdded(false), 600);
    } catch {
      // no-op: keep button in default state on failure
    }
  };

  if (listView) {
    return (
      <div
        className="group relative flex flex-row border border-border/40 bg-card transition-shadow hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ backgroundColor: '#C3AC88' }}>
            {product.badge}
          </span>
        )}

        {/* Image */}
        <Link to={`${productPath(product.category, product.subCategory, product.id)}`} className="shrink-0">
          <div className="h-36 w-36 overflow-hidden bg-white p-4 sm:h-44 sm:w-44">
            <img
              src={isHovered && product.hoverImage ? product.hoverImage : product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProductImage;
              }}
            />
          </div>
        </Link>

        {/* Middle: name + metal */}
        <div className="flex flex-1 flex-col justify-center px-4 py-3 min-w-0">
          <Link to={`${productPath(product.category, product.subCategory, product.id)}`}>
            <h3 className="line-clamp-2 text-sm font-medium uppercase leading-snug tracking-wide text-foreground" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {product.name}
            </h3>
          </Link>
          <div className="mt-3 flex flex-col gap-1">
            <span className="text-[9px] font-medium uppercase leading-none tracking-widest text-foreground/40">Metal type</span>
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
                    className="flex h-4 w-8 items-center justify-center rounded border-2 border-transparent text-[15px] font-bold uppercase leading-none tracking-wide"
                  >
                    {metal.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: heart + cert + price + button */}
        <div className="flex shrink-0 flex-col items-end justify-between p-3">
          <div className="flex items-center gap-2">
            {product.certificate && (() => {
              const logo = getCertLogo(product.certificate);
              return logo ? (
                <img src={logo} alt={product.certificate} className="h-4 w-auto object-contain opacity-60" />
              ) : (
                <span className="rounded border border-foreground/20 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-foreground/60">
                  {product.certificate}
                </span>
              );
            })()}
            <button
              onClick={handleLike}
              className={`transition-all duration-200 ${justLiked ? 'scale-125' : 'scale-100'}`}
              aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-200 ${
                  liked ? 'fill-primary text-primary' : 'text-primary/70 hover:text-primary'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] leading-none text-foreground/50">From</span>
              <span className="ml-1 text-2xl font-bold leading-none text-foreground">{product.currency}{product.price.toLocaleString()}</span>
            </div>
            {onAddToBag && (
              <button
                onClick={handleAddToBag}
                className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 whitespace-nowrap ${
                  bagJustAdded
                    ? 'bg-accent/80 text-accent-foreground scale-[0.98]'
                    : 'bg-accent text-accent-foreground hover:bg-accent/90'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {bagJustAdded ? 'Added!' : 'Add to Bag'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative flex h-full flex-col border border-border/40 bg-card transition-shadow hover:shadow-md"
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
      <Link to={`${productPath(product.category, product.subCategory, product.id)}`}>
        <div className="aspect-square overflow-hidden bg-white p-4">
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultProductImage;
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
        {/* Title + certificate */}
        <div className="flex items-start justify-between gap-1.5">
          <Link to={`${productPath(product.category, product.subCategory, product.id)}`} className="min-h-[2.1rem] min-w-0 flex-1">
            <h3 className="line-clamp-2 text-xs font-medium uppercase leading-snug tracking-wide text-foreground" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {product.name}
            </h3>
          </Link>
          {product.certificate && (() => {
            const logo = getCertLogo(product.certificate);
            return logo ? (
              <div className="mt-0.5 shrink-0">
                <img
                  src={logo}
                  alt={product.certificate}
                  className="h-4 w-auto object-contain"
                />
              </div>
            ) : (
              <span className="mt-0.5 shrink-0 rounded border border-foreground/20 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-foreground/60">
                {product.certificate}
              </span>
            );
          })()}
        </div>

        {/* Metal badges + price, pinned to the bottom so it lines up across cards regardless of title length */}
        <div className="mt-auto">
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
                      className="flex h-4 w-9 items-center justify-center rounded border-2 border-transparent text-[10px] font-bold uppercase leading-none tracking-wide"
                    >
                      {metal.label}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex shrink-0 items-baseline gap-0.5">
              <span className="mb-0.5 text-[10px] leading-none text-foreground/50">From</span>
              <span className="text-xl font-bold leading-none text-foreground">{product.currency}{product.price.toLocaleString()}</span>
            </div>
          </div>

          {onAddToBag && (
            <button
              onClick={handleAddToBag}
              className={`mt-2 flex w-full items-center justify-center gap-1.5 py-2 text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                bagJustAdded
                  ? 'bg-accent/80 text-accent-foreground scale-[0.98]'
                  : 'bg-accent text-accent-foreground hover:bg-accent/90'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {bagJustAdded ? 'Added!' : 'Add to Bag'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
