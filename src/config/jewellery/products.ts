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
  slug: string;
  image: string;
  description?: string;
}

// Jewellery Categories
export const jewelleryCategories: Category[] = [
  { id: 'earrings', name: 'Earrings', slug: 'earrings', image: '', description: 'Elegant earrings for every occasion' },
  { id: 'engagement-rings', name: 'Engagement Rings', slug: 'engagement-rings', image: '', description: 'Symbols of eternal love' },
  { id: 'bracelets', name: 'Bracelets', slug: 'bracelets', image: '', description: 'Timeless wrist elegance' },
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', image: '', description: 'Stunning statement pieces' },
];

// Diamond Categories
export const diamondCategories: Category[] = [
  { id: 'naturals', name: 'Naturals', slug: 'naturals', image: '' },
  { id: 'lab-grown', name: 'Lab Grown', slug: 'lab-grown', image: '' },
  { id: 'gemstones', name: 'Gemstones', slug: 'gemstones', image: '' },
];

// Filter options
export const sortOptions = [
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'bestsellers', label: 'Bestsellers' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];


// Collection types for home page
export const homeCollections = [
  { id: 'tennis-bracelets', name: 'Tennis Bracelets', description: 'Timeless elegance for every occasion' },
  { id: 'hoops', name: 'Hoops', description: 'Classic designs with modern brilliance' },
  { id: 'gemstone-necklaces', name: 'Gemstone Necklaces', description: 'Vibrant colors meet exceptional craftsmanship' },
  { id: 'eternity-rings', name: 'Eternity Rings', description: 'Symbols of endless love and commitment' },
];

// Diamond specific collections
export const diamondCollections = [
  { id: 'lab-grown', name: 'Lab-Grown Diamonds', description: 'A great alternative to natural diamonds, lab-growns hold the same level of brilliance as any other diamond formed in the earth.' },
  { id: 'diamond-pairs', name: 'Diamond Pairs', description: 'Although every diamond is unique, sometimes you do need them to be quite similar. Perfect for creating diamond earrings.' },
];
