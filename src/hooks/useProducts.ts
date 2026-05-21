import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import type { ZohoProduct } from '@/types/product';

export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  status?: string;
  bestseller?: boolean;
  new_arrival?: boolean;
}

export interface ProductListResult {
  items: ZohoProduct[];
  pageContext: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(params: ProductListParams = {}): ProductListResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  return {
    items: data?.items ?? [],
    pageContext: data?.page_context ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

export interface ProductDetailResult {
  product: ZohoProduct | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(id: string | undefined): ProductDetailResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getOne(id!).then((res) => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    product: data?.item ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
