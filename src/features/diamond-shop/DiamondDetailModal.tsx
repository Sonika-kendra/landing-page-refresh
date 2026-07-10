import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Heart, Share2, BarChart2, Download, FileText, Truck, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useFavourites } from '@/context/FavouritesContext';
import { useCompare } from './CompareContext';
import type { DiamondItem } from './DiamondCard';
import { extractDiamondFields, shareDiamond } from './DiamondCard';
import defaultProductImage from '@/assets/product-placeholder.svg';

interface DiamondDetailModalProps {
  item: DiamondItem | null;
  open: boolean;
  onClose: () => void;
}

type GalleryItem = { url: string; type: 'image' | 'video' | '360' };

const DiamondDetailModal = ({ item, open, onClose }: DiamondDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [certCopied, setCertCopied] = useState(false);
  const [skuCopied, setSkuCopied] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const { isCompared, toggleCompare } = useCompare();
  const liked = item ? isFavourite(item.id) : false;
  const compared = item ? isCompared(item.id) : false;

  useEffect(() => {
    setSelectedImage(0);
  }, [item?.id, open]);

  if (!item) return null;

  const d = extractDiamondFields(item);

  const raw = item as Record<string, unknown>;
  const availability = String(raw.availability ?? raw.cf_availability ?? raw.stock_status ?? '');

  const galleryItems: GalleryItem[] = [
    { url: d.pictureLink || item.image, type: 'image' },
    ...(d.mp4 ? [{ url: d.mp4, type: 'video' as const }] : []),
    ...(d.video360 ? [{ url: d.video360, type: '360' as const }] : []),
  ];

  const prevImage = () => setSelectedImage((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  const nextImage = () => setSelectedImage((i) => (i === galleryItems.length - 1 ? 0 : i + 1));

  const stockLabel = item.stockType === 'Lab' ? 'Lab' : 'NT';

  const copyCert = () => {
    if (d.certNumber) navigator.clipboard.writeText(d.certNumber);
    setCertCopied(true);
    setTimeout(() => setCertCopied(false), 1500);
  };

  const handleLike = () => {
    toggleFavourite(item.id);
    if (!liked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  const handleDownloadImage = () => {
    const current = galleryItems[selectedImage];
    if (!current?.url) return;
    // ponytail: diamond images live on the vendor's CDN, not our API — it won't send
    // CORS headers, so a blob fetch (client.download) fails silently. A plain anchor
    // download doesn't need CORS since the browser fetches the resource itself.
    const a = document.createElement('a');
    a.href = current.url;
    a.download = `${item.sku}-diamond`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0 gap-0 bg-white">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Left: gallery */}
          <div className="border-r border-border/30 p-4">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden border border-border/20 bg-white">
              {/* Download icon */}
              {galleryItems[selectedImage]?.type === 'image' && (
                <button
                  onClick={handleDownloadImage}
                  title="Download image"
                  className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded bg-background/80 text-foreground/60 transition-colors hover:bg-background"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}

              {galleryItems[selectedImage]?.type === 'video' ? (
                <video
                  key={galleryItems[selectedImage].url}
                  src={galleryItems[selectedImage].url}
                  className="h-full w-full object-contain outline-none"
                  controls autoPlay loop muted playsInline
                />
              ) : galleryItems[selectedImage]?.type === '360' ? (
                <iframe
                  key={galleryItems[selectedImage].url}
                  src={galleryItems[selectedImage].url}
                  title="360° view"
                  className="h-full w-full border-0"
                />
              ) : (
                <img
                  src={galleryItems[selectedImage]?.url}
                  alt={d.title}
                  className="h-full w-full object-contain p-6"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultProductImage;
                  }}
                />
              )}

              {galleryItems.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-border/30 bg-background/90 transition-colors hover:bg-background">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-border/30 bg-background/90 transition-colors hover:bg-background">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {galleryItems.length > 1 && (
              <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                {galleryItems.map((gi, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden border bg-white transition-all ${idx === selectedImage ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}
                  >
                    {gi.type === 'video' ? (
                      <>
                        <video
                          src={gi.url}
                          className="h-full w-full object-contain"
                          muted loop autoPlay playsInline preload="auto"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                          <svg className="h-5 w-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <span className="absolute bottom-0.5 left-0.5 text-[8px] font-semibold text-white drop-shadow">Video</span>
                      </>
                    ) : gi.type === '360' ? (
                      <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-[8px] font-semibold text-foreground/60">
                        360° View
                      </div>
                    ) : (
                      <>
                        <img src={gi.url} alt="" className="h-full w-full object-contain p-1" />
                        {idx === 0 && galleryItems.length > 1 && <span className="absolute bottom-0.5 left-0.5 text-[8px] font-semibold text-foreground/60">Front view</span>}
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="grid grid-cols-[1fr_auto] gap-3 px-5 pb-8 pt-10">
            {/* Main content column — never runs under the icon rail */}
            <div className="flex flex-col">
              {/* Badge + SKU */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                  {stockLabel}
                </span>
                <span className="flex items-center gap-1 text-xs text-foreground/55">
                  SKU : {item.sku}
                  <button
                    onClick={() => { navigator.clipboard.writeText(item.sku); setSkuCopied(true); setTimeout(() => setSkuCopied(false), 1500); }}
                    className={`ml-0.5 transition-colors ${skuCopied ? 'text-primary' : 'text-foreground/40 hover:text-foreground/70'}`}
                    title="Copy SKU"
                  >
                    <Copy size={11} />
                  </button>
                  {skuCopied && <span className="text-[10px] font-medium text-primary">Copied!</span>}
                </span>
              </div>

              {/* Title */}
              <h2 className="mb-4 text-base font-bold leading-snug text-foreground">{d.title}</h2>

              <div className="flex flex-col gap-4">
                {/* Measurements */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-foreground/60">
                  <span><span className="font-semibold text-foreground/75">T:</span> {d.table || '-'}</span>
                  <span><span className="font-semibold text-foreground/75">R:</span> {d.ratio || '-'}</span>
                  <span><span className="font-semibold text-foreground/75">D:</span> {d.depth || '-'}</span>
                  <span><span className="font-semibold text-foreground/75">M:</span> {d.measurements || '-'}</span>
                </div>

                {/* CERT lab : number */}
                <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                  <span>{d.certLab || '–'} : {d.certNumber || '–'}</span>
                  {d.certNumber && (
                    <button onClick={copyCert} className={`transition-colors ${certCopied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`} title="Copy cert number">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {certCopied && <span className="text-[10px] font-medium text-primary">Copied!</span>}
                </div>

                {/* Availability */}
                <div className="text-xs text-foreground/55">
                  <span className="font-medium text-foreground/70">Availability:</span>
                  {availability ? <span className="ml-1">{availability}</span> : null}
                </div>

                {/* Delivery */}
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Truck className="h-4 w-4 flex-shrink-0 text-foreground/40" />
                  <span>Standard Delivery <span className="font-medium">4–8 business days</span></span>
                </div>

                {/* Pricing box */}
                <div className="rounded border border-primary/30 bg-primary/10 px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary">Unit Price</span>
                    <span className="text-base font-semibold tabular-nums text-primary">
                      {item.currency}{item.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Total Value</span>
                    <span className="text-base font-bold tabular-nums text-foreground">
                      {d.mainTotal != null ? `${item.currency}${Number(d.mainTotal).toLocaleString()}` : '–'}
                    </span>
                  </div>
                </div>

                {/* Return policy */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                    <RotateCcw className="h-3.5 w-3.5 flex-shrink-0" />
                    <span><span className="font-bold">Returnable</span> fair use policy applies.</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-foreground/50">
                    In order to guarantee the best experience for our buyers and suppliers, you'll be able to return eligible items up to <span className="font-bold">35 days</span>, and every return will be charged with a return fee that varies depending on the item characteristics.
                  </p>
                  <a href="/terms-and-conditions" className="block text-[11px] font-bold text-foreground/60 underline underline-offset-2 hover:text-foreground/80" onClick={onClose}>
                    Review our Terms and Conditions
                  </a>
                </div>
              </div>
            </div>

            {/* Icon rail — its own column, so it can never overlap the content */}
            <div className="flex flex-col items-center gap-4 pr-4 pt-1">
              <button onClick={() => shareDiamond(d.title)} title="Share" className="text-foreground/40 transition-colors hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleCompare(item)}
                title={compared ? 'Remove from compare' : 'Compare'}
                className={`transition-colors ${compared ? 'text-primary' : 'text-foreground/40 hover:text-foreground'}`}
              >
                <BarChart2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleLike}
                className={`transition-all duration-200 ${justLiked ? 'scale-125' : 'scale-100'}`}
                title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`h-4 w-4 transition-all duration-200 ${liked ? 'fill-primary text-primary' : 'text-foreground/40 hover:text-primary'}`} />
              </button>
              {d.certLink && (
                <a href={d.certLink} target="_blank" rel="noopener noreferrer" title="Download certificate PDF" className="text-foreground/40 transition-colors hover:text-foreground">
                  <FileText className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiamondDetailModal;
