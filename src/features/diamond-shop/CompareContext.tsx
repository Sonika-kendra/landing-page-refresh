import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import type { DiamondItem } from './DiamondCard';

export const MAX_COMPARE = 4;

interface CompareContextValue {
  items: DiamondItem[];
  toggleCompare: (item: DiamondItem) => void;
  isCompared: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<DiamondItem[]>([]);

  const toggleCompare = useCallback((item: DiamondItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev.filter((i) => i.id !== item.id);
      if (prev.length >= MAX_COMPARE) {
        toast({ title: `You can compare up to ${MAX_COMPARE} diamonds at a time`, variant: 'destructive' });
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const isCompared = useCallback((id: string) => items.some((i) => i.id === id), [items]);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  return (
    <CompareContext.Provider value={{ items, toggleCompare, isCompared, remove, clear }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
};
