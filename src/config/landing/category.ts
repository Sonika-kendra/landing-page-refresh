import diamondsImage from '@/assets/diamonds-category.jpg';
import jewelleryImage from '@/assets/jewellery-category.jpg';
import { websiteUrlConfig } from '../config';

export const categories = [
  {
    title: 'Diamonds',
    description:
      'Explore our collection of loose diamonds, certified and conflict-free.',
    image: diamondsImage,
    href: websiteUrlConfig.Diamonds.Home,
  },
  {
    title: 'Jewellery',
    description:
      'Discover handcrafted pieces from engagement rings to everyday elegance.',
    image: jewelleryImage,
    href: websiteUrlConfig.Jewellery.Home,
  },
];