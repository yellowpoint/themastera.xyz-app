"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid2x2 } from "lucide-react";
import Link from "next/link";
import WorkCardList from "@/components/WorkCardList";
import { HOMEPAGE_SECTIONS } from "@/config/sections";
import { request } from "@/lib/request";
import type { Work, Pagination } from "@/contracts/domain/work";

export default function SectionPage() {
  const params = useParams();
  const sectionId = (params as any)?.id as string;
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState<number>(initialPage);
  const [limit] = useState<number>(24);
  const [items, setItems] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const sectionMeta = useMemo(() => {
    return (
      HOMEPAGE_SECTIONS.find((s) => s.id === sectionId) || { title: sectionId }
    );
  }, [sectionId]);

  useEffect(() => {
    let ignore = false;
    async function fetchPage() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        const { data } = await request.get<Work>(
          `/api/homepage/section/${sectionId}?${params.toString()}`
        );
        if (!ignore) {
          if (data?.success) {
            const payload = (data.data as any)?.items as any[];
            setItems((prev) =>
              page === 1 ? (payload || []) : [...prev, ...(payload || [])]
            );
            setTotalPages((data.data as any)?.pagination?.totalPages || 1);
          } else {
            setError((data as any)?.error || "Failed to load items");
          }
        }
      } catch (e) {
        if (!ignore) setError("Network error, please try again");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (sectionId) fetchPage();
    return () => {
      ignore = true;
    };
  }, [sectionId, page, limit]);

  const canLoadMore = page < totalPages;

  return (
    <div className="h-full container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {sectionMeta.title || "Section"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse all items in this section.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <WorkCardList
        works={items}
        isLoading={loading}
        hasMore={canLoadMore}
        onLoadMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
