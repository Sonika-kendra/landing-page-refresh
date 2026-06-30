import { useState } from 'react';
import { Heart, Share2, BarChart2, Copy, Check } from 'lucide-react';
import { useFavourites } from '@/context/FavouritesContext';
import type { ShopProduct } from '@/data/shop/products';
import defaultProductImage from '@/assets/product-placeholder.svg';

export type DiamondItem = ShopProduct & Record<string, unknown>;

function cf(item: DiamondItem, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = item[k];
    if (v != null && typeof v !== 'object') return String(v);
  }
  return undefined;
}

export function extractDiamondFields(item: DiamondItem) {
  return {
    certNumber: cf(item, 'certNumber', 'cf_certificate_number', 'cert_number', 'cf_cert_number', 'certificate_number'),
    table:       cf(item, 'table', 'cf_table', 'table_percentage', 'cf_table_percentage'),
    depth:       cf(item, 'depth', 'cf_depth', 'depth_percentage', 'cf_depth_percentage'),
    ratio:       cf(item, 'ratio', 'cf_ratio', 'length_width_ratio', 'cf_length_width_ratio'),
    measurements:cf(item, 'measurements', 'cf_measurements', 'dimensions', 'cf_dimensions'),
    bgm:         cf(item, 'bgm', 'cf_bgm', 'bgm_value', 'cf_bgm_value'),
    luster:      cf(item, 'luster', 'cf_luster', 'lustre', 'cf_lustre'),
    eyeClean:    cf(item, 'eyeClean', 'eye_clean', 'cf_eye_clean', 'cf_eyeclean'),
    cut:         cf(item, 'cut', 'cf_cut', 'cut_grade', 'cf_cut_grade'),
    polish:      cf(item, 'polish', 'cf_polish'),
    fluorescence:cf(item, 'fluorescence', 'cf_fluorescence', 'fluor', 'cf_fluor'),
    ppcPrice:    (() => {
      const v = cf(item, 'ppcPrice', 'ppc_price', 'cf_ppc_price', 'price_per_carat', 'cf_price_per_carat');
      return v != null ? Number(v) : undefined;
    })(),
  };
}

interface DiamondCardProps {
  item: DiamondItem;
  onClick: (item: DiamondItem) => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="ml-0.5 text-foreground/30 transition-colors hover:text-foreground/60">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

const DiamondCard = ({ item, onClick }: DiamondCardProps) => {
  const [justLiked, setJustLiked] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const liked = isFavourite(item.id);
  const d = extractDiamondFields(item);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(item.id);
    if (!liked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  const stockLabel = item.stockType === 'Lab' ? 'Lab' : 'NT';
  const hasMeasurements = d.table || d.depth || d.ratio || d.measurements;
  const hasQualities = d.bgm || d.luster || d.eyeClean;

  return (
    <div
      className="group relative cursor-pointer border border-border/30 bg-card shadow-sm transition-shadow hover:shadow-lg"
      onClick={() => onClick(item)}
    >
      {/* Stock badge */}
      <span className="absolute left-3 top-3 z-10 rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
        {stockLabel}
      </span>

      {/* Action icons */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <button
          onClick={handleLike}
          className={`transition-all duration-200 ${justLiked ? 'scale-125' : 'scale-100'}`}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${liked ? 'fill-primary text-primary' : 'text-foreground/35 hover:text-primary'}`}
          />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          title="Compare"
          className="text-foreground/35 transition-colors hover:text-foreground"
        >
          <BarChart2 className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          title="Share"
          className="text-foreground/35 transition-colors hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-white p-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultProductImage;
          }}
        />
      </div>

      {/* Info block */}
      <div className="bg-white px-3 pb-0 pt-2">
        {/* CERT + SKU */}
        <div className="flex items-center gap-x-4 text-xs text-foreground/45 truncate">
          {d.certNumber && (
            <span className="flex items-center shrink-0">
              CERT : {d.certNumber}
              <CopyButton text={d.certNumber} />
            </span>
          )}
          {item.sku && (
            <span className="flex items-center shrink-0">
              SKU : {item.sku}
              <CopyButton text={item.sku} />
            </span>
          )}
        </div>

        {/* Name */}
        <p className="mt-1 line-clamp-2 text-base font-bold leading-snug text-foreground">
          {item.name}
        </p>

        {/* Measurements */}
        {hasMeasurements && (
          <p className="mt-1 text-xs leading-tight text-foreground/55">
            {[
              d.table && `T: ${d.table}`,
              d.depth && `D: ${d.depth}`,
              d.ratio && `R: ${d.ratio}`,
              d.measurements && `M: ${d.measurements}`,
            ].filter(Boolean).join('  ')}
          </p>
        )}

        {/* Quality badges */}
        {hasQualities && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {d.bgm && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                BGM: {d.bgm}
              </span>
            )}
            {d.luster && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                {d.luster}
              </span>
            )}
            {d.eyeClean && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                {d.eyeClean.toLowerCase() === 'true' || d.eyeClean.toLowerCase() === 'yes' ? 'Eye Clean' : d.eyeClean}
              </span>
            )}
          </div>
        )}

        {/* Prices */}
        <div className="-mx-3 mt-2 border-t border-border/30 bg-secondary/40 px-3 pt-2 pb-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary">Unit Price (PPC)</span>
            <span className="text-base font-semibold text-foreground">
              {d.ppcPrice != null ? `${item.currency}${d.ppcPrice.toLocaleString()}` : '–'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Total Value (PPC x Ct Wt)</span>
            <span className="text-base font-bold text-foreground">
              {item.currency}{item.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondCard;
