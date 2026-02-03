import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product } from '@/config/jewellery/products';

interface ProductCardProps {
  product: Product;
  index?: number;
  showPrice?: boolean;
  showMaterial?: boolean;
  showWishlist?: boolean;
}

const ProductCard = ({
  product,
  index = 0,
  showPrice = true,
  showMaterial = true,
  showWishlist = true,
}: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-sm mb-4 bg-secondary">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <span className="text-4xl">✦</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300" />
        
        {/* New badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs px-2 py-1 uppercase tracking-wider">
            New
          </span>
        )}

        {/* New badge */}
        {product.isBestseller && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs px-2 py-1 uppercase tracking-wider">
            Best Seller
          </span>
        )}
        
        {/* Wishlist button */}
        {showWishlist && (
          <button className="absolute top-3 right-3 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
            <Heart className="w-4 h-4 text-foreground" />
          </button>
        )}
      </div>
      
      <h3 className="font-serif text-base md:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
        {product.name}
      </h3>
      
      {showMaterial && (
        <p className="text-xs text-muted mb-1">{product.material}</p>
      )}
      
      {showPrice && (
        <p className="text-sm font-medium text-foreground">
          {product.currency}{product.price.toFixed(2)}
        </p>
      )}
    </motion.div>
  );
};

export default ProductCard;
