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

const categories = ["全部", "视觉艺术", "音乐", "动画", "摄影", "设计", "插画"];

export default function HomePage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [viewMode, setViewMode] = useState("grid");
  
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onOpenChange: onUploadOpenChange } = useDisclosure();

  useEffect(() => {
    fetchTrendingWorks();
  }, [selectedCategory]);

  const fetchTrendingWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const category = selectedCategory === "全部" ? "" : selectedCategory;
      const response = await fetch(`/api/works/trending?category=${encodeURIComponent(category)}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setWorks(data.data);
      } else {
        setError(data.error || '获取作品失败');
      }
    } catch (err) {
      console.error('Error fetching trending works:', err);
      setError('网络错误，请稍后重试');
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

  const filteredWorks = works.filter(work => {
    // 将tags字符串转换为数组
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
          {work.thumbnailUrl ? (
            <img 
              src={work.thumbnailUrl} 
              alt={work.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              {work.category === "视觉艺术" && <Palette />}
              {work.category === "音乐" && <Music />}
              {work.category === "动画" && <Film />}
              {work.category === "摄影" && <Camera />}
              {work.category === "设计" && <Monitor />}
              {work.category === "插画" && <PenTool />}
            </div>
          )}
          
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
                热门
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
            
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <span>{work.user.name}</span>
              {work.user.isCreator && (
                <Chip size="sm" color="primary" variant="flat" className="text-xs h-4">
                  创作者
                </Chip>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {formatViews(work.downloads)} 次观看
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

            {/* 标签 */}
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
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            发现精彩内容 <span className="text-lime-400">Discover</span>
          </h1>
          <p className="text-gray-300 text-lg">
            探索来自全球创作者的优质作品，发现你的下一个灵感源泉
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="搜索作品、创作者或标签..."
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
                  筛选
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="trending">热门</DropdownItem>
                <DropdownItem key="newest">最新</DropdownItem>
                <DropdownItem key="rating">高评分</DropdownItem>
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

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* 错误提示 */}
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
              重试
            </Button>
          </div>
        )}

        {/* 作品网格 */}
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

        {/* 空状态 */}
        {!loading && filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">暂无作品</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "没有找到匹配的作品，试试其他关键词" : "该分类下暂无作品"}
            </p>
            {searchQuery && (
              <Button onPress={() => setSearchQuery("")}>
                清除搜索
              </Button>
            )}
          </div>
        )}

        {/* 加载更多 */}
        {!loading && filteredWorks.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="flat">
              加载更多
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}