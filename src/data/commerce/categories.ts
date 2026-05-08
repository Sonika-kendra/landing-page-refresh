export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Diamonds',   slug: 'diamonds',   parentId: null,    productCount: 124, status: 'active',   createdAt: '2024-12-01' },
  { id: 'cat-2', name: 'Natural',    slug: 'natural',    parentId: 'cat-1', productCount: 78,  status: 'active',   createdAt: '2024-12-01' },
  { id: 'cat-3', name: 'Lab Grown',  slug: 'lab-grown',  parentId: 'cat-1', productCount: 46,  status: 'active',   createdAt: '2024-12-01' },
  { id: 'cat-4', name: 'Jewellery',  slug: 'jewellery',  parentId: null,    productCount: 210, status: 'active',   createdAt: '2024-12-01' },
  { id: 'cat-5', name: 'Rings',      slug: 'rings',      parentId: 'cat-4', productCount: 88,  status: 'active',   createdAt: '2024-12-02' },
  { id: 'cat-6', name: 'Earrings',   slug: 'earrings',   parentId: 'cat-4', productCount: 54,  status: 'active',   createdAt: '2024-12-02' },
  { id: 'cat-7', name: 'Necklaces',  slug: 'necklaces',  parentId: 'cat-4', productCount: 38,  status: 'active',   createdAt: '2024-12-02' },
  { id: 'cat-8', name: 'Bracelets',  slug: 'bracelets',  parentId: 'cat-4', productCount: 30,  status: 'inactive', createdAt: '2024-12-02' },
];
