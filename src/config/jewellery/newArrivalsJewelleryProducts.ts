// Import placeholder images
import product1 from '@/assets/jewellery/newArrivals/product1.png';
import product2 from '@/assets/jewellery/newArrivals/product2.png';
import product3 from '@/assets/jewellery/newArrivals/product3.png';
import product4 from '@/assets/jewellery/newArrivals/product4.png';
import product5 from '@/assets/jewellery/newArrivals/product5.png';
import product6 from '@/assets/jewellery/newArrivals/product6.png';
import product7 from '@/assets/jewellery/newArrivals/product7.png';
import product8 from '@/assets/jewellery/newArrivals/product8.png';
import { Product } from './products';

export const newArrivalsJewelleryProducts: Product[] = [
  {
    id: 'j1',
    name: 'Mini Polished Interlocking Earrings',
    price: 25.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product1,
    category: 'earrings',
    isNew: true,
  },
  {
    id: 'j2',
    name: 'Interlocking Open Circle Necklace',
    price: 28.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product2,
    category: 'necklaces',
    isNew: true,
  },
  {
    id: 'j3',
    name: 'Fine Crystal & Wave Wrist Stacking Set',
    price: 28.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product3,
    category: 'bracelets',
    isNew: true,
  },
  {
    id: 'j4',
    name: 'Organic Open Circle Drop Earrings',
    price: 35.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product4,
    category: 'earrings',
    isNew: true,
  },
  {
    id: 'j5',
    name: 'Geometric Gold Layered Necklace',
    price: 32.5,
    currency: '£',
    material: '18k Gold Plated',
    image: product5,
    category: 'necklaces',
    isNew: false,
  },
  {
    id: 'j6',
    name: 'Pearl & Crystal Hoop Earrings',
    price: 30.0,
    currency: '£',
    material: 'Sterling Silver',
    image: product6,
    category: 'earrings',
    isNew: true,
  },
  {
    id: 'j7',
    name: 'Delicate Heart Charm Bracelet',
    price: 22.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product7,
    category: 'bracelets',
    isNew: false,
  },
  {
    id: 'j8',
    name: 'Classic Solitaire Pendant Necklace',
    price: 40.0,
    currency: '£',
    material: '14k White Gold',
    image: product8,
    category: 'necklaces',
    isNew: true,
  }
];
