// ============================================
// Product Data Configuration
// ============================================

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  material: string;
  image: string;
  category: 'earrings' | 'necklaces' | 'bracelets' | 'rings';
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  link?: string;
  image: string;
  slug?: string;
  description?: string;
}

// Filter options
export const sortOptions = [
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'bestsellers', label: 'Bestsellers' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];

// Diamond Categories
export const diamondCategories: Category[] = [
  { id: 'naturals', name: 'Naturals', slug: 'naturals', image: '' },
  { id: 'lab-grown', name: 'Lab Grown', slug: 'lab-grown', image: '' },
  { id: 'gemstones', name: 'Gemstones', slug: 'gemstones', image: '' },
];

// Diamond specific collections
export const diamondCollections = [
  { id: 'lab-grown', name: 'Lab-Grown Diamonds', description: 'A great alternative to natural diamonds, lab-growns hold the same level of brilliance as any other diamond formed in the earth.' },
  { id: 'diamond-pairs', name: 'Diamond Pairs', description: 'Although every diamond is unique, sometimes you do need them to be quite similar. Perfect for creating diamond earrings.' },
];
