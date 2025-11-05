"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { request } from "@/lib/request";
import { formatViews } from "@/lib/format";

export default function WatchHistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await request.get("/api/history");
      const list = data?.data || [];
      setItems(list);
    } catch (err) {
      setError(err?.message || "Failed to load watch history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const removeItem = async (workId) => {
    try {
      await request.delete(`/api/history/${workId}`);
      setItems((prev) => prev.filter((it) => it?.work?.id !== workId));
    } catch (err) {
      // request util should handle toasts; keep UI minimal
    }
  };

  const resolveThumb = (url) => {
    if (!url) return "/thumbnail-placeholder.svg";
    return url;
  };

  const formatTime = (s) => {
    if (!s) return "";
    const d = new Date(s);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  };

  return (
    <div className="h-full bg-content-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Watch History</h1>
        </div>

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
          <div className="text-sm text-muted-foreground">No history yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        )}
      </div>
    </div>
  );
}
