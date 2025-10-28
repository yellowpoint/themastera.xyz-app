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
import { Home as HomeIcon, Compass, Megaphone, History as HistoryIcon, Users as UsersIcon, Bookmark, MoreVertical } from "lucide-react";
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
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 顶部标签 */}
        <div className="flex items-center gap-6 text-sm mb-4">
          {['Overview','Videos','Musics','podcasts'].map((t, i) => (
            <button key={t} className={`pb-2 ${i===0 ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>
          ))}
        </div>

        {/* 主体两列：内容 + 右侧栏 */}
        <div className="grid grid-cols-12 gap-6">
          {/* 主内容 9 列 */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* 大封面视频区域 */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={works[0]?.thumbnailUrl || 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1470&auto=format&fit=crop'}
                alt="Hero"
                className="w-full h-[320px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-6 bottom-6 text-white">
                <h2 className="text-2xl font-bold">The Fate of Ophelia</h2>
                <p className="text-sm opacity-80">Taylor Swift</p>
                <div className="mt-2 text-xs bg-black/40 rounded px-2 py-1 inline-block">00:43/00:52</div>
              </div>
            </div>

            {/* Trending contents 区块 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Trending contents</h3>
                <Link href="/trending" className="text-sm text-muted-foreground hover:text-foreground">Show all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(loading ? Array.from({length:3}) : filteredWorks.slice(0,3)).map((w, idx) => (
                  loading ? (
                    <WorkCardSkeleton key={idx} />
                  ) : (
                    <div key={w.id} className="group">
                      <div className="relative rounded-xl overflow-hidden">
                        <img src={w.thumbnailUrl} alt={w.title} className="w-full h-40 object-cover" />
                        <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded">{formatViews(w.downloads)} views</div>
                        <div className="absolute bottom-2 right-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded">{w.duration}</div>
                      </div>
                      <div className="mt-2 flex items-start gap-2 text-sm">
                        <Avatar className="h-6 w-6"><AvatarImage src={w.user.image} /><AvatarFallback>{w.user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback></Avatar>
                        <div>
                          <div className="font-medium leading-tight">Content name</div>
                          <div className="text-xs text-muted-foreground">{w.user.name}</div>
                        </div>
                        <button className="ml-auto text-muted-foreground"><MoreVertical size={16} /></button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Featured Artist for you */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Featured Artist for you</h3>
                <Link href="/artists" className="text-sm text-muted-foreground hover:text-foreground">Show all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(loading ? Array.from({length:3}) : filteredWorks.slice(3,6)).map((w, idx) => (
                  loading ? <WorkCardSkeleton key={`fa-${idx}`} /> : <WorkCard key={w.id} work={w} />
                ))}
              </div>
            </div>
          </div>

          {/* 右侧栏 3 列 */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Quick picks */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Quick picks</h4>
                <button className="text-muted-foreground"><MoreVertical size={16} /></button>
              </div>
              <div className="mt-4 space-y-3">
                {(loading ? Array.from({length:4}) : filteredWorks.slice(0,4)).map((w, idx) => (
                  loading ? (
                    <div key={`qp-${idx}`} className="flex items-center gap-3">
                      <Skeleton className="w-14 h-14 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ) : (
                    <div key={w.id} className="flex items-center gap-3">
                      <img src={w.thumbnailUrl} alt="thumb" className="w-14 h-14 object-cover rounded" />
                      <div className="flex-1">
                        <div className="text-sm leading-tight">Music or video name</div>
                        <div className="text-xs text-muted-foreground leading-tight">{w.user.name} | Album name</div>
                      </div>
                      <button className="text-muted-foreground"><MoreVertical size={16} /></button>
                    </div>
                  )
                ))}
              </div>
              <Link href="/quick-picks" className="mt-3 block text-xs text-muted-foreground hover:text-foreground">Expand for more quick picks</Link>
            </div>

            {/* Your library */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h4 className="font-semibold">Your library</h4>
              <div className="mt-2 text-sm text-muted-foreground">Create your playlist</div>
              <div className="mt-1 text-xs text-muted-foreground">a sentence why you need a play list</div>
              <Button className="mt-4 w-full">+ Create your playlist</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}