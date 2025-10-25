"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
  Spinner
} from "@heroui/react";
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
            <Button isIconOnly size="lg" className="bg-background/20 backdrop-blur-sm">
              <Play className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
            {work.duration}
          </div>

          {work.premium && (
            <div className="absolute top-2 left-2">
              <Chip size="sm" color="warning">Premium</Chip>
            </div>
          )}

          {work.trendingScore > 50 && (
            <div className="absolute top-2 right-2">
              <Chip size="sm" color="danger" startContent={<TrendingUp size={12} />}>
                Trending
              </Chip>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Avatar
            src={work.user.image}
            size="sm"
            className="flex-shrink-0"
            showFallback
          />

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

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {(work.tags ? work.tags.split(',').map(tag => tag.trim()) : []).slice(0, 2).map((tag, index) => (
                <Chip key={index} size="sm" variant="flat" color="default" className="text-xs">
                  {tag}
                </Chip>
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
            Discover Amazing Content <span className="text-lime-400">Discover</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Explore quality works from global creators, find your next source of inspiration
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search works, creators or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              startContent={<Search size={16} className="text-gray-400" />}
              size="lg"
            />
          </div>

          <div className="flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" startContent={<Filter size={16} />}>
                  Filter
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="trending">Trending</DropdownItem>
                <DropdownItem key="newest">Newest</DropdownItem>
                <DropdownItem key="rating">Top Rated</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              isIconOnly
              variant={viewMode === "grid" ? "solid" : "flat"}
              onPress={() => setViewMode("grid")}
            >
              <Grid size={16} />
            </Button>

            <Button
              isIconOnly
              variant={viewMode === "list" ? "solid" : "flat"}
              onPress={() => setViewMode("list")}
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
              variant={selectedCategory === category ? "solid" : "flat"}
              color={selectedCategory === category ? "primary" : "default"}
              size="sm"
              onPress={() => handleCategoryChange(category)}
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
            variant={selectedLanguage === "All" ? "solid" : "flat"}
            color={selectedLanguage === "All" ? "primary" : "default"}
            size="sm"
            onPress={() => handleLanguageChange("All")}
          >
            All
          </Button>
          {LANGUAGE_CATEGORIES.map((language) => (
            <Button
              key={language}
              variant={selectedLanguage === language ? "solid" : "flat"}
              color={selectedLanguage === language ? "primary" : "default"}
              size="sm"
              onPress={() => handleLanguageChange(language)}
            >
              {language}
            </Button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-6">
            <p className="text-danger">{error}</p>
            <Button
              size="sm"
              color="danger"
              variant="flat"
              onPress={fetchTrendingWorks}
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
              <Button onPress={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Load More */}
        {!loading && filteredWorks.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="flat">
              Load More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}