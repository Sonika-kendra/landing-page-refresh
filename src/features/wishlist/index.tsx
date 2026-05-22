import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, LayoutGrid, List } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import { Button } from '@/components/ui/button';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/CartContext';
import { shopProducts, ShopProduct } from '@/data/shop/products';

const Wishlist = () => {
  const { favourites, loading } = useFavourites();
  const wishlisted = shopProducts.filter(p => favourites.includes(p.id));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();

  const handleAddToBag = async (product: ShopProduct) => {
    await addItem({ item_id: product.id, name: product.name, rate: product.price, quantity: 1, sku: product.sku });
  };

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Wishlist</h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading…' : `${wishlisted.length} ${wishlisted.length === 1 ? 'item' : 'items'} saved`}
            </p>
            {!loading && wishlisted.length > 0 && (
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

        {!loading && wishlisted.length === 0 ? (
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
            ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5'
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
