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

const demoImage = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
const demoImage2 = 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop';
const demoImage3 = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop';
const demoImage4 = 'https://images.unsplash.com/photo-1515562141589-67f0d1a34db8?w=400&h=400&fit=crop';

export const shopProducts: ShopProduct[] = Array.from({ length: 24 }, (_, i) => ({
  id: `prod-${i + 1}`,
  sku: `LSE${2110 + i}D`,
  name: 'Round Diamond Engagement Ring',
  category: 'Rings',
  subCategory: i % 3 === 0 ? 'Halo' : i % 3 === 1 ? 'Solitaire' : 'Three Stone',
  metal: '18K YG',
  metalOptions: ['18K', '18K', '9K', '9K'],
  shape: i % 2 === 0 ? 'Round' : 'Pear',
  stockType: i % 4 === 0 ? 'Lab' : 'Natural',
  price: 768,
  image: i % 4 === 0 ? demoImage : i % 4 === 1 ? demoImage2 : i % 4 === 2 ? demoImage3 : demoImage4,
  hoverImage: i % 4 === 0 ? demoImage2 : demoImage,
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
  images: [demoImage, demoImage2, demoImage3, demoImage4],
}));

export const categories = ['Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Bangles', 'Pendants'];
export const subCategories = ['Halo', 'Solitaire', 'Three Stone', 'Eternity', 'Cluster'];
export const metals = ['18K YG', '18K WG', '9K YG', '9K WG', 'Platinum'];
export const shapes = ['Round', 'Pear', 'Oval', 'Emerald', 'Princess', 'Cushion'];
export const stockTypes = ['Natural', 'Lab'];

export const youMayAlsoLike = [
  { name: 'Bezel Setting Solitaire Diamonds Rings', image: demoImage },
  { name: 'Bezel Setting Multi-Stone Diamonds', image: demoImage2 },
  { name: 'Bangles', image: demoImage3 },
  { name: 'Bangles', image: demoImage4 },
  { name: 'Bezel Setting Solitaire Diamonds Rings', image: demoImage },
];
