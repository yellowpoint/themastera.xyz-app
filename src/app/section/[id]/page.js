"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid2x2 } from "lucide-react";
import Link from "next/link";
import WorkCardList from "@/components/WorkCardList";
import { HOMEPAGE_SECTIONS } from "@/config/sections";

export default function SectionPage() {
  const params = useParams();
  const sectionId = params?.id;
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(24);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

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
        const res = await fetch(
          `/api/homepage/section/${sectionId}?${params.toString()}`
        );
        const json = await res.json();
        if (!ignore) {
          if (json.success) {
            setItems((prev) =>
              page === 1 ? json.data || [] : [...prev, ...(json.data || [])]
            );
            setTotalPages(json.pagination?.totalPages || 1);
          } else {
            setError(json.error || "Failed to load items");
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
        items={items}
        loading={loading}
        error={error}
        skeletonCount={24}
        canLoadMore={canLoadMore}
        onLoadMore={() => setPage((p) => p + 1)}
        loadMoreLabel="Load More"
      />
    </div>
  );
}
