"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Music, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkCardList from "@/components/WorkCardList";
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from "@/config/categories";

export default function ExplorePage() {
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("None");
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const musicCategoriesWithAll = useMemo(
    () => ["all", ...MUSIC_CATEGORIES],
    []
  );

  useEffect(() => {
    let ignore = false;
    async function fetchTrending() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category && category !== "all") params.set("category", category);
        const res = await fetch(`/api/works/trending?${params.toString()}`);
        const json = await res.json();
        if (!ignore) {
          if (json.success) {
            setWorks(json.data || []);
            setVisibleCount(12);
          } else {
            setWorks([]);
            setError(json.error || "Failed to load works");
          }
        }
      } catch (e) {
        if (!ignore) {
          setError("Network error, please try again");
          setWorks([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchTrending();
    return () => {
      ignore = true;
    };
  }, [category]);

  const filteredWorks = useMemo(() => {
    if (!language || language === "None") return works;
    return works.filter((w) => {
      const lang = w?.language || w?.work?.language; // fallback if nested
      return lang ? lang === language : true;
    });
  }, [works, language]);

  const visibleWorks = filteredWorks.slice(0, visibleCount);

  return (
    <div className="h-full container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Discover trending works by category and language.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Music category */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Music Categories</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {musicCategoriesWithAll.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? "default" : "outline"}
                onClick={() => setCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat === "all" ? "All" : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Language category */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Languages</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {LANGUAGE_CATEGORIES.map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={language === lang ? "default" : "outline"}
                onClick={() => setLanguage(lang)}
                className="whitespace-nowrap"
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Works grid */}
      <WorkCardList
        items={visibleWorks.map((w) => w.work || w)}
        loading={loading}
        error={error}
        skeletonCount={12}
        canLoadMore={visibleCount < filteredWorks.length}
        onLoadMore={() => setVisibleCount((c) => c + 12)}
        loadMoreLabel="Load More"
      />
    </div>
  );
}
