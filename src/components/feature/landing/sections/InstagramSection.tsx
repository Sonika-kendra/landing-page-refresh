import { brandConfig } from '@/config/landing/theme';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const InstagramSection = () => {
  const [instagramPosts, setInstagramPosts] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visiblePosts = 4; // Number of posts to display at a time

  useEffect(() => {
    // Load all images from socialmedia folder
    const images = Object.values(
      import.meta.glob('@/assets/landing/socialmedia/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
      })
    ) as string[];

    setInstagramPosts(images);
  }, []);

  // Navigation
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(instagramPosts.length - visiblePosts, 0) : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= instagramPosts.length - visiblePosts ? 0 : prev + 1
    );
  };

  return (
    <section className="py-12 md:py-16">
      <div className="henig-container">
        <div className="text-center mb-8">
          {/* <span className="henig-caption text-muted mb-2 block">What We're Up To</span> */}
          <h2 className="henig-heading-section text-foreground mb-2">@HenigDiamonds</h2>
          {/* <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
          >
            <Instagram className="w-4 h-4" />
            View Instagram
            <ExternalLink className="w-3 h-3" />
          </a> */}
        </div>

        {/* Carousel with arrows outside */}
        <div className="flex items-center justify-between">
          {/* Left arrow */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full shadow bg-white/70 hover:bg-white transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Carousel container */}
          <div className="relative overflow-hidden flex-1 mx-4">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${(100 / visiblePosts) * currentIndex}%)` }}
            >
              {instagramPosts.map((post, index) => (
                <motion.div
                  key={index}
                  className="p-1 flex-shrink-0 w-1/4 group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={post}
                      alt="Instagram post"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/30 transition-colors duration-300 flex items-center justify-center">
                      <a
                        href={brandConfig.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="w-8 h-8 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full shadow bg-white/70 hover:bg-white transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
