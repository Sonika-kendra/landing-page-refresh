import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { wishlistApi } from '@/api/wishlist';

interface FavouritesContextValue {
  favourites: string[];
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  count: number;
  loading: boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, openModal } = useAuth();
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavourites([]);
      return;
    }
    setLoading(true);
    wishlistApi.get()
      .then(res => setFavourites(res.data.wishlist ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const toggleFavourite = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    const isCurrentlyFav = favourites.includes(id);
    const next = isCurrentlyFav ? favourites.filter(f => f !== id) : [...favourites, id];
    setFavourites(next);
    try {
      if (isCurrentlyFav) {
        await wishlistApi.remove(id);
      } else {
        await wishlistApi.add(id);
      }
    } catch {
      setFavourites(favourites);
    }
  }, [favourites, isAuthenticated, openModal]);

  const isFavourite = useCallback((id: string) => favourites.includes(id), [favourites]);

  return (
    <FavouritesContext.Provider
      value={{ favourites, toggleFavourite, isFavourite, count: favourites.length, loading }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider');
  return ctx;
};
