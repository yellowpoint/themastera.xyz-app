"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  Filter,
  Grid,
  List,
  Play,
  Eye,
  Heart,
  Share2,
  Palette,
  Music,
  Film,
  Camera,
  Monitor,
  PenTool,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import Link from "next/link";
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from '@/config/categories';
// shadcn/ui imports replacing HeroUI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const categories = ["All", ...MUSIC_CATEGORIES];

export default function HomePage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [viewMode, setViewMode] = useState("grid");


  useEffect(() => {
    fetchTrendingWorks();
  }, [selectedCategory, selectedLanguage]);

  const fetchTrendingWorks = async () => {
    try {
      setLoading(true);
      setError(null);

      const category = selectedCategory === "All" ? "" : selectedCategory;
      const language = selectedLanguage === "All" ? "" : selectedLanguage;
      const response = await fetch(`/api/works/trending?category=${encodeURIComponent(category)}&language=${encodeURIComponent(language)}&limit=20`);
      const data = await response.json();

      if (data.success) {
        setWorks(data.data);
      } else {
        setError(data.error || 'Failed to fetch works');
      }
    } catch (err) {
      console.error('Error fetching trending works:', err);
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const filteredWorks = works.filter(work => {
    // Convert the tags string to an array
    const tagsArray = work.tags ? work.tags.split(',').map(tag => tag.trim()) : [];

    const matchesSearch = !searchQuery ||
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tagsArray.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const WorkCard = ({ work }) => (
    <Link href={`/content/${work.id}`} className="group cursor-pointer block">
      <div className="relative mb-3">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden">
          <img
            src={work.thumbnailUrl}
            alt={work.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="lg" variant="ghost" className="bg-background/20 backdrop-blur-sm rounded-full p-2">
              <Play className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
            {work.duration}
          </div>
          {work.premium && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-400 text-black">Premium</Badge>
            </div>
          )}
          {work.trendingScore > 50 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 text-white"><TrendingUp className="mr-1 h-3 w-3" /> Trending</Badge>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={work.user.image} />
            <AvatarFallback>{work.user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {work.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {formatViews(work.downloads)} views
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400" />
                {work.rating}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {work.uploadTime}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(work.tags ? work.tags.split(',').map(tag => tag.trim()) : []).slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const WorkCardSkeleton = () => (
    <div className="space-y-3">
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
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Discover Amazing Content <span className="text-primary">Discover</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Explore quality works from global creators, find your next source of inspiration
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search works, creators or tags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => { }}>Trending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { }}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { }}>Top Rated</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="p-2"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="p-2"
            >
              <List size={16} />
            </Button>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center text-sm text-gray-400 mr-2">Style:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Language Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="flex items-center text-sm text-gray-400 mr-2">Language:</span>
          <Button
            key="All"
            variant={selectedLanguage === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => handleLanguageChange("All")}
          >
            All
          </Button>
          {LANGUAGE_CATEGORIES.map((language) => (
            <Button
              key={language}
              variant={selectedLanguage === language ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange(language)}
            >
              {language}
            </Button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100/10 border border-red-200/20 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <Button
              size="sm"
              variant="destructive"
              onClick={fetchTrendingWorks}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Works Grid */}
        {loading ? (
          <div className={`grid ${viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"} gap-6`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <WorkCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className={`grid ${viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"} gap-6`}>
            {filteredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No Works Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "No matching works found, try different keywords" : "No works in this category yet"}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            )}
          </div>
        )}

        {/* Load More */}
        {!loading && filteredWorks.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}