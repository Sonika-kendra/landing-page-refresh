import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gem, Heart } from 'lucide-react';
import type { ZohoProduct } from '@/types/product';
import { useFavourites } from '@/context/FavouritesContext';
import { newApiURL } from '@/config/site';
import igiLogo from '@/assets/landing/certification/BACKDROP LOGOS-07.svg';

interface ShopProductCardProps {
  product: ZohoProduct;
}

// Three-stage image resolution:
//   'picture'     → CF.Picture link direct URL
//   'proxy'       → /products/:id/image Zoho proxy
//   'placeholder' → no image available, show icon
type ImgStage = 'picture' | 'proxy' | 'placeholder';

const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const [imgStage, setImgStage] = useState<ImgStage>(
    product.pictureLink ? 'picture' : 'proxy'
  );
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

  const handleImgError = () => {
    if (imgStage === 'picture') setImgStage('proxy');
    else setImgStage('placeholder');
  };

  return (
    <div className="group relative border border-border/40 bg-card transition-shadow hover:shadow-md">
      {/* Wishlist */}
      <button
        onClick={handleLike}
        className={`absolute right-2.5 top-2.5 z-10 transition-all duration-200 ${justLiked ? 'scale-125' : 'scale-100'}`}
        aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Heart
          className={`h-6 w-6 transition-all duration-200 ${
            liked ? 'fill-primary text-primary' : 'text-primary/70 hover:text-primary'
          }`}
        />
      </button>

      {/* Image */}
      <Link to={`/shop/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-white p-4">
          {imgStage === 'placeholder' ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-foreground/20">
              <Gem className="h-10 w-10" />
              <span className="text-[9px] font-medium uppercase tracking-widest">No image</span>
            </div>
          ) : (
            <img
              src={imgStage === 'picture' ? product.pictureLink! : `${newApiURL}/products/${product.id}/image`}
              alt={product.name}
              onError={handleImgError}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="px-3 pb-3 pt-2">
        {/* Title + certificate */}
        <div className="flex items-start justify-between gap-1.5">
          <Link to={`/shop/${product.id}`} className="min-w-0 flex-1">
            <h3
              className="line-clamp-2 text-xs font-medium uppercase leading-snug tracking-wide text-foreground"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {product.name}
            </h3>
          </Link>
          {product.lab && (
            <div className="mt-0.5 shrink-0">
              <img src={igiLogo} alt={product.lab} className="h-4 w-auto object-contain" />
            </div>
          )}
        </div>

        {/* Metal colour + price */}
        <div className="mt-2 flex items-end justify-between gap-1">
          <div className="flex flex-col gap-1">
            {product.metalColour && (
              <>
                <span className="text-[8px] font-medium uppercase leading-none tracking-widest text-foreground/40">
                  Metal
                </span>
                <span className="rounded bg-secondary px-1.5 py-[3px] text-[9px] font-semibold uppercase leading-none tracking-wide text-foreground/70">
                  {product.metalColour}
                </span>
              </>
            )}
            {product.shape && (
              <span className="text-[9px] leading-none text-foreground/45">{product.shape}</span>
            )}
          </div>
          <div className="flex shrink-0 items-baseline gap-0.5">
            <span className="mb-0.5 text-[10px] leading-none text-foreground/50">From</span>
            <span className="text-xl font-bold leading-none text-foreground">
              £{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
