import jewelleryProduct1 from '@/assets/landing/bestseller/jewellery/product1.png';
import jewelleryProduct2 from '@/assets/landing/bestseller/jewellery/product2.png';
import jewelleryProduct3 from '@/assets/landing/bestseller/jewellery/product3.png';
import jewelleryProduct4 from '@/assets/landing/bestseller/jewellery/product4.jpg';
import jewelleryProduct5 from '@/assets/landing/bestseller/jewellery/product5.png';
import jewelleryProduct6 from '@/assets/landing/bestseller/jewellery/product6.png';
import jewelleryProduct7 from '@/assets/landing/bestseller/jewellery/product7.png';
import jewelleryProduct8 from '@/assets/landing/bestseller/jewellery/product8.png';
import { websiteUrlConfig } from '../config';

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
  // {
  //   image: diamondsProduct1,
  //   link: websiteUrlConfig.Diamonds.All,
  //   title: 'Mini Polished Interlocking Earrings',
  //   price: '£25.00'
  // },
  // {
  //   image: diamondsProduct2,
  //   link: websiteUrlConfig.Diamonds.All,
  //   title: 'Interlocking Open Circle Necklace',
  //   price: '£28.00'
  // },
  // {
  //   image: diamondsProduct3,
  //   link: websiteUrlConfig.Diamonds.All,
  //   title: 'Fine Crystal & Wave Wrist Stacking Set',
  //   price: '£28.00'
  // },
  // {
  //   image: diamondsProduct4,
  //   link: websiteUrlConfig.Diamonds.All,
  //   title: 'Organic Open Circle Drop Earrings',
  //   price: '£35.00'
  // },
  {
    image: jewelleryProduct1,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Geometric Gold Layered Necklace',
    price: '£32.50'
  },
  {
    image: jewelleryProduct2,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Pearl & Crystal Hoop Earrings',
    price: '£30.00'
  },
  {
    image: jewelleryProduct3,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Delicate Heart Charm Bracelet',
    price: '£22.00'
  },
  {
    image: jewelleryProduct4,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Classic Solitaire Pendant Necklace',
    price: '£40.00'
  },
  {
    image: jewelleryProduct5,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct6,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct7,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  },
  {
    image: jewelleryProduct8,
    link: websiteUrlConfig.Jewellery.All,
    title: 'Twist Knot Stud Earrings',
    price: '£18.00'
  }
  // {
  //   image: jewelleryProduct9,
  //   link: websiteUrlConfig.Jewellery.All,
  //   title: 'Twist Knot Stud Earrings',
  //   price: '£18.00'
  // },
  // {
  //   image: jewelleryProduct10,
  //   link: websiteUrlConfig.Jewellery.All,
  //   title: 'Twist Knot Stud Earrings',
  //   price: '£18.00'
  // },
];
