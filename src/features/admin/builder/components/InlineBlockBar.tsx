import { type ReactNode } from 'react';

interface InlineBlockBarProps {
  children: ReactNode;
}

export const InlineBlockBar = ({ children }: InlineBlockBarProps) => (
  <div
    className="flex items-center flex-wrap gap-0.5 px-1.5 py-1 mb-1 border border-border bg-muted/10"
    onMouseDown={e => e.preventDefault()}
  >
    {children}
  </div>
);

interface BarBtnProps {
  active?: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}

export const BarBtn = ({ active = false, onClick, title, children }: BarBtnProps) => (
  <button
    className={`h-6 px-1.5 flex items-center gap-0.5 text-[10px] tracking-wide transition-colors rounded-sm ${
      active
        ? 'bg-foreground text-background'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
    }`}
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
  >
    {children}
  </button>
);

export const BarSep = () => <span className="w-px h-3.5 bg-border mx-0.5 shrink-0" />;
