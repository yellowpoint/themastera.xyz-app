"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Music, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkCard from "@/components/WorkCard";
import WorkCardSkeleton from "@/components/WorkCardSkeleton";
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from "@/config/categories";

export default function ExplorePage() {
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("None");
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const musicCategoriesWithAll = useMemo(() => ["all", ...MUSIC_CATEGORIES], []);

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
    return () => { ignore = true; };
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
    <div className="min-h-screen container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Explore</h1>
        <p className="text-sm text-muted-foreground">Discover trending works by category and language.</p>
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <WorkCardSkeleton key={`s-${i}`} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <RefreshCw className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visibleWorks.map((w) => (
              <WorkCard key={w.id || w.work?.id} work={w.work || w} />
            ))}
          </div>

          {/* Load more */}
          {visibleCount < filteredWorks.length && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + 12)}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}