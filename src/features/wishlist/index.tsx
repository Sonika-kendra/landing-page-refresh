import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productPath } from '@/lib/utils';
import { Heart, ShoppingBag, LayoutGrid, List } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import { Button } from '@/components/ui/button';
import { useFavourites } from '@/context/FavouritesContext';
import { productsApi } from '@/api/products';
import { mapZohoToShopProduct } from '@/data/shop/mappers';
import type { ShopProduct } from '@/data/shop/products';

const Wishlist = () => {
  const { favourites, loading: favLoading } = useFavourites();
  const [wishlisted, setWishlisted] = useState<ShopProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const handleAddToBag = (product: ShopProduct) => {
    navigate(productPath(product.category, product.subCategory, product.id));
    return Promise.resolve();
  };

  useEffect(() => {
    if (favLoading || favourites.length === 0) {
      setWishlisted([]);
      return;
    }
    setLoadingProducts(true);
    Promise.all(
      favourites.map((id) =>
        productsApi.getOne(id)
          .then((res) => {
            const item = res.data?.item as Record<string, unknown> | undefined;
            return item ? mapZohoToShopProduct(item) : null;
          })
          .catch(() => null)
      )
    )
      .then((results) => setWishlisted(results.filter(Boolean) as ShopProduct[]))
      .finally(() => setLoadingProducts(false));
  }, [favourites, favLoading]);

  const isLoading = favLoading || loadingProducts;

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Wishlist</h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading…' : `${wishlisted.length} ${wishlisted.length === 1 ? 'item' : 'items'} saved`}
            </p>
            {!isLoading && wishlisted.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: favourites.length || 4 }).map((_, i) => (
              <div key={i} className="animate-pulse border border-border/40 bg-card">
                <div className="aspect-square bg-foreground/5" />
                <div className="px-3 pb-3 pt-2 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-foreground/10" />
                  <div className="h-3 w-1/2 rounded bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlisted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Save pieces you love by tapping the heart on any product.
            </p>
            <Button asChild>
              <Link to="/jewellery/all">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse the collection
              </Link>
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col gap-3'
          }>
            {wishlisted.map(product => (
              <ShopProductCard key={product.id} product={product} listView={viewMode === 'list'} onAddToBag={handleAddToBag} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Wishlist;
