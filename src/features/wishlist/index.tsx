import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import { Button } from '@/components/ui/button';
import { useFavourites } from '@/context/FavouritesContext';
import { shopProducts } from '@/data/shop/products';

const Wishlist = () => {
  const { favourites, loading } = useFavourites();
  const wishlisted = shopProducts.filter(p => favourites.includes(p.id));

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading…' : `${wishlisted.length} ${wishlisted.length === 1 ? 'item' : 'items'} saved`}
          </p>
        </div>

        {!loading && wishlisted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Save pieces you love by tapping the heart on any product.
            </p>
            <Button asChild>
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse the collection
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
            {wishlisted.map(product => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Wishlist;
