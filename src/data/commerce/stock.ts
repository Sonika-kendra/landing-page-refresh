export interface StockItem {
  productId: string;
  sku: string;
  name: string;
  category: string;
  available: number;
  reserved: number;
  threshold: number;
}

export const mockStock: StockItem[] = [
  { productId: 'prod-1', sku: 'RI12-W', name: 'Round Solitaire Ring',  category: 'Rings',     available: 12, reserved: 2, threshold: 5 },
  { productId: 'prod-2', sku: 'ER41-W', name: 'Diamond Hoop Earrings', category: 'Earrings',  available: 4,  reserved: 1, threshold: 5 },
  { productId: 'prod-3', sku: 'BR07-W', name: 'Tennis Bracelet',       category: 'Bracelets', available: 8,  reserved: 0, threshold: 3 },
  { productId: 'prod-4', sku: 'PD15-W', name: 'Pendant Necklace',      category: 'Necklaces', available: 0,  reserved: 0, threshold: 3 },
  { productId: 'prod-5', sku: 'ER22-W', name: 'Stud Earrings',         category: 'Earrings',  available: 22, reserved: 4, threshold: 5 },
];
