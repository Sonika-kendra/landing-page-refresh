import { Link } from 'react-router-dom';
import { websiteUrlConfig } from '@/config/site';
import { useAuth } from '@/context/AuthContext';
import round from '@/assets/diamonds/shapes/round.png';
import oval from '@/assets/diamonds/shapes/oval.png';
import cushion from '@/assets/diamonds/shapes/cushion.png';
import pear from '@/assets/diamonds/shapes/pear.png';
import emerald from '@/assets/diamonds/shapes/emerald.png';
import princess from '@/assets/diamonds/shapes/princess.png';
import heart from '@/assets/diamonds/shapes/heart.png';
import marquise from '@/assets/diamonds/shapes/marquise.png';
import asscher from '@/assets/diamonds/shapes/asscher.png';
import radiant from '@/assets/diamonds/shapes/radiant.png';

const shapes = [
  { label: 'Round', image: round },
  { label: 'Oval', image: oval },
  { label: 'Cushion', image: cushion },
  { label: 'Pear', image: pear },
  { label: 'Emerald', image: emerald },
  { label: 'Princess', image: princess },
  { label: 'Heart', image: heart },
  { label: 'Marquise', image: marquise },
  { label: 'Asscher', image: asscher },
  { label: 'Radiant', image: radiant },
];

const ShapeSection = () => {
  const { isAuthenticated, openModal } = useAuth();
  return (
  <section className="pt-2 md:pt-3 pb-10 md:pb-12 px-4 sm:px-6 lg:px-8 bg-white">
    <h2 className="henig-heading-section text-center text-foreground mb-6">
      Shop diamonds by shape
    </h2>
    <div className="flex flex-wrap justify-between gap-y-6">
      {shapes.map((shape) => {
        const href = `${websiteUrlConfig.Diamonds.All}?shape=${shape.label}`;
        return (
        <Link
          key={shape.label}
          to={href}
          onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); openModal('login', href); } }}
          className="group flex flex-col items-center gap-2 flex-1 min-w-[80px]"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
            <img
              src={shape.image}
              alt={shape.label}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-125"
            />
          </div>
          <span className="text-xs md:text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors text-center">
            {shape.label}
          </span>
        </Link>
        );
      })}
    </div>
  </section>
  );
};

export default ShapeSection;
