import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import RegistrationModal from '@/components/landing/RegistrationModal';
import SectionHeader from '@/components/shared/SectionHeader';
import FilterBar from '@/components/shared/FilterBar';
import { stats, certifications, features } from '@/config/theme';
import { diamondCollections } from '@/config/products';

// Import images
import diamondsHero from '@/assets/diamonds-hero.jpg';
import labGrownDiamond from '@/assets/lab-grown-diamond.jpg';
import diamondPairs from '@/assets/diamond-pairs.jpg';
import tennisBracelet from '@/assets/tennis-bracelet.jpg';
import hoops from '@/assets/hoops.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import eternityRing from '@/assets/eternity-ring.jpg';

const collections = [
  { id: 'tennis', name: 'Tennis Bracelets', image: tennisBracelet, href: '/jewellery' },
  { id: 'hoops', name: 'Hoops', image: hoops, href: '/jewellery' },
  { id: 'gemstone', name: 'Gemstone Necklaces', image: gemstoneNecklace, href: '/jewellery' },
  { id: 'eternity', name: 'Eternity Rings', image: eternityRing, href: '/jewellery' },
];

const Diamonds = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onRegisterClick={() => setIsRegisterModalOpen(true)} />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] pt-32 md:pt-40 pb-16 overflow-hidden bg-accent">
          <div className="absolute inset-0">
            <img
              src={diamondsHero}
              alt="Diamonds collection"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/40" />
          </div>

          <div className="henig-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="henig-heading-display text-secondary mb-6">
                Diamonds
              </h1>
              <p className="henig-body-large text-secondary/80 mb-8">
                Explore our collection of independently certified and conflict-free diamonds. 
                From natural to lab-grown, find the perfect stone for your creation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="#naturals">
                  <Button className="btn-henig-gold">Natural Diamonds</Button>
                </Link>
                <Link to="#lab-grown">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-accent">
                    Lab-Grown Diamonds
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-border">
          <div className="henig-container">
            <FilterBar showDiamondFilters onSortChange={() => {}} />
          </div>
        </section>

        {/* Diamond Collections Grid */}
        <section className="py-16 md:py-24">
          <div className="henig-container">
            <SectionHeader
              title="Shop by Collection"
              showSeparator
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {collections.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={item.href} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-sm mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300" />
                    </div>
                    <h3 className="font-serif text-lg text-center text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="henig-container">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Lab-Grown Diamonds */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[4/3] md:aspect-square">
                  <img
                    src={labGrownDiamond}
                    alt="Lab-Grown Diamonds"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-secondary mb-3">
                    Lab-Grown Diamonds
                  </h3>
                  <p className="text-secondary/80 text-sm mb-4 max-w-sm">
                    {diamondCollections[0].description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-fit border-secondary text-secondary hover:bg-secondary hover:text-accent"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>

              {/* Diamond Pairs */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[4/3] md:aspect-square">
                  <img
                    src={diamondPairs}
                    alt="Diamond Pairs"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-secondary mb-3">
                    Diamond Pairs
                  </h3>
                  <p className="text-secondary/80 text-sm mb-4 max-w-sm">
                    {diamondCollections[1].description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-fit border-secondary text-secondary hover:bg-secondary hover:text-accent"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24">
          <div className="henig-container">
            <SectionHeader
              caption="Henig Diamonds"
              title="A Heritage of Trust, Innovation, and Excellence"
              subtitle="Since 1973, we've been crafting timeless pieces that celebrate life's most precious moments."
            />

            <div className="grid grid-cols-3 gap-6 md:gap-12 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-serif text-2xl md:text-4xl text-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm md:text-base text-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-t border-border pt-12"
            >
              <p className="text-center text-sm text-muted mb-8 uppercase tracking-widest">
                Certified by Leading Laboratories
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {certifications.map((cert) => (
                  <div key={cert.name} className="text-center">
                    <p className="font-serif text-lg md:text-xl text-foreground">
                      {cert.name}
                    </p>
                    {cert.subtitle && (
                      <p className="text-xs text-muted mt-1">{cert.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
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
                Join our network of trusted jewellers and gain access to our full inventory, 
                competitive pricing, and expert support.
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

export default Diamonds;
