"use client";
import React, { useState } from "react";
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
  PenTool
} from "lucide-react";

// 模拟作品数据
const works = [
  {
    id: 1,
    title: "数字艺术作品集",
    author: "Artist_01",
    thumbnail: "/api/placeholder/320/180",
    views: 12500,
    likes: 856,
    duration: "5:32",
    uploadTime: "2天前",
    category: "视觉艺术",
    premium: false
  },
  {
    id: 2,
    title: "原创音乐专辑",
    author: "Musician_02",
    thumbnail: "/api/placeholder/320/180",
    views: 8900,
    likes: 642,
    duration: "3:45",
    uploadTime: "1周前",
    category: "音乐",
    premium: true
  },
  {
    id: 3,
    title: "3D动画短片",
    author: "Animator_03",
    thumbnail: "/api/placeholder/320/180",
    views: 15600,
    likes: 1200,
    duration: "8:15",
    uploadTime: "3天前",
    category: "动画",
    premium: false
  },
  {
    id: 4,
    title: "摄影作品展示",
    author: "Photographer_04",
    thumbnail: "/api/placeholder/320/180",
    views: 6700,
    likes: 423,
    duration: "2:18",
    uploadTime: "5天前",
    category: "摄影",
    premium: false
  },
  {
    id: 5,
    title: "UI设计案例",
    author: "Designer_05",
    thumbnail: "/api/placeholder/320/180",
    views: 9800,
    likes: 756,
    duration: "4:22",
    uploadTime: "1天前",
    category: "设计",
    premium: true
  },
  {
    id: 6,
    title: "插画创作过程",
    author: "Illustrator_06",
    thumbnail: "/api/placeholder/320/180",
    views: 11200,
    likes: 934,
    duration: "6:45",
    uploadTime: "4天前",
    category: "插画",
    premium: false
  }
];

const categories = ["全部", "视觉艺术", "音乐", "动画", "摄影", "设计", "插画"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filteredWorks, setFilteredWorks] = useState(works);

  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onOpenChange: onUploadOpenChange } = useDisclosure();

  // 搜索和筛选功能
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterWorks(query, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterWorks(searchQuery, category);
  };

  const filterWorks = (query, category) => {
    let filtered = works;

    if (category !== "全部") {
      filtered = filtered.filter(work => work.category === category);
    }

    if (query) {
      filtered = filtered.filter(work =>
        work.title.toLowerCase().includes(query.toLowerCase()) ||
        work.author.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredWorks(filtered);
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const WorkCard = ({ work }) => (
    <div className="group cursor-pointer">
      <div className="relative mb-3">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            {work.category === '视觉艺术' && <Palette size={48} />}
            {work.category === '音乐' && <Music size={48} />}
            {work.category === '动画' && <Film size={48} />}
            {work.category === '摄影' && <Camera size={48} />}
            {work.category === '设计' && <Monitor size={48} />}
            {work.category === '插画' && <PenTool size={48} />}
          </div>
          {/* 悬停播放按钮 */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button isIconOnly size="lg" className="bg-white/20 backdrop-blur-sm">
              <Play className="w-6 h-6" />
            </Button>
          </div>
          {/* 时长标签 */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {work.duration}
          </div>
          {/* Premium标签 */}
          {work.premium && (
            <div className="absolute top-2 left-2">
              <Chip size="sm" color="warning">Premium</Chip>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Avatar src={`/api/placeholder/36/36`} size="sm" className="flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {work.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{work.author}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>{formatViews(work.views)} 次观看</span>
              <span>•</span>
              <span>{work.uploadTime}</span>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem startContent={<Heart className="w-4 h-4" />}>添加到收藏</DropdownItem>
              <DropdownItem startContent={<Share2 className="w-4 h-4" />}>分享</DropdownItem>
              <DropdownItem startContent={<Eye className="w-4 h-4" />}>稍后观看</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部搜索栏 */}
      {/* <div className="sticky top-15 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 max-w-2xl">
              <Input
                placeholder="搜索作品、创作者..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-gray-100 dark:bg-gray-800"
                }}
              />
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                isIconOnly
                size="sm"
                variant={viewMode === "grid" ? "solid" : "light"}
                onPress={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant={viewMode === "list" ? "solid" : "light"}
                onPress={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* 分类筛选 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "solid" : "flat"}
              color={selectedCategory === category ? "primary" : "default"}
              onPress={() => handleCategoryChange(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 作品展示区域 */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorks.map((work) => (
              <Card key={work.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-48 aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                        {work.category === '视觉艺术' && <Palette size={32} />}
                        {work.category === '音乐' && <Music size={32} />}
                        {work.category === '动画' && <Film size={32} />}
                        {work.category === '摄影' && <Camera size={32} />}
                        {work.category === '设计' && <Monitor size={32} />}
                        {work.category === '插画' && <PenTool size={32} />}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {work.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{work.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{work.author}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatViews(work.views)} 次观看</span>
                        <span>{work.uploadTime}</span>
                        <Chip size="sm" variant="flat">{work.category}</Chip>
                        {work.premium && <Chip size="sm" color="warning">Premium</Chip>}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 上传作品模态框 */}
      <Modal isOpen={isUploadOpen} onOpenChange={onUploadOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>上传新作品</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">拖拽文件到这里或点击上传</p>
                    <p className="text-sm text-gray-500">支持图片、视频、音频等多种格式</p>
                    <Button color="primary" className="mt-4">选择文件</Button>
                  </div>

                  <Input label="作品标题" placeholder="输入作品标题" />
                  <Input label="作品描述" placeholder="描述你的作品" />

                  <div className="flex gap-4">
                    <Input label="分类" placeholder="选择分类" className="flex-1" />
                    <Input label="标签" placeholder="添加标签" className="flex-1" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  发布作品
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
