"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { Trash2, Clock, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { request } from "@/lib/request";
import { formatViews } from "@/lib/format";
import type { DateRange } from "react-day-picker";

export default function WatchHistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(18);
  const [totalPages, setTotalPages] = useState<number>(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observingRef = useRef<IntersectionObserver | null>(null);

  const fetchHistory = useCallback(
    async (opts: { pageOverride?: number } = {}) => {
      const { pageOverride } = opts;
      const nextPage = pageOverride ?? page;
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.set("page", String(nextPage));
        params.set("limit", String(limit));
        if (debouncedSearch.trim())
          params.set("search", debouncedSearch.trim());
        if (dateRange?.from)
          params.set("start", new Date(dateRange.from).toISOString());
        if (dateRange?.to)
          params.set("end", new Date(dateRange.to).toISOString());
        const { data } = await request.get(`/api/history?${params.toString()}`);
        const list = (data as any)?.data?.items || [];
        const pg = (data as any)?.data?.pagination || {};
        setTotalPages(pg.totalPages || 1);
        setItems((prev) => (nextPage === 1 ? list : [...prev, ...list]));
      } catch (err) {
        const msg = (err as any)?.message || "Failed to load watch history";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, debouncedSearch, dateRange]
  );

  // Debounced search handled by Input component via onDebouncedValueChange

  // Initial load
  useEffect(() => {
    fetchHistory({ pageOverride: 1 });
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchHistory({ pageOverride: 1 });
  }, [debouncedSearch, dateRange?.from, dateRange?.to]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (observingRef.current) {
      observingRef.current.disconnect?.();
      observingRef.current = null;
    }
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first?.isIntersecting && !loading && page < totalPages) {
        const next = page + 1;
        setPage(next);
        fetchHistory({ pageOverride: next });
      }
    });
    observingRef.current = observer;
    observer.observe(loadMoreRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loadMoreRef.current, loading, page, totalPages, fetchHistory]);

  const removeItem = async (workId: string | number) => {
    try {
      await request.delete(`/api/history/${workId}`);
      setItems((prev) => prev.filter((it) => it?.work?.id !== workId));
    } catch (err) {
      // request util should handle toasts; keep UI minimal
    }
  };

  const resolveThumb = (url?: string) => {
    if (!url) return "/thumbnail-placeholder.svg";
    return url;
  };

  const formatTime = (s?: string | number | Date | null) => {
    if (!s) return "";
    const d = new Date(s);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  };

  const groupsByDay = useMemo(() => {
    const groups = {};
    for (const it of items) {
      const d = new Date(it?.watchedAt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const key = `${yyyy}-${mm}-${dd}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(it);
    }
    return groups;
  }, [items]);

  const renderFilters = () => (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-full max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            debounceDelay={1000}
            onDebouncedValueChange={(v) => setDebouncedSearch(v)}
            placeholder="Search title or author"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {dateRange?.from && dateRange?.to
                ? `${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}`
                : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-3">
              <ShadCalendar
                mode="range"
                selected={dateRange}
                onSelect={(r) => setDateRange(r || undefined)}
                numberOfMonths={2}
              />
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateRange(undefined)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-content-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Watch History</h1>
        </div>
        {renderFilters()}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-xl" />
                <div className="flex gap-3">
                  <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-3 w-2/3 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-muted-foreground">{error}</div>
        ) : items.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <Clock className="h-8 w-8" />
            </EmptyMedia>
            <EmptyTitle>No history yet</EmptyTitle>
            <EmptyDescription>
              Your watched items will appear here once you start viewing.
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Grid of items */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => {
                const w = item?.work || {};
                const viewsCount =
                  typeof w?.views === "number"
                    ? w.views
                    : typeof w?.downloads === "number"
                      ? w.downloads
                      : 0;
                return (
                  <div key={item.id} className="group">
                    <Link href={`/content/${w.id}`} className="block">
                      <div className="relative mb-3">
                        <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                          <img
                            src={resolveThumb(w?.thumbnailUrl)}
                            alt={w?.title || "Untitled"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-34 left-2 bg-[#1D2129CC] text-white text-xs px-2 py-1 rounded-sm">
                            {formatViews(viewsCount)} views
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-base md:text-lg line-clamp-2">
                            {w?.title || "Untitled"}
                          </h3>
                          <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Delete"
                            type="button"
                            onClick={() => removeItem(w?.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {w?.user?.name || "Unknown Creator"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="size-3" />
                          <span>Viewed at {formatTime(item?.watchedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Sentinel for infinite scroll */}
              <div ref={loadMoreRef} />
            </div>

            {/* Right: Timeline */}
            <ScrollArea className="lg:h-[calc(100vh-160px)] px-2">
              <h2 className="text-base font-semibold mb-2">Timeline</h2>
              <Separator />
              <div className="space-y-6 mt-4">
                {Object.keys(groupsByDay)
                  .sort((a, b) => (a < b ? 1 : -1))
                  .map((day) => (
                    <div key={day}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{day}</Badge>
                      </div>
                      <div className="space-y-2">
                        {(groupsByDay[day] || []).map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(it.watchedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="truncate">
                              — {it?.work?.title || "Untitled"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
