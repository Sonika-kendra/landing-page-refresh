import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronRight as BreadcrumbArrow,
  Heart, Share2, Copy, Mail,
  Truck, Shield, Maximize, Gem, Home as HomeIcon, FileCheck,
} from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import { youMayAlsoLike } from '@/data/shop/products';
import type { ShopProduct } from '@/data/shop/products';
import { mapZohoToShopProduct } from '@/data/shop/mappers';
import { getMetalType } from '@/data/shop/metalTypes';
import { productsApi } from '@/api/products';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import igiLogo from '@/assets/jewellery/certification/IGI.svg';
import giaLogo from '@/assets/jewellery/certification/GIA.svg';
import hrdLogo from '@/assets/jewellery/certification/HRDAntwerplogo_notagline-Transperant-Background.png';
import sglLogo from '@/assets/jewellery/certification/SGL.png';

const CERT_LOGOS: Record<string, string> = { igi: igiLogo, gia: giaLogo, hrd: hrdLogo, sgl: sglLogo };
const getCertLogo = (cert: string): string | null => CERT_LOGOS[cert.toLowerCase().trim()] ?? null;

const Diamond3DViewer = lazy(() => import('@/components/shared/product/Diamond3DViewer'));

const trustBadges = [
  { icon: Truck, label: 'Free UK Delivery' },
  { icon: Shield, label: 'Lifetime Warranty' },
  { icon: Maximize, label: 'Free Resizing' },
  { icon: Gem, label: 'Ethical Sourcing' },
  { icon: HomeIcon, label: 'Handcrafted in the UK' },
  { icon: FileCheck, label: 'Insurance Valuation' },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(0);
  const [selectedCarat, setSelectedCarat] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [descOpen, setDescOpen] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [bagJustAdded, setBagJustAdded] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [copied, setCopied] = useState(false);
  const [skuCopied, setSkuCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { addItem } = useCart();
  const liked = product ? isFavourite(product.id) : false;

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setFetchError(null);
    setSelectedImage(0);
    productsApi.getOne(id)
      .then((res) => {
        const item = res.data?.item as Record<string, unknown> | undefined;
        if (!item) {
          setFetchError('not_found');
          return;
        }
        setProduct(mapZohoToShopProduct(item));
      })
      .catch(() => setFetchError('error'))
      .finally(() => setIsLoading(false));
  }, [id]);

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
    await addItem({ item_id: product.id, name: product.name, rate: product.price, quantity: 1, sku: product.sku });
    setBagJustAdded(true);
    setTimeout(() => { setBagJustAdded(false); setAddedToBag(true); }, 600);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="henig-container py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="animate-pulse">
              <div className="aspect-square bg-foreground/5" />
              <div className="mt-3 flex gap-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-[90px] w-[90px] bg-foreground/5" />)}
              </div>
            </div>
            <div className="animate-pulse space-y-4 pt-2">
              <div className="h-7 w-2/3 rounded bg-foreground/10" />
              <div className="h-4 w-1/4 rounded bg-foreground/10" />
              <div className="h-4 w-1/2 rounded bg-foreground/10" />
              <div className="mt-8 h-12 w-full rounded bg-foreground/10" />
            </div>
          </div>
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

  const images = product.images || [product.image];
  const prevImage = () => setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-accent">
        <div className="henig-container py-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
            <Link to="/" className="flex items-center gap-1 font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              <HomeIcon className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <Link to="/jewellery/all" className="font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              {product.category}
            </Link>
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <Link to="/jewellery/all" className="font-semibold text-accent-foreground/70 transition-colors hover:text-accent-foreground">
              {product.subCategory}
            </Link>
            <BreadcrumbArrow className="h-4 w-4 text-accent-foreground/40" />
            <span className="max-w-[240px] truncate font-semibold text-accent-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white py-8 md:py-12">
        <div className="henig-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="relative mb-3 aspect-square overflow-hidden border border-border/20 bg-white">
                {show3D ? (
                  <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-foreground/30">Loading 3D view…</div>}>
                    <Diamond3DViewer />
                  </Suspense>
                ) : (
                  <>
                    <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-contain p-8" />
                    <button onClick={prevImage} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25 transition-colors hover:text-foreground/60">
                      <ChevronLeft className="h-9 w-9" />
                    </button>
                    <button onClick={nextImage} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 transition-colors hover:text-foreground/60">
                      <ChevronRight className="h-9 w-9" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setSelectedImage(i); setShow3D(false); }} className={`h-[90px] w-[90px] flex-shrink-0 overflow-hidden border bg-white transition-all ${!show3D && i === selectedImage ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}>
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
                <button
                  onClick={() => setShow3D((v) => !v)}
                  className={`flex h-[90px] w-[90px] flex-shrink-0 flex-col items-center justify-center gap-1.5 border bg-white transition-all ${show3D ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}
                >
                  <Gem className="h-6 w-6 text-foreground/40" />
                  <span className="text-[9px] font-medium uppercase tracking-wider text-foreground/40">3D View</span>
                </button>
              </div>
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
              <h1 className="mb-1.5 font-serif text-2xl leading-snug text-foreground md:text-[1.7rem]">{product.name}</h1>
              <div className="mb-5 flex items-center gap-1.5 text-xs">
                <span className="font-medium text-foreground/60">SKU #: {product.sku}</span>
                <button
                  onClick={copySku}
                  title="Copy SKU"
                  className={`transition-colors ${skuCopied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {skuCopied && <span className="text-[10px] font-medium text-primary">Copied!</span>}
              </div>

              <div className="mb-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Metal type:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.metalOptions.map((m, i) => {
                      const metal = getMetalType(m);
                      const isSelected = i === selectedMetal;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedMetal(i)}
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
                {product.caratOptions && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Carat Wt.:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.caratOptions.map((c, i) => (
                        <button key={i} onClick={() => setSelectedCarat(i)} className={`h-8 w-8 border text-xs font-medium transition-colors ${i === selectedCarat ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizeOptions && (
                  <div className="flex items-center gap-3">
                    <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Ring size:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizeOptions.map((s, i) => (
                        <button key={i} onClick={() => setSelectedSize(i)} className={`h-8 w-8 border text-xs font-medium transition-colors ${i === selectedSize ? 'border-accent bg-accent text-accent-foreground' : 'border-border/50 text-foreground hover:border-foreground/50'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.certificate && (() => {
                  const logo = getCertLogo(product.certificate);
                  return (
                    <div className="flex items-center gap-3">
                      <span className="w-28 flex-shrink-0 text-sm font-medium text-foreground">Certificate:</span>
                      {logo
                        ? <img src={logo} alt={product.certificate} className="h-5 w-auto object-contain" />
                        : <span className="rounded border border-foreground/20 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-foreground/60">{product.certificate}</span>
                      }
                    </div>
                  );
                })()}
              </div>

              <div className="border-t border-border/30">
                <button onClick={() => setSpecsOpen(!specsOpen)} className="flex w-full items-center justify-between py-4 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">Product Specifications</span>
                  <span className="text-xl leading-none text-foreground/50">{specsOpen ? '−' : '+'}</span>
                </button>
                {specsOpen && (
                  <div className="pb-5">
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Stone</p>
                    <table className="w-full">
                      <tbody>
                        {([
                          ['Stone type:', product.stoneType],
                          ['Shape:', product.shape],
                          ['Colour:', product.colour],
                          ['Clarity:', product.clarity],
                          ['Setting:', product.setting],
                          ['Gold weight:', product.goldWeight],
                          ['Total weight:', product.totalWeight],
                        ] as [string, string | undefined][]).map(([label, value]) => (
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
                  £{product.price.toLocaleString()}
                </span>
                {product.stock && product.stock <= 5 && (
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
                  className={`flex-1 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
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

      <YouMayAlsoLike items={youMayAlsoLike} />
    </PageLayout>
  );
};

export default ProductDetail;
