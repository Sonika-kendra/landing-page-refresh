import { useState } from 'react';
import { Heart, Share2, BarChart2, Copy, Check } from 'lucide-react';
import { useFavourites } from '@/context/FavouritesContext';
import { useCompare } from './CompareContext';
import { toast } from '@/hooks/use-toast';
import type { ShopProduct } from '@/data/shop/products';
import defaultProductImage from '@/assets/product-placeholder.svg';

export type DiamondItem = ShopProduct & Record<string, unknown>;

export async function shareDiamond(name: string) {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: name, url }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(url);
    toast({ title: 'Link copied to clipboard' });
  }
}

function cf(item: DiamondItem, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = item[k];
    if (v != null && typeof v !== 'object') return String(v);
  }
  return undefined;
}

export function extractDiamondFields(item: DiamondItem) {
  const certLab    = cf(item, 'certificate', 'cf_certificate_lab');
  const certNumber = cf(item, 'certNumber', 'cf_certificate_number', 'cert_number', 'cf_cert_number', 'certificate_number');
  const table       = cf(item, 'table', 'cf_table', 'table_percentage', 'cf_table_percentage');
  const depth       = cf(item, 'depth', 'cf_depth', 'depth_percentage', 'cf_depth_percentage');
  const ratio       = cf(item, 'ratio', 'cf_ratio', 'length_width_ratio', 'cf_length_width_ratio');
  const measurements= cf(item, 'measurements', 'cf_measurements', 'cf_measurement_mm', 'dimensions', 'cf_dimensions');
  const cut         = cf(item, 'cut', 'cf_cut', 'cut_grade', 'cf_cut_grade');
  const polish      = cf(item, 'polish', 'cf_polish');
  const symmetry    = cf(item, 'symmetry', 'cf_symmetry');
  const fluorescence= cf(item, 'fluorescence', 'cf_fluorescence', 'fluor', 'cf_fluor');
  const caratTotal  = cf(item, 'cf_carat_total');
  const mainTotal   = cf(item, 'mainTotal', 'cf_main_total', 'main_total');
  const pictureLink = cf(item, 'pictureLink', 'cf_picture_link');
  const certLink    = cf(item, 'certLink', 'cf_cert_link');
  const mp4         = cf(item, 'mp4', 'cf_mp4');
  const video360    = cf(item, 'video360', 'cf_video_360_link');

  const title = [item.shape, caratTotal && `${caratTotal}ct`, item.colour, item.clarity, cut, polish, symmetry, fluorescence]
    .filter(Boolean).join(' ') || item.name;

  return {
    certLab, certNumber, table, depth, ratio, measurements,
    cut, polish, symmetry, fluorescence,
    caratTotal, mainTotal, pictureLink, certLink, mp4, video360, title,
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
  const { isCompared, toggleCompare } = useCompare();
  const liked = isFavourite(item.id);
  const compared = isCompared(item.id);
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
          onClick={(e) => { e.stopPropagation(); toggleCompare(item); }}
          title={compared ? 'Remove from compare' : 'Compare'}
          className={`transition-colors ${compared ? 'text-primary' : 'text-foreground/35 hover:text-foreground'}`}
        >
          <BarChart2 className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); shareDiamond(d.title); }}
          title="Share"
          className="text-foreground/35 transition-colors hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-white p-4">
        <img
          src={d.pictureLink || item.image}
          alt={d.title}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultProductImage;
          }}
        />
      </div>

      {/* Info block */}
      <div className="bg-white px-3 pb-0 pt-2">
        {/* CERT lab : number + SKU */}
        <div className="grid grid-cols-2 gap-1 text-sm text-foreground/45">
          <span className="flex min-w-0 items-center">
            <span className="shrink-0">{d.certLab || '–'} : </span>
            <span className="min-w-0 truncate">{d.certNumber || '–'}</span>
            {d.certNumber && <CopyButton text={d.certNumber} />}
          </span>
          <span className="flex min-w-0 items-center justify-end">
            {item.sku && (
              <>
                <span className="shrink-0">SKU : </span>
                <span className="min-w-0 truncate">{item.sku}</span>
                <CopyButton text={item.sku} />
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <p className="mt-1 line-clamp-2 text-base font-bold leading-snug text-foreground">
          {d.title}
        </p>

        {/* Measurements */}
        <div className="mt-1 flex justify-between text-sm leading-tight text-foreground/55">
          <span>T: {d.table || '-'}</span>
          <span>D: {d.depth || '-'}</span>
          <span>R: {d.ratio || '-'}</span>
          <span>M: {d.measurements || '-'}</span>
        </div>

        {/* Prices */}
        <div className="-mx-3 mt-2 border-t border-border/30 bg-secondary/40 px-3 pt-2 pb-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary">Unit Price</span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {item.currency}{item.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Total Value</span>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {d.mainTotal != null ? `${item.currency}${Number(d.mainTotal).toLocaleString()}` : '–'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondCard;
