import diamondsProduct1 from '@/assets/landing/bestseller/diamonds/product1.jpg';
import diamondsProduct2 from '@/assets/landing/bestseller/diamonds/product2.jpg';
import diamondsProduct3 from '@/assets/landing/bestseller/diamonds/product3.jpg';
import diamondsProduct4 from '@/assets/landing/bestseller/diamonds/product4.jpg';
import jewelleryProduct1 from '@/assets/landing/bestseller/jewellery/product1.jpg';
import jewelleryProduct2 from '@/assets/landing/bestseller/jewellery/product2.jpg';
import jewelleryProduct3 from '@/assets/landing/bestseller/jewellery/product3.jpg';
import jewelleryProduct4 from '@/assets/landing/bestseller/jewellery/product4.jpg';
import jewelleryProduct5 from '@/assets/landing/bestseller/jewellery/product5.jpg';
import jewelleryProduct6 from '@/assets/landing/bestseller/jewellery/product6.jpg';
import jewelleryProduct7 from '@/assets/landing/bestseller/jewellery/product7.jpg';
import jewelleryProduct8 from '@/assets/landing/bestseller/jewellery/product8.jpg';
import jewelleryProduct9 from '@/assets/landing/bestseller/jewellery/product9.jpg';
import jewelleryProduct10 from '@/assets/landing/bestseller/jewellery/product10.jpg';

export interface BestSellerProductProps {
  image: string;
  link: string;
  title: string;
  price: string;
}

export interface BestSellersSectionProps {
  products: BestSellerProductProps[];
}

export const BestSellerProducts: BestSellerProductProps[] = [
  {
    image: diamondsProduct1,
    link: '/diamonds',
    title: 'Mini Polished Interlocking Earrings',
    price: '£25.00'
  },
  {
    image: diamondsProduct2,
    link: '/diamonds',
    title: 'Interlocking Open Circle Necklace',
    price: '£28.00'
  },
  {
    image: diamondsProduct3,
    link: '/diamonds',
    title: 'Fine Crystal & Wave Wrist Stacking Set',
    price: '£28.00'
  },
  {
    image: diamondsProduct4,
    link: '/diamonds',
    title: 'Organic Open Circle Drop Earrings',
    price: '£35.00'
  },
  {
    image: jewelleryProduct1,
    link: '/jewellery',
    title: 'Geometric Gold Layered Necklace',
    price: '£32.50'
  },
  {
    image: jewelleryProduct2,
    link: '/jewellery',
    title: 'Pearl & Crystal Hoop Earrings',
    price: '£30.00'
  },
  {
    image: jewelleryProduct3,
    link: '/jewellery',
    title: 'Delicate Heart Charm Bracelet',
    price: '£22.00'
  },
  {
    image: jewelleryProduct4,
    link: '/jewellery',
    title: 'Classic Solitaire Pendant Necklace',
    price: '£40.00'
  },
  {
    image: jewelleryProduct5,
    link: '/jewellery',
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct6,
    link: '/jewellery',
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct7,
    link: '/jewellery',
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct8,
    link: '/jewellery',
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct9,
    link: '/jewellery',
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct10,
    link: '/jewellery',
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
];
