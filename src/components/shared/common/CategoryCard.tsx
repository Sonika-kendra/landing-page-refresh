import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  index?: number;
  size?: 'small' | 'medium' | 'large';
}

const CategoryCard = ({
  name,
  image,
  href,
  index = 0,
  size = 'medium',
}: CategoryCardProps) => {
  const aspectRatios = {
    small: 'aspect-square',
    medium: 'aspect-[4/3]',
    large: 'aspect-[3/2]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={href}
        className={`group henig-image-overlay block relative ${aspectRatios[size]} rounded-sm overflow-hidden`}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-4xl text-muted">✦</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="overlay-text flex-col text-center p-8">
          <h3 className="font-serif text-2xl md:text-3xl text-secondary">{name}</h3>
        </div>

        {/* Default title */}
        <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-500 group-hover:opacity-0">
          <h3 className="font-serif text-xl md:text-2xl text-foreground bg-background/80 px-4 py-2 inline-block">
            {name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
