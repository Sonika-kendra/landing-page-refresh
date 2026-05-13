import imgRingWG from '../../assets/shop/product/Front view WG - ring.jpg';
import imgRingYG from '../../assets/shop/product/Front view YG - ring.jpg';
import imgRing from '../../assets/shop/product/RI12-W (1).jpg';
import imgEarrings from '../../assets/shop/product/ER41-W (2).jpg';
import imgEarringsHoop from '../../assets/shop/product/Side View - Earrings (2 hoops).jpg';
import imgEarringsSide from '../../assets/shop/product/Side View - Earrings (1).jpg';
import imgBracelet from '../../assets/shop/product/Front View - Bracelet.jpg';
import imgPendant from '../../assets/shop/product/Front view-pendant.jpg';
import imgPendant2 from '../../assets/shop/product/PD01-W (3).jpg';
import imgPendant3 from '../../assets/shop/product/PD15-W (1).jpeg';

export interface ShopProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  subCategory: string;
  metal: string;
  metalOptions: string[];
  shape: string;
  stockType: 'Natural' | 'Lab';
  price: number;
  image: string;
  hoverImage?: string;
  badge?: 'NEW STOCK' | 'ONLY FEW LEFT';
  certificate?: string;
  caratOptions?: string[];
  sizeOptions?: string[];
  stoneType?: string;
  colour?: string;
  clarity?: string;
  setting?: string;
  goldWeight?: string;
  totalWeight?: string;
  description?: string;
  itemRef?: string;
  stock?: number;
  images?: string[];
}

export const categories = ['Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Bangles', 'Pendants'];
export const subCategories = ['Halo', 'Solitaire', 'Three Stone', 'Eternity', 'Cluster'];
export const metals = ['18K_YG', '18K_WG', '9K_YG', '9K_WG', 'Pt950'];
export const shapes = ['Round', 'Pear', 'Oval', 'Emerald', 'Princess', 'Cushion'];
export const stockTypes = ['Natural', 'Lab'];

const categoryProductNames: Record<string, string> = {
  Rings: 'Engagement Ring',
  Earrings: 'Diamond Earrings',
  Bracelets: 'Diamond Bracelet',
  Necklaces: 'Diamond Necklace',
  Bangles: 'Round Bangle',
  Pendants: 'Diamond Pendant',
};

const categoryImages: Record<string, string> = {
  Rings: imgRingWG,
  Earrings: imgEarrings,
  Bracelets: imgBracelet,
  Necklaces: imgPendant,
  Bangles: imgRing,
  Pendants: imgPendant2,
};

const categoryHoverImages: Record<string, string> = {
  Rings: imgRingYG,
  Earrings: imgEarringsHoop,
  Bracelets: imgBracelet,
  Necklaces: imgPendant3,
  Bangles: imgEarringsSide,
  Pendants: imgPendant,
};

const categoryGalleryImages: Record<string, string[]> = {
  Rings: [imgRingWG, imgRingYG, imgRing],
  Earrings: [imgEarrings, imgEarringsHoop, imgEarringsSide],
  Bracelets: [imgBracelet, imgRingWG, imgRing],
  Necklaces: [imgPendant, imgPendant2, imgPendant3],
  Bangles: [imgRing, imgRingWG, imgRingYG],
  Pendants: [imgPendant2, imgPendant3, imgPendant],
};

export const shopProducts: ShopProduct[] = Array.from({ length: 24 }, (_, i) => {
  const category = categories[i % categories.length];
  return {
    id: `prod-${i + 1}`,
    sku: `LSE${2110 + i}D`,
    name: `${shapes[i % shapes.length]} Diamond ${categoryProductNames[category]}`,
    category,
    subCategory: subCategories[i % subCategories.length],
    metal: metals[i % metals.length],
    metalOptions: ['18K_YG', '18K_WG', '9K_YG', '9K_WG', 'Pt950'],
    shape: shapes[i % shapes.length],
    stockType: stockTypes[i % stockTypes.length] as ShopProduct['stockType'],
    price: 620 + (i % 8) * 185,
    image: categoryImages[category],
    hoverImage: categoryHoverImages[category],
    badge: i % 5 === 1 ? 'NEW STOCK' : i % 7 === 0 ? 'ONLY FEW LEFT' : undefined,
    certificate: 'IGI',
    caratOptions: ['1', '2', '3'],
    sizeOptions: ['K', 'L', 'M', 'N'],
    stoneType: 'Lab created diamond',
    colour: 'I',
    clarity: 'SI1',
    setting: '4 Prong',
    goldWeight: '10.2 g',
    totalWeight: 'Approx. 0.2000 ct. wt. (0.200ct. x 1)',
    description: 'This magnificent ring encapsulates the luxury of old fashioned glamour. The radiant stone is intensified by Premium Quality Diamonds and a gold band.',
    itemRef: `E${5358 + i}`,
    stock: i % 7 === 0 ? 2 : i % 5 === 1 ? 15 : 6,
    images: categoryGalleryImages[category],
  };
});

export const youMayAlsoLike = [
  { name: 'Bezel Setting Solitaire Diamonds Rings', image: imgRingWG },
  { name: 'Bezel Setting Multi-Stone Diamonds', image: imgEarrings },
  { name: 'Bangles', image: imgBracelet },
  { name: 'Bangles', image: imgRing },
  { name: 'Bezel Setting Solitaire Diamonds Rings', image: imgPendant2 },
];
