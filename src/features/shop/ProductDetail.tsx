import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productPath, toSlug } from '@/lib/utils';
import { newApiURL } from '@/config/site';
import {
  ChevronLeft, ChevronRight, ChevronRight as BreadcrumbArrow,
  Heart, Share2, Copy, Check, Mail,
  Truck, Shield, Maximize, Gem, Home as HomeIcon, FileCheck,
  Leaf,
  Tag,
  BadgeDollarSign,
  Sparkles,
  RotateCcw,
  RefreshCw,
  Pencil,
  PenLine,
} from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import type { ShopProduct } from '@/data/shop/products';
import { mapZohoToShopProduct } from '@/data/shop/mappers';
import { getMetalType } from '@/data/shop/metalTypes';
import { productsApi } from '@/api/products';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import igiLogo from '@/assets/jewellery/certification/IGI.svg';
import giaLogo from '@/assets/jewellery/certification/GIA.svg';
import hrdLogo from '@/assets/jewellery/certification/HRDAntwerplogo_notagline-Transperant-Background.png';
import sglLogo from '@/assets/jewellery/certification/SGL.png';
import defaultProductImage from '@/assets/product-placeholder.svg';

const CERT_LOGOS: Record<string, string> = { igi: igiLogo, gia: giaLogo, hrd: hrdLogo, sgl: sglLogo };
export const getCertLogo = (cert: string): string | null => CERT_LOGOS[cert.toLowerCase().trim()] ?? null;

export const trustBadges = [
  { icon: Leaf, label: 'Ethical Sourcing' },
  { icon: BadgeDollarSign, label: 'Competitive Pricing' },
  { icon: Sparkles, label: 'Free After Care' },
  { icon: RotateCcw, label: '90 Day Return Policy' },
  { icon: PenLine, label: 'Bespoke Available' },
  { icon: FileCheck, label: '100% Certified Jewellery' },
];

const ProductDetail = () => {
  const { category: categoryParam, subCategory: subCategoryParam, id } = useParams<{ category?: string; subCategory?: string; id: string }>();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [variants, setVariants] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [selectedMetalCode, setSelectedMetalCode] = useState('');
  const [selectedCaratValue, setSelectedCaratValue] = useState('');
  const [selectedSizeValue, setSelectedSizeValue] = useState('');
  const [selectedMetalWeight, setSelectedMetalWeight] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [selectedClarity, setSelectedClarity] = useState('');
  const [mediaItems, setMediaItems] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [mediaFetchId, setMediaFetchId] = useState(id ?? '');
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [descOpen, setDescOpen] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [bagJustAdded, setBagJustAdded] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [copied, setCopied] = useState(false);
  const [skuCopied, setSkuCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<{ name: string; image: string; id: string }[]>([]);

  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated, isAuthLoading, openModal } = useAuth();
  const liked = product ? isFavourite(product.id) : false;

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openModal('login');
    }
  }, [isAuthLoading, isAuthenticated, openModal]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setFetchError(null);
    setSelectedImage(0);
    setThumbOffset(0);
    setVariants([]);
    setMediaFetchId(id);
    productsApi.getOne(id)
      .then((res) => {
        const item = res.data?.item as Record<string, unknown> | undefined;
        if (!item) {
          setFetchError('not_found');
          return;
        }
        const p = mapZohoToShopProduct(item);
        setProduct(p);
        setDisplayPrice(p.price);
        setSelectedMetalCode(p.metalOptions[0] ?? '');
        setSelectedCaratValue(p.caratOptions?.[0] ?? '');
        setSelectedSizeValue(p.sizeOptions?.[0] ?? '');
        setSelectedMetalWeight(p.metalWeightOptions?.[0] ?? '');
        setSelectedShape(p.shape ?? '');
        setSelectedColour(p.colour ?? '');
        setSelectedClarity(p.clarity ?? '');
        const raw = (res.data?.variants ?? []) as Record<string, unknown>[];
        if (raw.length > 0) setVariants(raw.map((i) => mapZohoToShopProduct(i)));
      })
      .catch(() => setFetchError('error'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!mediaFetchId) return;
    setMediaItems([]);
    setSelectedImage(0);
    setThumbOffset(0);
    setIsMediaLoading(true);
    productsApi.getMedia(mediaFetchId)
      .then((res) => {
        const { thumbnail, images, video } = res.data ?? {};
        const fileUrl = (fileId: string) => `${newApiURL}/products/file/${fileId}`;
        const items: { url: string; type: 'image' | 'video' }[] = [];
        if (thumbnail) items.push({ url: fileUrl(thumbnail), type: 'image' });
        (images ?? []).forEach((fid: string) => items.push({ url: fileUrl(fid), type: 'image' }));
        if (video) items.push({ url: fileUrl(video), type: 'video' });
        if (items.length > 0) setMediaItems(items);
      })
      .catch(() => {})
      .finally(() => setIsMediaLoading(false));
  }, [mediaFetchId]);

  // Redirect old /jewellery/all/:id URLs to the new /jewellery/:category/:subCategory/:id format
  useEffect(() => {
    if (!product || !id || categoryParam) return;
    navigate(productPath(product.category, product.subCategory, id), { replace: true });
  }, [product, id, categoryParam, navigate]);

  useEffect(() => {
    if (!product) return;
    productsApi.list({
      per_page: 8,
      page: 1,
      status: 'active',
      category: 'Jewellery',
      ...(product.subCategory && { cf_sub_category_type: product.subCategory }),
    }).then((res) => {
      const items = (res.data?.items ?? []) as ShopProduct[];
      setSimilarProducts(
        items
          .filter((p) => p.id !== product.id)
          .slice(0, 6)
          .map((p) => ({ name: p.name, image: p.image, id: p.id }))
      );
    }).catch(() => {});
  }, [product?.id, product?.subCategory]);

  const copySku = () => {
    navigator.clipboard.writeText(product?.sku ?? '');
    setSkuCopied(true);
    setTimeout(() => setSkuCopied(false), 1500);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShareOpen(false); }, 2000);
  };

  const handleToggleLiked = () => {
    if (!product) return;
    toggleFavourite(product.id);
    if (!liked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  const handleAddToBag = async () => {
    if (!product) return;
    if (addedToBag) { navigate('/cart'); return; }
    if (!isAuthenticated) { openModal('login'); return; }
    try {
      await addItem({ item_id: product.id, name: product.name, rate: product.price, quantity: 1, sku: product.sku, image: product.image, metal: product.metal, size: selectedSizeValue || undefined, category: product.category, carat: selectedCaratValue || product.caratWeight || undefined });
      setBagJustAdded(true);
      setTimeout(() => { setBagJustAdded(false); setAddedToBag(true); }, 600);
    } catch (err: any) {
      toast({ title: 'Could not add to bag', description: err?.message ?? 'Please try again.', variant: 'destructive' });
    }
  };

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
          <h2 className="font-serif text-2xl text-foreground">Members Only</h2>
          <p className="text-sm text-foreground/60">Please sign in or register to view product details.</p>
          <div className="flex gap-3">
            <button onClick={() => openModal('login')} className="rounded bg-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90">
              Sign In
            </button>
            <button onClick={() => openModal('register')} className="rounded border border-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent hover:bg-accent/10">
              Register
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size={56} />
        </div>
      </PageLayout>
    );
  }

  if (fetchError || !product) {
    return (
      <PageLayout>
        <div className="henig-container py-24 text-center">
          <h1 className="font-serif text-3xl text-foreground">Product not found</h1>
          <Link to="/jewellery/all" className="mt-4 inline-block text-primary underline">Back to shop</Link>
        </div>
      </PageLayout>
    );
  }

  const galleryItems = mediaItems.length > 0
    ? mediaItems
    : (product.images || [product.image]).map((url) => ({ url, type: 'image' as const }));
  const THUMB_PAGE = 5;
  const prevImage = () => setSelectedImage((i) => {
    const next = i === 0 ? galleryItems.length - 1 : i - 1;
    setThumbOffset((o) => next < o ? Math.max(0, next) : next >= o + THUMB_PAGE ? next - THUMB_PAGE + 1 : o);
    return next;
  });
  const nextImage = () => setSelectedImage((i) => {
    const next = i === galleryItems.length - 1 ? 0 : i + 1;
    setThumbOffset((o) => next >= o + THUMB_PAGE ? next - THUMB_PAGE + 1 : next < o ? 0 : o);
    return next;
  });

  const _allVariantsOuter = variants.length ? variants : [product];
  const allShapes = [...new Set(_allVariantsOuter.map((v) => v.shape).filter(Boolean) as string[])];
  const allColours = [...new Set(_allVariantsOuter.map((v) => v.colour).filter(Boolean) as string[])];
  const allClarities = [...new Set(_allVariantsOuter.map((v) => v.clarity).filter(Boolean) as string[])];
  const allCaratsOuter = [...new Set(_allVariantsOuter.flatMap((v) => v.caratOptions ?? []))];

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-accent">
        <div className="henig-container py-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
            <Link to="/jewellery/all" className="flex items-center gap-1 font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              <HomeIcon className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <Link to={`/jewellery/${toSlug(product.category)}`} className="font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              {product.category}
            </Link>
            {product.subCategory && (
              <>
                <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
                <Link to={`/jewellery/${toSlug(product.category)}?type=${product.subCategory}`} className="font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
                  {product.subCategory}
                </Link>
              </>
            )}
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <span className="max-w-[240px] truncate font-semibold text-accent-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white py-8 md:py-12">
        <div className="henig-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className={`relative mb-3 aspect-square overflow-hidden bg-white ${galleryItems[selectedImage]?.type === 'video' ? '' : 'border border-border/20'}`}>
                {isMediaLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                    <LoadingSpinner size={40} />
                  </div>
                )}
                {galleryItems[selectedImage]?.type === 'video' ? (
                  <video
                    key={galleryItems[selectedImage].url}
                    src={galleryItems[selectedImage].url}
                    className="h-full w-full object-contain outline-none"
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={galleryItems[selectedImage]?.url || defaultProductImage}
                    alt={product.name}
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
              {(() => {
                const THUMB_PAGE = 5;
                const canPrev = thumbOffset > 0;
                const canNext = thumbOffset + THUMB_PAGE < galleryItems.length;
                const visibleThumbs = galleryItems.slice(thumbOffset, thumbOffset + THUMB_PAGE);
                const handleThumbSelect = (absoluteIndex: number) => {
                  setSelectedImage(absoluteIndex);
                };
                const goPrev = () => setThumbOffset((o) => Math.max(0, o - 1));
                const goNext = () => setThumbOffset((o) => Math.min(galleryItems.length - THUMB_PAGE, o + 1));
                return (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={goPrev}
                      disabled={!canPrev}
                      aria-label="Previous thumbnails"
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/30 bg-background/90 text-foreground/60 transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex gap-1.5">
                      {visibleThumbs.map((item, vi) => {
                        const absoluteIndex = thumbOffset + vi;
                        return (
                          <button
                            key={absoluteIndex}
                            onClick={() => handleThumbSelect(absoluteIndex)}
                            className={`relative h-[90px] w-[90px] flex-shrink-0 overflow-hidden border bg-white transition-all ${absoluteIndex === selectedImage ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}
                          >
                            {item.type === 'video' ? (
                              <>
                                <video src={item.url} className="h-full w-full object-contain" muted loop autoPlay playsInline preload="auto" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                  <svg className="h-6 w-6 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                              </>
                            ) : (
                              <img
                                src={item.url || defaultProductImage}
                                alt=""
                                className="h-full w-full object-contain p-1"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultProductImage; }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={goNext}
                      disabled={!canNext}
                      aria-label="Next thumbnails"
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/30 bg-background/90 text-foreground/60 transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })()}
              <div className="mt-8 border-t border-border/30">
                <button onClick={() => setDescOpen(!descOpen)} className="flex w-full items-center justify-between py-4 text-left">
                  <span className="text-sm font-medium text-foreground">Product Description</span>
                  <span className="text-xl leading-none text-foreground/40">{descOpen ? '−' : '+'}</span>
                </button>
                {descOpen && (
                  <div className="pb-5 text-sm leading-relaxed text-foreground/60">
                    <p className="mb-1 text-xs">Item Ref: {product.itemRef}</p>
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="mb-1.5 font-sans font-medium text-2xl leading-snug text-foreground md:text-[1.7rem]">{product.name}</h1>
              <div className="mb-5 flex items-center gap-1.5 text-xs">
                <span className="font-medium text-foreground/60">SKU #: {product.sku}</span>
                <button
                  onClick={copySku}
                  title="Copy SKU"
                  className={`transition-colors ${skuCopied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`}
                >
                  {skuCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              {(() => {
                const allVariants = variants.length ? variants : [product];

                const seenMetal = new Set<string>();
                const metalList = allVariants.flatMap((v) =>
                  v.metalOptions.map((m) => ({ metal: m, variant: v }))
                ).filter((o) => {
                  if (seenMetal.has(o.metal)) return false;
                  seenMetal.add(o.metal);
                  return true;
                });

                const allCarats = [...new Set(allVariants.flatMap((v) => v.caratOptions ?? []))];
                const sizeOptions = [...new Set(allVariants.flatMap((v) => v.sizeOptions ?? []))];
                const allCerts = [...new Set(allVariants.map((v) => v.certificate).filter(Boolean) as string[])];

                // Score each variant: metal=8, shape=4, colour=2, clarity=2, carat=2, size=2, weight=1
                const resolveVariant = (metal: string, carat: string, weight: string, shape: string, colour: string, clarity: string, size: string) => {
                  if (allVariants.length === 1) return allVariants[0];
                  return allVariants
                    .map((v) => ({
                      v,
                      score:
                        (v.metalOptions.includes(metal) ? 8 : 0) +
                        (shape && v.shape === shape ? 4 : 0) +
                        (colour && v.colour === colour ? 2 : 0) +
                        (clarity && v.clarity === clarity ? 2 : 0) +
                        (carat && v.caratOptions?.includes(carat) ? 2 : 0) +
                        (size && v.sizeOptions?.includes(size) ? 2 : 0) +
                        (weight && v.metalWeightOptions?.includes(weight) ? 1 : 0),
                    }))
                    .sort((a, b) => b.score - a.score)[0].v;
                };

                const switchVariant = (resolved: ShopProduct) => {
                  if (resolved.id !== product.id) { setProduct(resolved); setMediaFetchId(resolved.id); }
                };

                const applyResolved = (resolved: ShopProduct) => {
                  setSelectedMetalWeight(resolved.metalWeightOptions?.[0] ?? '');
                  setDisplayPrice(resolved.price);
                  switchVariant(resolved);
                };

                const handleMetalSelect = (metalCode: string) => {
                  setSelectedMetalCode(metalCode);
                  applyResolved(resolveVariant(metalCode, selectedCaratValue, selectedMetalWeight, selectedShape, selectedColour, selectedClarity, selectedSizeValue));
                };

                const handleCaratSelect = (carat: string) => {
                  setSelectedCaratValue(carat);
                  applyResolved(resolveVariant(selectedMetalCode, carat, selectedMetalWeight, selectedShape, selectedColour, selectedClarity, selectedSizeValue));
                };

                const handleShapeSelect = (shape: string) => {
                  setSelectedShape(shape);
                  applyResolved(resolveVariant(selectedMetalCode, selectedCaratValue, selectedMetalWeight, shape, selectedColour, selectedClarity, selectedSizeValue));
                };

                const handleColourSelect = (colour: string) => {
                  setSelectedColour(colour);
                  applyResolved(resolveVariant(selectedMetalCode, selectedCaratValue, selectedMetalWeight, selectedShape, colour, selectedClarity, selectedSizeValue));
                };

                const handleClaritySelect = (clarity: string) => {
                  setSelectedClarity(clarity);
                  applyResolved(resolveVariant(selectedMetalCode, selectedCaratValue, selectedMetalWeight, selectedShape, selectedColour, clarity, selectedSizeValue));
                };

                const handleSizeSelect = (size: string) => {
                  setSelectedSizeValue(size);
                  applyResolved(resolveVariant(selectedMetalCode, selectedCaratValue, selectedMetalWeight, selectedShape, selectedColour, selectedClarity, size));
                };

                return (
              <div className="mb-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Metal type:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {metalList.map((opt, i) => {
                      const metal = getMetalType(opt.metal);
                      const isSelected = opt.metal === selectedMetalCode;
                      return (
                        <button
                          key={i}
                          onClick={() => handleMetalSelect(opt.metal)}
                          title={metal.name}
                          style={{
                            backgroundImage: metal.image ? `url(${metal.image})` : undefined,
                            backgroundColor: metal.image ? undefined : metal.bg,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: '#000',
                          }}
                          className={`rounded px-2 py-1 text-[10px] font-bold uppercase leading-none tracking-wide transition-all ${isSelected ? 'ring-2 ring-foreground/70 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {metal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {allShapes.length > 1 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Shape:</span>
                    <div className="flex flex-wrap gap-2">
                      {allShapes.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleShapeSelect(s)}
                          className={`min-w-[2rem] border px-2 py-1.5 text-xs font-medium transition-colors ${s === selectedShape ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {allColours.length > 1 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Colour:</span>
                    <div className="flex flex-wrap gap-2">
                      {allColours.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleColourSelect(c)}
                          className={`min-w-[2rem] border px-2 py-1.5 text-xs font-medium transition-colors ${c === selectedColour ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {allClarities.length > 1 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Clarity:</span>
                    <div className="flex flex-wrap gap-2">
                      {allClarities.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleClaritySelect(c)}
                          className={`min-w-[2rem] border px-2 py-1.5 text-xs font-medium transition-colors ${c === selectedClarity ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {allCarats.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Carat Wt.:</span>
                    <div className="flex flex-wrap gap-2">
                      {allCarats.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleCaratSelect(c)}
                          className={`min-w-[2rem] border px-2 py-1.5 text-xs font-medium transition-colors ${c === selectedCaratValue ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.metalWeightOptions && product.metalWeightOptions.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Metal weight:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.metalWeightOptions.map((w) => (
                        <span key={w} className="min-w-[2rem] border border-border/50 px-2 py-1.5 text-xs font-medium text-foreground">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {sizeOptions.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Size:</span>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSizeSelect(s)}
                          className={`h-8 min-w-[2rem] border px-2 text-xs font-medium transition-colors ${s === selectedSizeValue ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {allCerts.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Certificate:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {allCerts.map((cert) => {
                        const logo = getCertLogo(cert);
                        return logo
                          ? <img key={cert} src={logo} alt={cert} className="h-5 w-auto object-contain" />
                          : <span key={cert} className="rounded border border-foreground/20 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-foreground/60">{cert}</span>;
                      })}
                    </div>
                  </div>
                )}
              </div>
                );
              })()}

              <div className="border-t border-border/30">
                <button onClick={() => setSpecsOpen(!specsOpen)} className="flex w-full items-center justify-between py-4 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">Product Specifications</span>
                  <span className="text-xl leading-none text-foreground/50">{specsOpen ? '−' : '+'}</span>
                </button>
                {specsOpen && (
                  <div className="pb-5">
                    <table className="w-full">
                      <tbody>
                        {([
                          ['Stone type:', product.stoneType],
                          ['Carat weight:', allCaratsOuter.length <= 1 ? (product.caratWeight ?? selectedCaratValue) : undefined],
                          ['Shape:', allShapes.length <= 1 ? product.shape : undefined],
                          ['Colour:', allColours.length <= 1 ? product.colour : undefined],
                          ['Clarity:', allClarities.length <= 1 ? product.clarity : undefined],
                          ['Setting:', product.setting],
                          ['Gold weight:', product.goldWeight],
                          ['Total weight:', product.totalWeight],
                        ] as [string, string | undefined][]).filter(([, value]) => Boolean(value)).map(([label, value]) => (
                          <tr key={label}>
                            <td className="w-[110px] py-[3px] pr-4 align-top text-xs font-medium text-foreground/55">{label}</td>
                            <td className="py-[3px] text-xs font-semibold text-foreground">{value}</td>
                          </tr>
                        ))}
                        {product.certificate && (() => {
                          const logo = getCertLogo(product.certificate);
                          return (
                            <tr>
                              <td className="w-[110px] py-[3px] pr-4 align-top text-xs font-medium text-foreground/55">Certificate:</td>
                              <td className="py-[3px]">
                                {logo
                                  ? <img src={logo} alt={product.certificate} className="h-4 w-auto object-contain" />
                                  : <span className="rounded border border-foreground/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/60">{product.certificate}</span>
                                }
                              </td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="border border-border/30 bg-gray-100 px-5 py-2.5 text-[1.6rem] font-bold leading-none tracking-tight text-foreground">
                  £{displayPrice.toLocaleString()}
                </span>
                {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                  <span className="text-sm text-foreground/55">Only {product.stock} left</span>
                )}

                {/* Share popover */}
                <Popover open={shareOpen} onOpenChange={setShareOpen}>
                  <PopoverTrigger asChild>
                    <button className="ml-auto flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end">
                    <div className="space-y-0.5">
                      <button
                        onClick={handleCopyLink}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <Copy className="h-4 w-4 text-foreground/60" />
                        <span>{copied ? 'Copied!' : 'Copy link'}</span>
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(product.name + ' — ' + window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShareOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(window.location.href)}`}
                        onClick={() => setShareOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <Mail className="h-4 w-4 text-foreground/60" />
                        <span>Email</span>
                      </a>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="mt-4 flex gap-3">
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
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${
                      liked ? 'fill-white scale-110' : 'scale-100'
                    }`}
                  />
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-primary">Order within 02 hours to receive by Thu, 26 Mar</p>

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

      {similarProducts.length > 0 && <YouMayAlsoLike items={similarProducts} />}
    </PageLayout>
  );
};

export default ProductDetail;
