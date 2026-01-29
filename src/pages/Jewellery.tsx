import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import RegistrationModal from '@/components/landing/RegistrationModal';
import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';
import FilterBar from '@/components/shared/FilterBar';
import { certifications, jewellerAssociations, features } from '@/config/theme';
import { jewelleryCategories, sampleJewelleryProducts } from '@/config/products';

// Import images
import jewelleryHero from '@/assets/jewellery-hero.jpg';
import tennisBracelet from '@/assets/tennis-bracelet.jpg';
import hoops from '@/assets/hoops.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import eternityRing from '@/assets/eternity-ring.jpg';

// Product images mapping
const productImages: Record<string, string> = {
  'j1': tennisBracelet,
  'j2': hoops,
  'j3': gemstoneNecklace,
  'j4': eternityRing,
};

const categoryImages: Record<string, string> = {
  earrings: hoops,
  'engagement-rings': eternityRing,
  bracelets: tennisBracelet,
  necklaces: gemstoneNecklace,
};

const Jewellery = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add images to sample products
  const productsWithImages = sampleJewelleryProducts.map((p) => ({
    ...p,
    image: productImages[p.id] || '',
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header onRegisterClick={() => setIsRegisterModalOpen(true)} />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] pt-32 md:pt-40 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={jewelleryHero}
              alt="Jewellery collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
          </div>

          <div className="henig-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <h1 className="henig-heading-display text-foreground mb-6">
                Jewellery
              </h1>
              <p className="henig-body-large text-muted mb-8">
                Discover our handcrafted collection of fine jewellery, from engagement rings 
                to everyday elegance. Each piece crafted with precision and care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-henig-primary">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="border-b border-border sticky top-[104px] bg-background z-30">
          <div className="henig-container">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-6 overflow-x-auto">
                <Link to="/diamonds" className="text-sm text-muted hover:text-primary transition-colors whitespace-nowrap">
                  Diamonds
                </Link>
                <span className="text-sm font-medium text-primary border-b-2 border-primary pb-1 whitespace-nowrap">
                  Jewellery
                </span>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-secondary' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-secondary' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-4 border-b border-border">
          <div className="henig-container">
            <FilterBar onSortChange={() => {}} />
          </div>
        </section>

        {/* New In: The Edit */}
        <section className="py-16 md:py-24">
          <div className="henig-container">
            <SectionHeader
              caption="New Arrivals"
              title="New In: The Edit"
              showSeparator
            />

            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
              {productsWithImages.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button className="btn-henig-outline">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="henig-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="henig-caption text-muted mb-4 block">Our Promise</span>
                <h2 className="henig-heading-section text-foreground mb-6">
                  Our Commitment to Craftsmanship & Quality
                </h2>
                <p className="text-muted mb-6">
                  At Henig Diamonds, we provide the quality, reliability, and support you need to succeed.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg text-foreground mb-2">Design Excellence</h4>
                    <p className="text-sm text-muted">
                      Combining craftsmanship and market foresight to deliver designs that help our partners stay ahead.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-foreground mb-2">Certified & Authenticated</h4>
                    <p className="text-sm text-muted">
                      Our inventory is certified by leading laboratories like GIA, IGI, and HRD.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-foreground mb-2">In-House Manufacturing</h4>
                    <p className="text-sm text-muted">
                      We offer in-house design, with a wide selection of metal options from 9K to 18K gold and platinum.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-foreground mb-2">Retail-Ready Jewelry</h4>
                    <p className="text-sm text-muted">
                      Our hallmarked jewelry is crafted to be display-ready.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                {productsWithImages.slice(0, 4).map((product, index) => (
                  <div
                    key={product.id}
                    className="aspect-square rounded-sm overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-16 md:py-24">
          <div className="henig-container">
            <SectionHeader
              title="Shop Jewellery by Category"
              subtitle="We prioritize ethical sourcing through strict adherence to the Kimberley Process and RJC certification."
              showSeparator
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {jewelleryCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/jewellery/${category.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4 bg-secondary">
                      {categoryImages[category.id] ? (
                        <img
                          src={categoryImages[category.id]}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl text-muted">✦</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/30 transition-colors duration-300" />
                    </div>
                    <h3 className="font-serif text-lg text-center text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-16 md:py-24 bg-henig-cream">
          <div className="henig-container">
            <SectionHeader
              caption="Popular Choices"
              title="Bestsellers"
              showSeparator
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productsWithImages.map((product, index) => (
                <ProductCard
                  key={`bestseller-${product.id}`}
                  product={{ ...product, isBestseller: true, isNew: false }}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Excellence & Certifications */}
        <section className="py-16 md:py-24">
          <div className="henig-container">
            <SectionHeader
              caption="Jewellers Excellence"
              title="Certified for Your Clients"
            />

            <div className="grid md:grid-cols-2 gap-12">
              {/* Associations */}
              <div>
                <h4 className="text-sm text-muted uppercase tracking-widest mb-6 text-center">
                  Professional Associations
                </h4>
                <div className="flex flex-wrap justify-center gap-6">
                  {jewellerAssociations.slice(0, 5).map((assoc) => (
                    <div key={assoc.name} className="text-center px-4 py-2">
                      <p className="text-sm text-foreground">{assoc.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-sm text-muted uppercase tracking-widest mb-6 text-center">
                  Trusted by Jewellers Worldwide
                </h4>
                <div className="flex flex-wrap justify-center gap-8">
                  {certifications.map((cert) => (
                    <div key={cert.name} className="text-center">
                      <p className="font-serif text-lg text-foreground">{cert.name}</p>
                      {cert.subtitle && (
                        <p className="text-xs text-muted mt-1">{cert.subtitle}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-accent text-secondary">
          <div className="henig-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="henig-heading-section mb-6">Register With Us</h2>
              <p className="henig-body-large text-secondary/80 mb-8 max-w-2xl mx-auto">
                Join our network of trusted jewellers and gain access to our full inventory.
              </p>
              <Button
                className="btn-henig-gold"
                size="lg"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Partner With Us
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default Jewellery;
