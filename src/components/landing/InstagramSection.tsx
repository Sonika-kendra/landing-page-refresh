import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import instagram1 from '@/assets/instagram-1.jpg';
import instagram2 from '@/assets/instagram-2.jpg';
import instagram3 from '@/assets/instagram-3.jpg';
import instagram4 from '@/assets/instagram-4.jpg';

const instagramPosts = [
  { id: 1, image: instagram1 },
  { id: 2, image: instagram2 },
  { id: 3, image: instagram3 },
  { id: 4, image: instagram4 },
];

const InstagramSection = () => {
  return (
    <section className="py-16 md:py-24 bg-henig-cream">
      <div className="henig-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="henig-caption text-muted mb-4 block">What We're Up To</span>
          <h2 className="henig-heading-section text-foreground mb-4">
            @HenigDiamonds
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
          >
            <Instagram className="w-4 h-4" />
            View Instagram
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
