"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Eye,
  TrendingUp,
  Clock,
  Star,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";
import { Home as HomeIcon, Compass, Megaphone, History as HistoryIcon, Users as UsersIcon, Bookmark, MoreVertical } from "lucide-react";
import Link from "next/link";
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from '@/config/categories';
import { HOMEPAGE_SECTIONS } from '@/config/sections';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", ...MUSIC_CATEGORIES];

export default function HomePage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  // Video player states
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  // Track broken thumbnail URLs to avoid re-request loops
  const brokenThumbsRef = useRef(new Set());
  const resolveThumb = (url) => {
    if (!url) return '/thumbnail-placeholder.svg';
    return brokenThumbsRef.current.has(url) ? '/thumbnail-placeholder.svg' : url;
  };
  const handleImgError = (url, e) => {
    brokenThumbsRef.current.add(url);
    // Prevent onError loops and immediately swap to placeholder
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/thumbnail-placeholder.svg';
  };

  useEffect(() => {
    fetchTrendingWorks();
  }, [selectedCategory, selectedLanguage]);

  // Set the first video as the current video when works are loaded
  useEffect(() => {
    if (works.length > 0 && !currentVideo) {
      setCurrentVideo(works[0]);
    }
  }, [works, currentVideo]);

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

  const filteredWorks = works.filter(work => {
    // Convert the tags string to an array
    const tagsArray = work.tags ? work.tags.split(',').map(tag => tag.trim()) : [];

    const matchesSearch = !searchQuery ||
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tagsArray.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  // Video control functions
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = (duration || 0) * pct;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (s) => {
    if (!Number.isFinite(s)) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    setIsMuted(false);
    // Scroll to top to show the video player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            src={resolveThumb(work.thumbnailUrl)}

            alt={work.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => handleImgError(work.thumbnailUrl, e)}
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
      {/* 固定定位的全宽视频背景，顶部留白约64px */}
      {currentVideo && (
        <div className="fixed inset-x-0 top-16 h-[600px] z-0 overflow-hidden">
          <video
            ref={videoRef}
            src={currentVideo.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            poster={currentVideo.thumbnailUrl}
            className="w-[100vw] h-full object-cover cursor-pointer"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            onClick={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          {/* <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/30 to-transparent" /> */}
          {/* 顶部操作栏：播放/静音与进度 */}
          <div className="absolute left-70 right-110 top-4 z-10">
            <div className=" flex items-center gap-3 ">
              <button
                onClick={handlePlayPause}
                className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={handleMuteToggle}
                className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              <div className="flex-1">
                <div
                  className="h-2 rounded-full bg-white/25 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-white text-xs tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <div className="mt-2 text-white">
              <h2 className="text-2xl font-bold line-clamp-1">{currentVideo.title || 'No Title'}</h2>
              <p className="text-sm opacity-80">{currentVideo.user?.name}</p>
            </div>

          </div>


        </div>
      )}

      <main className="relative z-10 top-100 bg-black/70">
        {/* 主体两列：内容 + 右侧栏 */}
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto  px-4 py-6">
          {/* 主内容 9 列 */}
          <div className="col-span-12 md:col-span-9 space-y-8">
            {/* 循环渲染8个栏目 */}
            {HOMEPAGE_SECTIONS.map((section, sectionIndex) => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <Link href={section.showAllLink} className="text-sm text-muted-foreground hover:text-foreground">Show all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(loading ? Array.from({ length: 3 }) : filteredWorks.slice(sectionIndex * 3, (sectionIndex + 1) * 3)).map((w, idx) => (
                    loading ? (
                      <WorkCardSkeleton key={`${section.id}-skeleton-${idx}`} />
                    ) : w ? (
                      <WorkCard key={w.id} work={w} />
                    ) : null
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 右侧栏：在大屏固定到右上角 */}
          <div className="col-span-12 md:col-span-3 space-y-6 md:fixed md:right-6 md:top-16 md:w-[360px] md:z-20">
            {/* Quick picks */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Quick picks</h4>
                <button className="text-muted-foreground"><MoreVertical size={16} /></button>
              </div>
              <div className="mt-4 space-y-3">
                {(loading ? Array.from({ length: 4 }) : filteredWorks.slice(0, 4)).map((w, idx) => (
                  loading ? (
                    <div key={`qp-${idx}`} className="flex items-center gap-3">
                      <Skeleton className="w-14 h-14 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={w.id}
                      onClick={() => handleVideoSelect(w)}
                      className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors ${currentVideo?.id === w.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                        }`}
                    >
                      <div className="relative">
                        <img
                          src={resolveThumb(w.thumbnailUrl)}
                          alt="thumb" className="w-14 h-14 object-cover rounded"
                          loading="lazy"
                          onError={(e) => handleImgError(w.thumbnailUrl, e)} />
                        {currentVideo?.id === w.id && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm leading-tight line-clamp-2">{w.title}</div>
                        <div className="text-xs text-muted-foreground leading-tight mt-1">{w.user.name}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-muted-foreground"
                      >
                        <MoreVertical size={16} />
                      </button>
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