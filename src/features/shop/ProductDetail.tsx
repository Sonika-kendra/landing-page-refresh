import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Copy, Truck, Shield, Maximize, Gem, Home as HomeIcon, FileCheck } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import RegistrationModal from '@/components/shared/common/RegistrationModal';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import CommitmentSection from '@/features/jewellery/sections/CommitmentSection';
import { shopProducts, youMayAlsoLike } from '@/data/shop/products';

const trustBadges = [
  { icon: Truck, label: 'Free UK Delivery' },
  { icon: Shield, label: 'Lifetime Warranty' },
  { icon: Maximize, label: 'Free Resizing' },
  { icon: Gem, label: 'Ethical Sourcing' },
  { icon: HomeIcon, label: 'Handcrafted in the UK' },
  { icon: FileCheck, label: 'Insurance Valuation' },
];

const getMetalBadgeClass = (metal: string, isSelected: boolean) => {
  const isYG = metal.includes('YG');
  const isWG = metal.includes('WG');
  const base = 'px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer min-w-[36px] text-center';
  if (isYG) {
    return `${base} ${isSelected ? 'bg-[#C5A028] text-white border-[#C5A028]' : 'bg-transparent text-foreground border-[#C5A028] hover:bg-[#C5A028]/10'}`;
  }
  if (isWG) {
    return `${base} ${isSelected ? 'bg-accent text-accent-foreground border-accent' : 'bg-transparent text-foreground border-accent/70 hover:bg-accent/10'}`;
  }
  return `${base} ${isSelected ? 'bg-foreground/80 text-white border-foreground/80' : 'bg-transparent text-foreground border-border hover:border-foreground/60'}`;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => shopProducts.find((p) => p.id === id), [id]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState(0);
  const [selectedCarat, setSelectedCarat] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [descOpen, setDescOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!product) {
    return (
      <PageLayout onRegisterClick={() => {}}>
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
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
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

      <section className="section-ivory py-8 md:py-12">
        <div className="henig-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="relative aspect-square bg-white border border-border/20 overflow-hidden mb-3">
                <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-contain p-8" />
                <button onClick={prevImage} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/60 transition-colors">
                  <ChevronLeft className="h-9 w-9" />
                </button>
                <button onClick={nextImage} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/60 transition-colors">
                  <ChevronRight className="h-9 w-9" />
                </button>
              </div>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`h-[90px] w-[90px] border bg-white overflow-hidden flex-shrink-0 transition-all ${i === selectedImage ? 'border-foreground/60' : 'border-border/30 hover:border-border/60'}`}>
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
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
              <div className="flex items-center gap-1.5 text-xs text-muted mb-5">
                <span>SKU #: {product.sku}</span>
                <button className="text-foreground/30 hover:text-foreground/60 transition-colors"><Copy className="h-3 w-3" /></button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground w-28 flex-shrink-0">Metal type:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.metalOptions.map((m, i) => (
                      <button key={i} onClick={() => setSelectedMetal(i)} className={getMetalBadgeClass(m, i === selectedMetal)}>
                        {m.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                {product.caratOptions && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-28 flex-shrink-0">Carat Wt.:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.caratOptions.map((c, i) => (
                        <button key={i} onClick={() => setSelectedCarat(i)} className={`h-8 w-8 text-xs font-medium border transition-colors ${i === selectedCarat ? 'bg-accent text-accent-foreground border-accent' : 'border-border/50 text-foreground hover:border-foreground/50'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizeOptions && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-28 flex-shrink-0">Ring size:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizeOptions.map((s, i) => (
                        <button key={i} onClick={() => setSelectedSize(i)} className={`h-8 w-8 text-xs font-medium border transition-colors ${i === selectedSize ? 'bg-accent text-accent-foreground border-accent' : 'border-border/50 text-foreground hover:border-foreground/50'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.certificate && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-28 flex-shrink-0">Certificate:</span>
                    <span className="inline-block px-3 py-1 text-xs font-semibold border border-[#C5A028] text-foreground">{product.certificate}</span>
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
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2.5">Stone</p>
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
                            <td className="py-[3px] text-[11px] text-muted pr-4 w-[110px] align-top">{label}</td>
                            <td className="py-[3px] text-[11px] text-foreground">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="border border-border/40 px-4 py-2 text-[1.6rem] font-bold text-foreground tracking-tight leading-none">
                  £{product.price.toLocaleString()}
                </span>
                {product.stock && product.stock <= 5 && (
                  <span className="text-sm text-foreground/55">Only {product.stock} left</span>
                )}
                <div className="ml-auto flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted">
                  <span>Share</span>
                  <Share2 className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-4 flex">
                <button className="flex-1 bg-accent text-accent-foreground py-4 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-accent/90 transition-colors">
                  Add to Bag
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  aria-label="Add to wishlist"
                  className={`w-[54px] border flex items-center justify-center transition-colors ${liked ? 'border-primary bg-primary/10' : 'border-border border-l-0 hover:border-foreground/40'}`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-primary text-primary' : 'text-foreground/35'}`} />
                </button>
              </div>

              <p className="mt-3 text-xs text-primary text-center">Order within 02 hours to receive by Thu, 26 Mar</p>

              <div className="mt-7 grid grid-cols-3 gap-y-5 gap-x-3 border-t border-border/30 pt-6">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-[10px] text-foreground/55 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <YouMayAlsoLike items={youMayAlsoLike} />
      <CommitmentSection />
      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default ProductDetail;
