import { Category } from "./products";
import ring from '@/assets/jewellery/category/ring.png';
import bracelet from '@/assets/jewellery/category/bracelet.png';
import earrings from '@/assets/jewellery/category/earrings.png';
import necklace from '@/assets/jewellery/category/necklace.png';
import { websiteUrlConfig } from "../config";

// Jewellery Categories
export const jewelleryCategories: Category[] = [
  { id: 'rings', name: 'Rings', link: websiteUrlConfig.Jewellery.Rings, image: ring, description: 'Symbols of eternal love' },
  { id: 'bracelets', name: 'Bracelets', link: websiteUrlConfig.Jewellery.Bracelets, image: bracelet, description: 'Timeless wrist elegance' },
  { id: 'earrings', name: 'Earrings', link: websiteUrlConfig.Jewellery.Earrings, image: earrings, description: 'Elegant earrings for every occasion' },
  { id: 'necklaces', name: 'Necklaces', link: websiteUrlConfig.Jewellery.Necklaces, image: necklace, description: 'Stunning statement pieces' },
];