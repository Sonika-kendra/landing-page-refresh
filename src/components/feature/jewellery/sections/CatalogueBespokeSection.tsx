import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ImageWithSkeleton from "@/components/shared/ImageWithSkeleton";

import CatalogueImg from "@/assets/jewellery/catalogue/diamonds-category.jpg";
import BespokeImg from "@/assets/jewellery/catalogue/bespoke.png";

const MotionLink = motion(Link);

const items = [
  {
    title: "Catalogue",
    image: CatalogueImg,
    // href: "/catalogue",
  },
  {
    title: "Bespoke",
    image: BespokeImg,
    // href: "/bespoke",
  },
];

interface CatalogueBespokeSectionProps {
  onRegisterClick: () => void;
}

const CatalogueBespokeSection = ({ onRegisterClick }: CatalogueBespokeSectionProps) => {
  return (
    <section className="py-4 md:py-6 section-white">
      <div className="henig-container px-0 sm:px-0 lg:px-0">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {items.map((item, index) => (
            <MotionLink
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group block relative aspect-[3/2] md:aspect-[16/9] rounded-sm overflow-hidden"
            >
              {/* Image */}
              <ImageWithSkeleton
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                wrapperClassName="absolute inset-0 w-full h-full z-0"
                className="w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover"
              />

              {/* Permanent Dark Overlay */}
              <div className="absolute inset-0 bg-black/50 z-10" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <h3 className="mb-2 text-2xl md:text-4xl font-serif text-white">
                  {item.title}
                </h3>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRegisterClick}
                  className="bg-primary/80 backdrop-blur-sm border-secondary text-black transition-colors duration-300 group-hover:bg-secondary group-hover:text-accent"
                >
                  Enquire
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </MotionLink>

          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogueBespokeSection;
