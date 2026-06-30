import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Heart, Share2, BarChart2, Download, FileText, Truck, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { productsApi } from '@/api/products';
import { newApiURL } from '@/config/site';
import { useFavourites } from '@/context/FavouritesContext';
import type { DiamondItem } from './DiamondCard';
import { extractDiamondFields } from './DiamondCard';
import defaultProductImage from '@/assets/product-placeholder.svg';
import igiLogo from '@/assets/jewellery/certification/IGI.svg';
import giaLogo from '@/assets/jewellery/certification/GIA.svg';
import hrdLogo from '@/assets/jewellery/certification/HRDAntwerplogo_notagline-Transperant-Background.png';

const CERT_LOGOS: Record<string, string> = { igi: igiLogo, gia: giaLogo, hrd: hrdLogo };
const getCertLogo = (cert: string) => CERT_LOGOS[cert.toLowerCase().trim()] ?? null;

interface DiamondDetailModalProps {
  item: DiamondItem | null;
  open: boolean;
  onClose: () => void;
}

const DiamondDetailModal = ({ item, open, onClose }: DiamondDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [mediaItems, setMediaItems] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [certCopied, setCertCopied] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const liked = item ? isFavourite(item.id) : false;

  useEffect(() => {
    if (!item?.id || !open) return;
    setSelectedImage(0);
    setMediaItems([]);
    productsApi.getMedia(item.id)
      .then((res) => {
        const { thumbnail, images, video } = res.data ?? {};
        const fileUrl = (fid: string) => `${newApiURL}/products/file/${fid}`;
        const items: { url: string; type: 'image' | 'video' }[] = [];
        if (thumbnail) items.push({ url: fileUrl(thumbnail), type: 'image' });
        (images ?? []).forEach((fid: string) => items.push({ url: fileUrl(fid), type: 'image' }));
        if (video) items.push({ url: fileUrl(video), type: 'video' });
        if (items.length) setMediaItems(items);
      })
      .catch(() => {});
  }, [item?.id, open]);

  if (!item) return null;

  const d = extractDiamondFields(item);

  const raw = item as Record<string, unknown>;
  const availability = String(raw.availability ?? raw.cf_availability ?? raw.stock_status ?? '');

  const galleryItems = mediaItems.length > 0
    ? mediaItems
    : [{ url: item.image, type: 'image' as const }];

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

  const hasMeasurements = d.table || d.depth || d.ratio || d.measurements;

  const certLogo = item.certificate ? getCertLogo(item.certificate) : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0 gap-0 bg-white">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Left: gallery */}
          <div className="border-r border-border/30 p-4">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden border border-border/20 bg-white">
              {/* Download icon */}
              <button
                title="Download"
                className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded bg-background/80 text-foreground/60 transition-colors hover:bg-background"
              >
                <Download className="h-4 w-4" />
              </button>

              {galleryItems[selectedImage]?.type === 'video' ? (
                <video
                  key={galleryItems[selectedImage].url}
                  src={galleryItems[selectedImage].url}
                  className="h-full w-full object-contain outline-none"
                  controls autoPlay loop muted playsInline
                />
              ) : (
                <img
                  src={galleryItems[selectedImage]?.url}
                  alt={item.name}
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
                        <video src={gi.url} className="h-full w-full object-contain" muted playsInline preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <svg className="h-5 w-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <span className="absolute bottom-0.5 left-0.5 text-[8px] font-semibold text-white drop-shadow">360° Video</span>
                      </>
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
          <div className="relative flex flex-col p-5">
            {/* Action icons (top-right) */}
            <div className="absolute right-5 top-12 flex flex-col items-center gap-2">
              <button onClick={() => {}} title="Share" className="text-foreground/40 transition-colors hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </button>
              <button onClick={() => {}} title="Compare" className="text-foreground/40 transition-colors hover:text-foreground">
                <BarChart2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleLike}
                className={`transition-all duration-200 ${justLiked ? 'scale-125' : 'scale-100'}`}
                title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`h-4 w-4 transition-all duration-200 ${liked ? 'fill-primary text-primary' : 'text-foreground/40 hover:text-primary'}`} />
              </button>
              <button onClick={() => {}} title="Download PDF" className="text-foreground/40 transition-colors hover:text-foreground">
                <FileText className="h-4 w-4" />
              </button>
            </div>

            {/* Badge + SKU */}
            <div className="mb-3 flex items-center gap-2 pr-8">
              <span className="rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                {stockLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-foreground/55">
                SKU : {item.sku}
                <button
                  onClick={() => navigator.clipboard.writeText(item.sku)}
                  className="ml-0.5 text-foreground/40 hover:text-foreground/70 transition-colors"
                  title="Copy SKU"
                >
                  <Copy size={11} />
                </button>
              </span>
              {certLogo && <img src={certLogo} alt={item.certificate} className="ml-auto h-4 w-auto object-contain opacity-70" />}
            </div>

            {/* Name */}
            <h2 className="mb-2 text-base font-bold leading-snug text-foreground">{item.name}</h2>

            {/* Measurements */}
            {hasMeasurements && (
              <div className="mb-3 grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs text-foreground/60">
                {d.table && <span><span className="font-semibold text-foreground/75">T:</span> {d.table}</span>}
                {d.ratio && <span><span className="font-semibold text-foreground/75">R:</span> {d.ratio}</span>}
                {d.depth && <span><span className="font-semibold text-foreground/75">D:</span> {d.depth}</span>}
                {d.measurements && <span><span className="font-semibold text-foreground/75">M:</span> {d.measurements}</span>}
              </div>
            )}

            {/* Quality badges */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {d.bgm && (
                <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  BGM: {d.bgm}
                </span>
              )}
              {d.luster && (
                <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  {d.luster}
                </span>
              )}
              {d.eyeClean && (
                <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  {d.eyeClean.toLowerCase() === 'true' || d.eyeClean.toLowerCase() === 'yes' ? 'Eye Clean' : d.eyeClean}
                </span>
              )}
            </div>

            {/* CERT */}
            {d.certNumber && (
              <div className="mb-2 flex items-center gap-1.5 text-xs text-foreground/60">
                <span>CERT : {d.certNumber}</span>
                <button onClick={copyCert} className={`transition-colors ${certCopied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`} title="Copy cert number">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {certCopied && <span className="text-[10px] font-medium text-primary">Copied!</span>}
              </div>
            )}

            {/* Availability */}
            <div className="mb-3 text-xs text-foreground/55">
              <span className="font-medium text-foreground/70">Availability:</span>
              {availability ? <span className="ml-1">{availability}</span> : null}
            </div>

            {/* Delivery */}
            <div className="mb-4 flex items-center gap-2 text-xs text-foreground/60">
              <Truck className="h-4 w-4 flex-shrink-0 text-foreground/40" />
              <span>Standard Delivery <span className="font-medium">4–8 business days</span></span>
            </div>

            {/* Pricing box */}
            <div className="mb-4 rounded border border-primary/30 bg-primary/10 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary">Unit Price (PPC)</span>
                <span className="text-sm font-semibold text-primary">
                  {d.ppcPrice != null ? `${item.currency}${d.ppcPrice.toLocaleString()}` : '–'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Total Value (PPC x Ct Wt)</span>
                <span className="text-sm font-bold text-foreground">
                  {item.currency}{item.price.toLocaleString()}
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
      </DialogContent>
    </Dialog>
  );
};

export default DiamondDetailModal;
