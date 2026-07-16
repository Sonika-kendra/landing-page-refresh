import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronRight as BreadcrumbArrow,
  Heart, Share2, Copy, Mail, BarChart2, Download, FileText,
  Truck, RotateCcw, Home as HomeIcon,
} from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';
import YouMayAlsoLike from '@/features/shop/components/YouMayAlsoLike';
import { trustBadges, getCertLogo } from '@/features/shop/ProductDetail';
import { productsApi } from '@/api/products';
import { mapZohoToShopProduct } from '@/data/shop/mappers';
import type { DiamondItem } from './DiamondCard';
import { extractDiamondFields } from './DiamondCard';
import { CompareProvider, useCompare } from './CompareContext';
import CompareTray from './CompareTray';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import defaultProductImage from '@/assets/product-placeholder.svg';

type GalleryItem = { url: string; type: 'image' | 'video' | '360' };

const DiamondDetailInner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<DiamondItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [similar, setSimilar] = useState<{ name: string; image: string; id: string }[]>([]);
  const [certCopied, setCertCopied] = useState(false);
  const [skuCopied, setSkuCopied] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [bagJustAdded, setBagJustAdded] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { isFavourite, toggleFavourite } = useFavourites();
  const { isCompared, toggleCompare } = useCompare();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated, openModal } = useAuth();

  const liked = item ? isFavourite(item.id) : false;
  const compared = item ? isCompared(item.id) : false;

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setFetchError(null);
    setSelectedImage(0);
    productsApi.getOne(id)
      .then((res) => {
        const raw = res.data?.item as Record<string, unknown> | undefined;
        if (!raw) { setFetchError('not_found'); return; }
        // Same merge order the /products/diamonds list endpoint uses server-side:
        // raw cf_ fields first so extractDiamondFields still sees them, then the
        // mapped ShopProduct shape wins on shared keys (id, sku, price, ...).
        setItem({ ...raw, ...mapZohoToShopProduct(raw) } as DiamondItem);
      })
      .catch(() => setFetchError('error'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!item) return;
    productsApi.listDiamonds({
      per_page: 8,
      page: 1,
      status: 'active',
      category: 'Diamonds',
      cf_stock_sub_category: 'Single Item',
      ...(item.shape && { shape: item.shape }),
    }).then((res) => {
      const items = (res.data?.items ?? []) as DiamondItem[];
      setSimilar(
        items
          .filter((p) => p.id !== item.id)
          .slice(0, 6)
          .map((p) => {
            const df = extractDiamondFields(p);
            return { name: df.title, image: df.pictureLink || p.image, id: p.id };
          })
      );
    }).catch(() => {});
  }, [item?.id, item?.shape]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size={56} />
        </div>
      </PageLayout>
    );
  }

  if (fetchError || !item) {
    return (
      <PageLayout>
        <div className="henig-container py-24 text-center">
          <h1 className="font-serif text-3xl text-foreground">Diamond not found</h1>
          <Link to="/diamonds/all" className="mt-4 inline-block text-primary underline">Back to diamonds</Link>
        </div>
      </PageLayout>
    );
  }

  const d = extractDiamondFields(item);
  const raw = item as Record<string, unknown>;
  const availability = String(raw.availability ?? raw.cf_availability ?? raw.stock_status ?? '');
  const stockLabel = item.stockType === 'Lab' ? 'Lab Grown' : 'Natural';

  const galleryItems: GalleryItem[] = [
    { url: d.pictureLink || item.image, type: 'image' },
    ...(d.mp4 ? [{ url: d.mp4, type: 'video' as const }] : []),
    ...(d.video360 ? [{ url: d.video360, type: '360' as const }] : []),
  ];

  const prevImage = () => setSelectedImage((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  const nextImage = () => setSelectedImage((i) => (i === galleryItems.length - 1 ? 0 : i + 1));

  const copyCert = () => {
    if (d.certNumber) navigator.clipboard.writeText(d.certNumber);
    setCertCopied(true);
    setTimeout(() => setCertCopied(false), 1500);
  };

  const copySku = () => {
    navigator.clipboard.writeText(item.sku ?? '');
    setSkuCopied(true);
    setTimeout(() => setSkuCopied(false), 1500);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShareOpen(false); }, 2000);
  };

  const handleToggleLiked = () => {
    toggleFavourite(item.id);
    if (!liked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  const handleAddToBag = async () => {
    if (addedToBag) { navigate('/cart'); return; }
    if (!isAuthenticated) { openModal('login'); return; }
    try {
      await addItem({
        item_id: item.id, name: d.title, rate: item.price, quantity: 1,
        sku: item.sku, image: d.pictureLink || item.image, category: 'Diamonds',
        carat: d.caratTotal ? `${d.caratTotal}ct` : undefined,
      });
      setBagJustAdded(true);
      setTimeout(() => { setBagJustAdded(false); setAddedToBag(true); }, 600);
    } catch (err: any) {
      toast({ title: 'Could not add to bag', description: err?.message ?? 'Please try again.', variant: 'destructive' });
    }
  };

  const handleDownloadImage = () => {
    const current = galleryItems[selectedImage];
    if (!current?.url) return;
    // ponytail: same as DiamondDetailModal — vendor CDN images don't send CORS
    // headers, so a plain anchor download (browser-fetched) is used instead of a blob fetch.
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
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-accent">
        <div className="henig-container py-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
            <Link to="/diamonds/all" className="flex items-center gap-1 font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              <HomeIcon className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <Link to="/diamonds/all" className="font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              Diamonds
            </Link>
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <span className="max-w-[240px] truncate font-semibold text-accent-foreground">{d.title}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white py-8 md:py-12">
        <div className="henig-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Gallery */}
            <div>
              <div className="relative mb-3 aspect-square overflow-hidden border border-border/20 bg-white">
                {galleryItems[selectedImage]?.type === 'image' && (
                  <button onClick={handleDownloadImage} title="Download image" className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded bg-background/80 text-foreground/60 transition-colors hover:bg-background">
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
                    className="h-full w-full object-contain p-8"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultProductImage; }}
                  />
                )}
                {galleryItems.length > 1 && (
                  <>
                    <button onClick={prevImage} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-background/90 transition-colors hover:bg-background">
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <button onClick={nextImage} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-background/90 transition-colors hover:bg-background">
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </>
                )}
              </div>

              {galleryItems.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {galleryItems.map((gi, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-[90px] w-[90px] flex-shrink-0 overflow-hidden border bg-white transition-all ${idx === selectedImage ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}
                    >
                      {gi.type === 'video' ? (
                        <>
                          <video src={gi.url} className="h-full w-full object-contain" muted playsInline preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <svg className="h-6 w-6 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </>
                      ) : gi.type === '360' ? (
                        <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-[10px] font-semibold text-foreground/60">360°</div>
                      ) : (
                        <img src={gi.url} alt="" className="h-full w-full object-contain p-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <span className="mb-3 inline-block rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                {stockLabel}
              </span>
              <h1 className="mb-1.5 font-sans font-medium text-2xl leading-snug text-foreground md:text-[1.7rem]">{d.title}</h1>
              <div className="mb-5 flex items-center gap-1.5 text-xs">
                <span className="font-medium text-foreground/60">SKU #: {item.sku}</span>
                <button onClick={copySku} title="Copy SKU" className={`transition-colors ${skuCopied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`}>
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {skuCopied && <span className="text-[10px] font-medium text-primary">Copied!</span>}
              </div>

              <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground/60 sm:grid-cols-4">
                <span><span className="font-semibold text-foreground/75">T:</span> {d.table || '-'}</span>
                <span><span className="font-semibold text-foreground/75">D:</span> {d.depth || '-'}</span>
                <span><span className="font-semibold text-foreground/75">R:</span> {d.ratio || '-'}</span>
                <span><span className="font-semibold text-foreground/75">M:</span> {d.measurements || '-'}</span>
              </div>

              <div className="border-t border-border/30 pb-5 pt-4">
                <table className="w-full">
                  <tbody>
                    {([
                      ['Shape:', item.shape],
                      ['Carat weight:', d.caratTotal ? `${d.caratTotal}ct` : item.caratWeight],
                      ['Colour:', item.colour],
                      ['Clarity:', item.clarity],
                      ['Cut:', d.cut],
                      ['Polish:', d.polish],
                      ['Symmetry:', d.symmetry],
                      ['Fluorescence:', d.fluorescence],
                    ] as [string, string | undefined][]).filter(([, value]) => Boolean(value)).map(([label, value]) => (
                      <tr key={label}>
                        <td className="w-[110px] py-[3px] pr-4 align-top text-xs font-medium text-foreground/55">{label}</td>
                        <td className="py-[3px] text-xs font-semibold text-foreground">{value}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="w-[110px] py-[3px] pr-4 align-top text-xs font-medium text-foreground/55">Certificate:</td>
                      <td className="py-[3px]">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          {(() => {
                            const logo = d.certLab ? getCertLogo(d.certLab) : null;
                            return logo ? <img src={logo} alt={d.certLab} className="h-4 w-auto object-contain" /> : (d.certLab || '–');
                          })()}
                          <span>: {d.certNumber || '–'}</span>
                          {d.certNumber && (
                            <button onClick={copyCert} className={`transition-colors ${certCopied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`} title="Copy cert number">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {certCopied && <span className="text-[10px] font-medium text-primary">Copied!</span>}
                        </span>
                      </td>
                    </tr>
                    {availability && (
                      <tr>
                        <td className="w-[110px] py-[3px] pr-4 align-top text-xs font-medium text-foreground/55">Availability:</td>
                        <td className="py-[3px] text-xs font-semibold text-foreground">{availability}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mb-5 flex items-center gap-2 text-xs text-foreground/60">
                <Truck className="h-4 w-4 flex-shrink-0 text-foreground/40" />
                <span>Standard Delivery <span className="font-medium">4–8 business days</span></span>
              </div>

              <div className="mb-5 space-y-2 rounded border border-primary/30 bg-primary/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">Unit Price</span>
                  <span className="text-base font-semibold tabular-nums text-foreground">{item.currency}{item.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total Value</span>
                  <span className="text-base font-bold tabular-nums text-foreground">
                    {d.mainTotal != null ? `${item.currency}${Number(d.mainTotal).toLocaleString()}` : '–'}
                  </span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <Popover open={shareOpen} onOpenChange={setShareOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-0.5">
                      <button onClick={handleCopyLink} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary">
                        <Copy className="h-4 w-4 text-foreground/60" />
                        <span>{copied ? 'Copied!' : 'Copy link'}</span>
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(d.title + ' — ' + window.location.href)}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => setShareOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(d.title)}&body=${encodeURIComponent(window.location.href)}`}
                        onClick={() => setShareOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <Mail className="h-4 w-4 text-foreground/60" />
                        <span>Email</span>
                      </a>
                    </div>
                  </PopoverContent>
                </Popover>

                <button onClick={() => toggleCompare(item)} className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest transition-colors ${compared ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>{compared ? 'Comparing' : 'Compare'}</span>
                </button>

                {d.certLink && (
                  <a href={d.certLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Certificate</span>
                  </a>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToBag}
                  disabled={cartLoading && !addedToBag}
                  className={`flex-1 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                    bagJustAdded
                      ? 'bg-accent/80 scale-[0.98] text-accent-foreground'
                      : addedToBag
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  }`}
                >
                  {bagJustAdded ? 'Added!' : addedToBag ? 'Go to Bag' : 'Add to Bag'}
                </button>
                <button
                  onClick={handleToggleLiked}
                  aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex w-[54px] items-center justify-center bg-accent text-accent-foreground transition-all duration-200 hover:bg-accent/90 ${justLiked ? 'scale-95' : ''}`}
                >
                  <Heart className={`h-5 w-5 transition-all duration-200 ${liked ? 'fill-white scale-110' : 'scale-100'}`} />
                </button>
              </div>

              <div className="mt-5 space-y-1 border-t border-border/30 pt-5">
                <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                  <RotateCcw className="h-3.5 w-3.5 flex-shrink-0" />
                  <span><span className="font-bold">Returnable</span> fair use policy applies.</span>
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/50">
                  In order to guarantee the best experience for our buyers and suppliers, you'll be able to return eligible items up to <span className="font-bold">35 days</span>, and every return will be charged with a return fee that varies depending on the item characteristics.
                </p>
                <Link to="/terms-and-conditions" className="block text-[11px] font-bold text-foreground/60 underline underline-offset-2 hover:text-foreground/80">
                  Review our Terms and Conditions
                </Link>
              </div>

              <div className="mt-7 border-t border-border/30 pt-6">
                <div className="grid grid-cols-3 gap-3 rounded border border-border/20 bg-secondary/60 p-4">
                  {trustBadges.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold leading-tight text-foreground/70">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && <YouMayAlsoLike items={similar} basePath="/diamonds/all" />}
      <CompareTray />
    </PageLayout>
  );
};

const DiamondDetail = () => (
  <CompareProvider>
    <DiamondDetailInner />
  </CompareProvider>
);

export default DiamondDetail;
