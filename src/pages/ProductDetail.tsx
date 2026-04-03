import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Copy, Truck, Shield, Maximize, Gem, Home as HomeIcon, FileCheck } from 'lucide-react';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import YouMayAlsoLike from '@/components/feature/shop/YouMayAlsoLike';
import ShopFeaturesBar from '@/components/feature/shop/ShopFeaturesBar';
import { shopProducts, youMayAlsoLike } from '@/config/shop/products';

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
      {/* Breadcrumbs */}
      <div className="bg-accent">
        <div className="henig-container py-3">
          <nav className="flex items-center gap-2 text-sm text-accent-foreground/70">
            <Link to="/" className="hover:text-accent-foreground transition-colors">Home</Link>
            <span>›</span>
            <Link to="/shop" className="hover:text-accent-foreground transition-colors">{product.category}</Link>
            <span>›</span>
            <span className="text-accent-foreground">{product.subCategory}</span>
            <span>›</span>
            <span className="text-accent-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product content */}
      <section className="section-ivory py-8 md:py-12">
        <div className="henig-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left - Image gallery */}
            <div>
              {/* Main image */}
              <div className="relative aspect-square bg-white border border-border/30 overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-contain p-6"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 border overflow-hidden bg-white transition-all ${
                      i === selectedImage ? 'border-primary ring-1 ring-primary' : 'border-border/30'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>

              {/* Product description accordion */}
              <div className="mt-8 border-t border-border/40">
                <button
                  onClick={() => setDescOpen(!descOpen)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="font-medium text-foreground">Product Description</span>
                  <span className="text-foreground/50">{descOpen ? '−' : '+'}</span>
                </button>
                {descOpen && (
                  <div className="pb-4 text-sm text-foreground/70 leading-relaxed">
                    <p className="mb-2">Item Ref: {product.itemRef}</p>
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Product info */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 text-sm text-muted mb-6">
                <span>SKU #: {product.sku}</span>
                <button className="text-foreground/40 hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Metal type */}
              <div className="mb-5">
                <span className="text-sm text-foreground mb-2 block">Metal type:</span>
                <div className="flex gap-2">
                  {product.metalOptions.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMetal(i)}
                      className={`px-3 py-1.5 text-sm font-medium border rounded transition-colors ${
                        i === selectedMetal
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'border-border text-foreground hover:border-primary'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carat weight */}
              {product.caratOptions && (
                <div className="mb-5">
                  <span className="text-sm text-foreground mb-2 block">Carat Wt.:</span>
                  <div className="flex gap-2">
                    {product.caratOptions.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedCarat(i)}
                        className={`h-9 w-9 text-sm font-medium border rounded transition-colors ${
                          i === selectedCarat
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'border-border text-foreground hover:border-primary'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ring size */}
              {product.sizeOptions && (
                <div className="mb-5">
                  <span className="text-sm text-foreground mb-2 block">Ring size:</span>
                  <div className="flex gap-2">
                    {product.sizeOptions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(i)}
                        className={`h-9 w-9 text-sm font-medium border rounded transition-colors ${
                          i === selectedSize
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'border-border text-foreground hover:border-primary'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate */}
              {product.certificate && (
                <div className="mb-6">
                  <span className="text-sm text-foreground mb-2 block">Certificate:</span>
                  <span className="inline-block px-3 py-1.5 text-sm font-medium border border-accent bg-accent text-accent-foreground rounded">
                    {product.certificate}
                  </span>
                </div>
              )}

              {/* Product specifications accordion */}
              <div className="border-t border-border/40">
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Product Specifications
                  </span>
                  <span className="text-foreground/50">{specsOpen ? '−' : '+'}</span>
                </button>
                {specsOpen && (
                  <div className="pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Stone</p>
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ['Stone type:', product.stoneType],
                          ['Shape:', product.shape],
                          ['Colour:', product.colour],
                          ['Clarity:', product.clarity],
                          ['Setting:', product.setting],
                          ['Certificate:', product.certificate],
                          ['Gold weight:', product.goldWeight],
                          ['Total weight:', product.totalWeight],
                        ].map(([label, value]) => (
                          <tr key={label} className="border-b border-border/20">
                            <td className="py-1.5 text-muted pr-4">{label}</td>
                            <td className="py-1.5 font-medium text-foreground">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-bold text-foreground border border-primary/30 px-4 py-2">
                  £{product.price.toLocaleString()}
                </span>
                {product.stock && product.stock <= 5 && (
                  <span className="text-sm text-destructive font-medium">
                    Only {product.stock} left
                  </span>
                )}
                <div className="ml-auto flex items-center gap-2 text-sm text-muted">
                  <span>SHARE</span>
                  <Share2 className="h-4 w-4" />
                </div>
              </div>

              {/* Add to bag + wishlist */}
              <div className="mt-5 flex gap-3">
                <button className="flex-1 bg-accent text-accent-foreground py-3.5 text-sm font-semibold uppercase tracking-widest hover:bg-accent/90 transition-colors">
                  Add to Bag
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`h-[50px] w-[50px] border flex items-center justify-center transition-colors ${
                    liked ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-primary text-primary' : 'text-foreground/50'}`} />
                </button>
              </div>

              {/* Delivery info */}
              <p className="mt-3 text-sm text-primary text-center">
                Order within 02 hours to receive by Thu, 26 Mar
              </p>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/40 pt-6">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                    <Icon className="h-6 w-6 text-accent" />
                    <span className="text-xs text-foreground/70 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <YouMayAlsoLike items={youMayAlsoLike} />

      {/* Features bar */}
      <ShopFeaturesBar />

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default ProductDetail;
