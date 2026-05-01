import { useState, useMemo, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Copy, Truck, Shield, Maximize, Gem, Home as HomeIcon, FileCheck } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import { shopProducts, youMayAlsoLike } from '@/data/shop/products';
import { getMetalType } from '@/data/shop/metalTypes';
import igiLogo from '@/assets/landing/certification/BACKDROP LOGOS-07.svg';

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
  const product = useMemo(() => shopProducts.find((p) => p.id === id), [id]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(0);
  const [selectedCarat, setSelectedCarat] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [descOpen, setDescOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const [shared, setShared] = useState(false);

  const copySku = () => {
    navigator.clipboard.writeText(product?.sku ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name, url });
      } catch {
        // user cancelled or error — do nothing
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  if (!product) {
    return (
      <PageLayout>
        <div className="henig-container py-24 text-center">
          <h1 className="font-serif text-3xl text-foreground">Product not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-primary underline">Back to shop</Link>
        </div>
      </PageLayout>
    );
  }

  const images = product.images || [product.image];
  const prevImage = () => setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <PageLayout>
      <div className="bg-accent">
        <div className="henig-container py-3">
          <nav className="flex flex-wrap items-center gap-1 text-xs text-accent-foreground/80">
            <Link to="/" className="hover:text-accent-foreground transition-colors">Home</Link>
            <span className="opacity-50">›</span>
            <Link to="/shop" className="hover:text-accent-foreground transition-colors">{product.category}</Link>
            <span className="opacity-50">›</span>
            <Link to="/shop" className="hover:text-accent-foreground transition-colors">{product.subCategory}</Link>
            <span className="opacity-50">›</span>
            <span className="truncate max-w-[240px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white py-8 md:py-12">
        <div className="henig-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="relative aspect-square bg-white border border-border/20 overflow-hidden mb-3">
                {show3D ? (
                  <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-foreground/30 text-xs tracking-widest uppercase">Loading 3D view…</div>}>
                    <Diamond3DViewer />
                  </Suspense>
                ) : (
                  <>
                    <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-contain p-8" />
                    <button onClick={prevImage} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/60 transition-colors">
                      <ChevronLeft className="h-9 w-9" />
                    </button>
                    <button onClick={nextImage} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/60 transition-colors">
                      <ChevronRight className="h-9 w-9" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setSelectedImage(i); setShow3D(false); }} className={`h-[90px] w-[90px] border bg-white overflow-hidden flex-shrink-0 transition-all ${!show3D && i === selectedImage ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}>
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
                <button
                  onClick={() => setShow3D((v) => !v)}
                  className={`h-[90px] w-[90px] border bg-white flex-shrink-0 flex flex-col items-center justify-center gap-1.5 transition-all ${show3D ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}
                >
                  <Gem className="h-6 w-6 text-foreground/40" />
                  <span className="text-[9px] text-foreground/40 font-medium tracking-wider uppercase">3D View</span>
                </button>
              </div>
              <div className="mt-8 border-t border-border/30">
                <button onClick={() => setDescOpen(!descOpen)} className="flex w-full items-center justify-between py-4 text-left">
                  <span className="text-sm font-medium text-foreground">Product Description</span>
                  <span className="text-foreground/40 text-xl leading-none">{descOpen ? '−' : '+'}</span>
                </button>
                {descOpen && (
                  <div className="pb-5 text-sm text-foreground/60 leading-relaxed">
                    <p className="mb-1 text-xs">Item Ref: {product.itemRef}</p>
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="font-serif text-2xl md:text-[1.7rem] leading-snug text-foreground mb-1.5">{product.name}</h1>
              <div className="flex items-center gap-1.5 text-xs mb-5">
                <span className="text-foreground/60 font-medium">SKU #: {product.sku}</span>
                <button
                  onClick={copySku}
                  title="Copy SKU"
                  className={`transition-colors ${copied ? 'text-primary' : 'text-foreground/30 hover:text-foreground/60'}`}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {copied && <span className="text-[10px] text-primary font-medium">Copied!</span>}
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-28 flex-shrink-0">Metal type:</span>
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
                          className={`rounded px-2 py-1 text-[10px] font-bold leading-none uppercase tracking-wide transition-all ${isSelected ? 'ring-2 ring-offset-1 ring-foreground/70' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {metal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {product.caratOptions && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-28 flex-shrink-0">Carat Wt.:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.caratOptions.map((c, i) => (
                        <button key={i} onClick={() => setSelectedCarat(i)} className={`h-8 w-8 text-xs font-medium border transition-colors ${i === selectedCarat ? 'bg-accent text-accent-foreground border-accent' : 'border-border/50 text-foreground hover:border-foreground/50'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizeOptions && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-28 flex-shrink-0">Ring size:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizeOptions.map((s, i) => (
                        <button key={i} onClick={() => setSelectedSize(i)} className={`h-8 w-8 text-xs font-medium border transition-colors ${i === selectedSize ? 'bg-accent text-accent-foreground border-accent' : 'border-border/50 text-foreground hover:border-foreground/50'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.certificate && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-28 flex-shrink-0">Certificate:</span>
                    <div className="flex items-center gap-2">
                      <img src={igiLogo} alt={product.certificate} className="h-5 w-auto object-contain" />
                      {/* <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">{product.certificate}</span> */}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border/30">
                <button onClick={() => setSpecsOpen(!specsOpen)} className="flex w-full items-center justify-between py-4 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">Product Specifications</span>
                  <span className="text-foreground/50 text-xl leading-none">{specsOpen ? '−' : '+'}</span>
                </button>
                {specsOpen && (
                  <div className="pb-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">Stone</p>
                    <table className="w-full">
                      <tbody>
                        {([
                          ['Stone type:', product.stoneType],
                          ['Shape:', product.shape],
                          ['Colour:', product.colour],
                          ['Clarity:', product.clarity],
                          ['Setting:', product.setting],
                          ['Certificate:', product.certificate],
                          ['Gold weight:', product.goldWeight],
                          ['Total weight:', product.totalWeight],
                        ] as [string, string | undefined][]).map(([label, value]) => (
                          <tr key={label}>
                            <td className="py-[3px] text-xs text-foreground/55 pr-4 w-[110px] align-top font-medium">{label}</td>
                            <td className="py-[3px] text-xs text-foreground font-semibold">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="bg-gray-100 text-foreground px-5 py-2.5 text-[1.6rem] font-bold tracking-tight leading-none border border-border/30">
                  £{product.price.toLocaleString()}
                </span>
                {product.stock && product.stock <= 5 && (
                  <span className="text-sm text-foreground/55">Only {product.stock} left</span>
                )}
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{shared ? 'Copied!' : 'Share'}</span>
                  {shared ? <Copy className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-accent text-accent-foreground py-4 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-accent/90 transition-colors">
                  Add to Bag
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  aria-label="Add to wishlist"
                  className="w-[54px] bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-accent-foreground' : ''}`} />
                </button>
              </div>

              <p className="mt-3 text-xs text-primary text-center">Order within 02 hours to receive by Thu, 26 Mar</p>

              <div className="mt-7 border-t border-border/30 pt-6">
                <div className="grid grid-cols-3 gap-3 bg-secondary/60 rounded p-4 border border-border/20">
                  {trustBadges.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/70 leading-tight">{label}</span>
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
