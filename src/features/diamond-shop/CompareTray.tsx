import { useState } from 'react';
import { X, BarChart2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCompare, MAX_COMPARE } from './CompareContext';
import { extractDiamondFields, type DiamondItem } from './DiamondCard';
import defaultProductImage from '@/assets/product-placeholder.svg';

type Fields = ReturnType<typeof extractDiamondFields>;

const ROWS: { label: string; key: (d: Fields, item: DiamondItem) => string }[] = [
  { label: 'Shape',        key: (_d, item) => String(item.shape ?? '-') },
  { label: 'Colour',       key: (_d, item) => String(item.colour ?? '-') },
  { label: 'Clarity',      key: (_d, item) => String(item.clarity ?? '-') },
  { label: 'Carat',        key: (d) => d.caratTotal ? `${d.caratTotal}ct` : '-' },
  { label: 'Cut',          key: (d) => d.cut || '-' },
  { label: 'Polish',       key: (d) => d.polish || '-' },
  { label: 'Symmetry',     key: (d) => d.symmetry || '-' },
  { label: 'Fluorescence', key: (d) => d.fluorescence || '-' },
  { label: 'Table',        key: (d) => d.table || '-' },
  { label: 'Depth',        key: (d) => d.depth || '-' },
  { label: 'Ratio',        key: (d) => d.ratio || '-' },
  { label: 'Measurements', key: (d) => d.measurements || '-' },
  { label: 'Certificate',  key: (d) => [d.certLab, d.certNumber].filter(Boolean).join(' : ') || '-' },
];

const CompareTray = () => {
  const { items, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="henig-container flex items-center gap-3 py-3">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {items.map((item) => {
              const d = extractDiamondFields(item);
              return (
                <div key={item.id} className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded border border-border/40 bg-white">
                  <img
                    src={d.pictureLink || item.image}
                    alt={d.title}
                    className="h-full w-full object-contain p-1"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultProductImage; }}
                  />
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove from compare"
                    className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-bl bg-foreground/70 text-background"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <span className="whitespace-nowrap text-sm text-foreground/50">{items.length}/{MAX_COMPARE} selected</span>
          <button
            onClick={clear}
            className="whitespace-nowrap text-sm text-foreground/45 underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Clear
          </button>
          <button
            onClick={() => setOpen(true)}
            disabled={items.length < 2}
            className="flex items-center gap-1.5 whitespace-nowrap rounded bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Compare
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="henig-diamond-shop max-h-[90vh] max-w-5xl overflow-y-auto bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-base">
              <thead>
                <tr>
                  <th className="w-32" />
                  {items.map((item) => {
                    const d = extractDiamondFields(item);
                    return (
                      <th key={item.id} className="border-b border-border/30 px-3 pb-3 text-left align-bottom">
                        <div className="relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded border border-border/30 bg-white">
                          <img
                            src={d.pictureLink || item.image}
                            alt={d.title}
                            className="h-full w-full object-contain p-1"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultProductImage; }}
                          />
                          <button
                            onClick={() => remove(item.id)}
                            aria-label="Remove from compare"
                            className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl bg-foreground/70 text-background"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{d.title}</p>
                        <p className="mt-1 text-base font-bold text-primary">
                          {item.currency}{item.price.toLocaleString()}
                        </p>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border/20">
                    <td className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">{row.label}</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-3 py-2.5 text-center text-foreground/80">{row.key(extractDiamondFields(item), item)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompareTray;
