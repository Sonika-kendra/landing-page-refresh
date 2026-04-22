import product1 from '@/assets/jewellery/bestseller/product1.png';
import product2 from '@/assets/jewellery/bestseller/product2.png';
import product3 from '@/assets/jewellery/bestseller/product3.png';
import product5 from '@/assets/jewellery/bestseller/product5.png';
import product7 from '@/assets/jewellery/bestseller/product7.png';
import product8 from '@/assets/jewellery/bestseller/product8.png';
import { Product } from './products';

export const BestSellerProducts: Product[] = [
  {
    id: 'j1',
    name: 'Mini Polished Interlocking Earrings',
    price: 25.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product1,
    category: 'earrings',
  },
  {
    id: 'j2',
    name: 'Interlocking Open Circle Necklace',
    price: 28.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product2,
    category: 'necklaces',
  },
  {
    id: 'j3',
    name: 'Fine Crystal & Wave Wrist Stacking Set',
    price: 28.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product3,
    category: 'bracelets',
  },
  {
    id: 'j5',
    name: 'Geometric Gold Layered Necklace',
    price: 32.5,
    currency: '£',
    material: '18k Gold Plated',
    image: product5,
    category: 'necklaces',
  },
  {
    id: 'j8',
    name: 'Classic Solitaire Pendant Necklace',
    price: 40.0,
    currency: '£',
    material: '14k White Gold',
    image: product8,
    category: 'necklaces',
  },
  {
    id: 'j7',
    name: 'Delicate Heart Charm Bracelet',
    price: 22.0,
    currency: '£',
    material: '18k Gold Plated',
    image: product7,
    category: 'bracelets',
  },
];
