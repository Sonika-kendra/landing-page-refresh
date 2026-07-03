import { ChevronLeft, ChevronRight } from 'lucide-react';

function getPageNumbers(cur: number, last: number): (number | 'ellipsis')[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (cur > 3) pages.push('ellipsis');
  for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++) pages.push(i);
  if (cur < last - 2) pages.push('ellipsis');
  pages.push(last);
  return pages;
}

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const btn = 'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const active = 'bg-accent text-accent-foreground font-semibold';
  const inactive = 'border border-border/60 text-foreground/70 hover:border-accent/60 hover:text-foreground';

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className={`${btn} ${inactive}`}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPageNumbers(page, totalPages).map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`e-${idx}`} className="flex h-9 w-9 items-center justify-center text-foreground/40 text-sm">…</span>
        ) : (
          <button key={p} type="button" onClick={() => onPageChange(p)} className={`${btn} ${p === page ? active : inactive}`}>{p}</button>
        )
      )}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className={`${btn} ${inactive}`}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
