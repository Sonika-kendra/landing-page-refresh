import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import { Button } from '@/components/ui/button';
import { useFavourites } from '@/context/FavouritesContext';
import { shopProducts } from '@/data/shop/products';

const MyWishlist = () => {
  const { favourites, loading } = useFavourites();
  const wishlisted = shopProducts.filter(p => favourites.includes(p.id));

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading…' : `${wishlisted.length} ${wishlisted.length === 1 ? 'item' : 'items'} saved`}
        </p>
      </div>

      {!loading && wishlisted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {wishlisted.map(product => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
