import { Category } from "./products";
import eternityRing from '@/assets/jewellery/category/eternity-ring.jpg';
import tennisBracelet from '@/assets/jewellery/category/tennis-bracelet.jpg';
import hoops from '@/assets/jewellery/category/hoops.jpg';
import gemstoneNecklace from '@/assets/jewellery/category/gemstone-necklace.jpg';
import { websiteUrlConfig } from "../config";

// Jewellery Categories
export const jewelleryCategories: Category[] = [
  { id: 'rings', name: 'Rings', link: websiteUrlConfig.Jewellery.Rings, image: eternityRing, description: 'Symbols of eternal love' },
  { id: 'bracelets', name: 'Bracelets', link: websiteUrlConfig.Jewellery.Bracelets, image: tennisBracelet, description: 'Timeless wrist elegance' },
  { id: 'earrings', name: 'Earrings', link: websiteUrlConfig.Jewellery.Earrings, image: hoops, description: 'Elegant earrings for every occasion' },
  { id: 'necklaces', name: 'Necklaces', link: websiteUrlConfig.Jewellery.Necklaces, image: gemstoneNecklace, description: 'Stunning statement pieces' },
];