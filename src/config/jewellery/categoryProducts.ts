import { Category } from "./products";
import eternityRing from '@/assets/jewellery/category/eternity-ring.jpg';
import tennisBracelet from '@/assets/jewellery/category/tennis-bracelet.jpg';
import hoops from '@/assets/jewellery/category/hoops.jpg';
import gemstoneNecklace from '@/assets/jewellery/category/gemstone-necklace.jpg';

// Jewellery Categories
export const jewelleryCategories: Category[] = [
  { id: 'rings', name: 'Rings', slug: 'rings', image: eternityRing, description: 'Symbols of eternal love' },
  { id: 'bracelets', name: 'Bracelets', slug: 'bracelets', image: tennisBracelet, description: 'Timeless wrist elegance' },
  { id: 'earrings', name: 'Earrings', slug: 'earrings', image: hoops, description: 'Elegant earrings for every occasion' },
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', image: gemstoneNecklace, description: 'Stunning statement pieces' },
];