import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Inbox,
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FetchParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: unknown;
}

export interface ColumnDef<T> {
  /** Field name on the row object — used for default value access and sort key */
  key: string;
  /** Header label */
  label: string;
  /** Enable sorting on this column (server-side or client-side depending on mode) */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  /** CSS width token (e.g. '120px', '20%', '2fr') */
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  // ── Data source ──────────────────────────────────────────────────────────
  /** React Query cache key. Params are automatically appended. */
  queryKey: string | readonly unknown[];
  /** Called on every fetch. Must return an AxiosResponse. */
  fetchFn: (params: FetchParams) => Promise<AxiosResponse<any>>;
  /**
   * Dot-path into `response.data` to extract the row array.
   * e.g. 'items', 'data.results', 'logs'  — default: 'data'
   */
  dataKey?: string;
  /**
   * Dot-path into `response.data` for the total record count.
   * Falls back to array length when not found.  — default: 'total'
   */
  totalKey?: string;

  // ── Columns ──────────────────────────────────────────────────────────────
  columns: ColumnDef<T>[];

  // ── Pagination mode ───────────────────────────────────────────────────────
  /**
   * When true, fetchFn is called once (with only extraParams).
   * All search, sort, and pagination happen client-side.
   * Use this for APIs that return all records in a single call.
   */
  clientSidePagination?: boolean;
  /**
   * Custom search predicate used when clientSidePagination is true.
   * Default: matches any string field containing the search term.
   */
  clientSideSearchFn?: (row: T, search: string) => boolean;

  // ── Features ─────────────────────────────────────────────────────────────
  searchable?: boolean;
  searchPlaceholder?: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];

  // ── Appearance ───────────────────────────────────────────────────────────
  title?: string;
  description?: string;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  compact?: boolean;

  // ── Row interaction ───────────────────────────────────────────────────────
  onRowClick?: (row: T) => void;
  rowActions?: RowAction<T>[];
  rowKey?: keyof T | ((row: T, index: number) => string);

  // ── Extras ───────────────────────────────────────────────────────────────
  /** Rendered in the toolbar area alongside the search bar */
  toolbar?: React.ReactNode;
  /** Static params merged into every fetchFn call */
  extraParams?: Record<string, unknown>;
  /**
   * Change this value to trigger a manual refetch.
   * Useful for "Refresh" buttons in the parent when clientSidePagination is true.
   */
  refreshKey?: unknown;
  refetchInterval?: number;
  staleTime?: number;
  onDataLoaded?: (rows: T[], total: number) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getByPath(obj: unknown, path: string): unknown {
  return (path.split('.') as string[]).reduce<unknown>(
    (acc, key) =>
      acc != null && typeof acc === 'object'
        ? (acc as Record<string, unknown>)[key]
        : undefined,
    obj,
  );
}

function defaultClientSearch<T extends Record<string, any>>(row: T, q: string): boolean {
  return Object.values(row).some(
    (v) => typeof v === 'string' && v.toLowerCase().includes(q),
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

function DataTable<T extends Record<string, any>>({
  queryKey,
  fetchFn,
  dataKey = 'data',
  totalKey = 'total',
  columns,
  clientSidePagination = false,
  clientSideSearchFn,
  searchable = false,
  searchPlaceholder = 'Search…',
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  title,
  description,
  emptyIcon,
  emptyMessage = 'No records found.',
  className,
  compact = false,
  onRowClick,
  rowActions,
  rowKey,
  toolbar,
  extraParams,
  refreshKey,
  refetchInterval,
  staleTime,
  onDataLoaded,
}: DataTableProps<T>) {
  // Ensure defaultPageSize is always a selectable option
  const effectivePageSizeOptions = useMemo(() => {
    if (pageSizeOptions.includes(defaultPageSize)) return pageSizeOptions;
    return [...pageSizeOptions, defaultPageSize].sort((a, b) => a - b);
  }, [pageSizeOptions, defaultPageSize]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Debounce search input → reset to page 1
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  // ── Server-side fetch params ─────────────────────────────────────────────
  const serverParams: FetchParams = useMemo(() => ({
    page,
    pageSize,
    ...(sortBy ? { sortBy, sortOrder: sortOrder ?? 'asc' } : {}),
    ...(search ? { search } : {}),
    ...extraParams,
  }), [page, pageSize, sortBy, sortOrder, search, extraParams]);

  // ── Client-side fetch params (single load) ───────────────────────────────
  const clientParams: FetchParams = useMemo(() => ({
    page: 1,
    pageSize: 9999,
    ...extraParams,
  }), [extraParams]);

  const activeParams = clientSidePagination ? clientParams : serverParams;

  const fullQueryKey: QueryKey = useMemo(
    () =>
      Array.isArray(queryKey)
        ? [...queryKey, activeParams, refreshKey ?? null]
        : [queryKey, activeParams, refreshKey ?? null],
    [queryKey, activeParams, refreshKey],
  );

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: fullQueryKey,
    queryFn: () => fetchFn(activeParams),
    placeholderData: keepPreviousData,
    refetchInterval,
    staleTime,
  });

  // ── All rows from API ────────────────────────────────────────────────────
  const allRows: T[] = useMemo(() => {
    const extracted = getByPath(response?.data, dataKey);
    return Array.isArray(extracted) ? (extracted as T[]) : [];
  }, [response, dataKey]);

  // ── Client-side search ───────────────────────────────────────────────────
  const searchedRows: T[] = useMemo(() => {
    if (!clientSidePagination || !search) return allRows;
    const q = search.toLowerCase();
    const fn = clientSideSearchFn
      ? (row: T) => clientSideSearchFn(row, search)
      : (row: T) => defaultClientSearch(row, q);
    return allRows.filter(fn);
  }, [clientSidePagination, allRows, search, clientSideSearchFn]);

  // ── Client-side sort ─────────────────────────────────────────────────────
  const sortedRows: T[] = useMemo(() => {
    if (!clientSidePagination || !sortBy) return searchedRows;
    return [...searchedRows].sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [clientSidePagination, searchedRows, sortBy, sortOrder]);

  // ── Displayed rows (server slice or client slice) ────────────────────────
  const rows: T[] = useMemo(() => {
    if (!clientSidePagination) return allRows;
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [clientSidePagination, allRows, sortedRows, page, pageSize]);

  // ── Total count ──────────────────────────────────────────────────────────
  const total: number = useMemo(() => {
    if (clientSidePagination) return sortedRows.length;
    const extracted = getByPath(response?.data, totalKey);
    return typeof extracted === 'number' ? extracted : allRows.length;
  }, [clientSidePagination, sortedRows.length, response, totalKey, allRows.length]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!isLoading && response) onDataLoaded?.(rows, total);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, total, isLoading]);

  // ── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = useCallback((key: string) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortBy(undefined);
      setSortOrder(undefined);
    }
    setPage(1);
  }, [sortBy, sortOrder]);

  const getRowKey = useCallback((row: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(row, index);
    if (typeof rowKey === 'string') return String(row[rowKey] ?? index);
    return String(row._id ?? row.id ?? index);
  }, [rowKey]);

  // ── Layout ───────────────────────────────────────────────────────────────
  const cellPy = compact ? 'py-2' : 'py-3';
  const hasActions = !!rowActions?.length;
  const skeletonCount = Math.min(pageSize, 8);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortBy !== colKey) return <ChevronsUpDown className="h-3 w-3 opacity-40 shrink-0" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="h-3 w-3 shrink-0" />
      : <ChevronDown className="h-3 w-3 shrink-0" />;
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={cn('space-y-4', className)}>

      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-2xl font-light tracking-widest uppercase">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      {(searchable || toolbar) && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 h-8 text-sm w-56 rounded-sm"
              />
            </div>
          )}
          {toolbar && (
            <div className="flex items-center gap-2 ml-auto">{toolbar}</div>
          )}
        </div>
      )}

      <div className="bg-background rounded-sm border border-border overflow-hidden">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <AlertCircle className="h-10 w-10 opacity-30" />
            <p className="text-sm">Failed to load data.</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-sm"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">

              {/* ── Header ── */}
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-4 h-10 text-xs font-medium tracking-widest uppercase text-muted-foreground align-middle whitespace-nowrap',
                        col.sortable &&
                          'cursor-pointer select-none hover:text-foreground transition-colors',
                        col.headerClassName,
                      )}
                      style={col.width ? { width: col.width } : undefined}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-1 w-full',
                          col.align === 'left' ? 'justify-start'
                            : col.align === 'right' ? 'justify-end'
                            : 'justify-center',
                        )}
                      >
                        {col.label}
                        {col.sortable && <SortIcon colKey={col.key} />}
                      </div>
                    </th>
                  ))}
                  {hasActions && <th className="w-10 px-2" />}
                </tr>
              </thead>

              {/* ── Body ── */}
              <tbody>
                {isLoading ? (
                  Array.from({ length: skeletonCount }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {columns.map((col) => (
                        <td key={col.key} className={cn('px-4 align-middle', cellPy)}>
                          <div className="flex items-center">
                            <Skeleton
                              className="h-4 rounded-sm w-full"
                              style={{ opacity: 1 - i * 0.1 }}
                            />
                          </div>
                        </td>
                      ))}
                      {hasActions && (
                        <td className="px-2">
                          <Skeleton className="h-4 w-4 rounded-sm" />
                        </td>
                      )}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (hasActions ? 1 : 0)}>
                      <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                        {emptyIcon ?? <Inbox className="h-10 w-10 opacity-25" />}
                        <p className="text-sm">{emptyMessage}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={getRowKey(row, index)}
                      className={cn(
                        'border-b border-border last:border-0 hover:bg-muted/20 transition-colors',
                        onRowClick && 'cursor-pointer',
                      )}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn('px-4 align-middle', cellPy, col.className)}
                        >
                          <div
                            className={cn(
                              'flex items-center',
                              col.align === 'left' ? 'justify-start'
                                : col.align === 'right' ? 'justify-end'
                                : 'justify-center',
                            )}
                          >
                            {col.render
                              ? col.render(row[col.key], row, index)
                              : <span className="text-sm">{row[col.key] ?? '—'}</span>}
                          </div>
                        </td>
                      ))}

                      {hasActions && (
                        <td
                          className="px-2 align-middle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-sm data-[state=open]:bg-muted"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Row actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[140px]">
                              {rowActions!
                                .filter((a) => !a.hidden?.(row))
                                .map((action, ai) => (
                                  <DropdownMenuItem
                                    key={ai}
                                    onClick={() => action.onClick(row)}
                                    disabled={action.disabled?.(row)}
                                    className={cn(
                                      'gap-2',
                                      action.variant === 'destructive' &&
                                        'text-destructive focus:text-destructive',
                                    )}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && !isError && total > 0 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
            >
              <SelectTrigger className="h-7 w-[70px] text-xs rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {effectivePageSizeOptions.map((s) => (
                  <SelectItem key={s} value={String(s)} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
