"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
  Progress
} from "@heroui/react";
import {
  Bell,
  BellRing,
  Share2,
  Flag,
  Eye,
  Star,
  Clock,
  Play,
  Grid,
  List,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Users,
  Heart,
  Download,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params.id;
  
  const [creator, setCreator] = useState(null);
  const [works, setWorks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [worksLoading, setWorksLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState("works");
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  
  const { isOpen: isShareOpen, onOpen: onShareOpen, onOpenChange: onShareOpenChange } = useDisclosure();

  useEffect(() => {
    if (creatorId) {
      fetchCreatorProfile();
      fetchCreatorWorks();
      fetchFollowStatus();
    }
  }, [creatorId]);

  const fetchCreatorProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${creatorId}`);
      const data = await response.json();
      
      if (data.success) {
        setCreator(data.data);
        setStats(data.data.stats);
      } else {
        setError(data.error || '获取创作者信息失败');
      }
    } catch (err) {
      console.error('Error fetching creator profile:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatorWorks = async () => {
    try {
      setWorksLoading(true);
      const response = await fetch(`/api/works?userId=${creatorId}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setWorks(data.data);
      }
    } catch (err) {
      console.error('Error fetching creator works:', err);
    } finally {
      setWorksLoading(false);
    }
  };

  const fetchFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${creatorId}/follow`);
      const data = await response.json();
      
      if (data.success) {
        setIsFollowing(data.data.isFollowing);
        setFollowers(data.data.recentFollowers);
      }
    } catch (err) {
      console.error('Error fetching follow status:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${creatorId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: isFollowing ? 'unfollow' : 'follow',
          userId: 'current-user-id' // TODO: Get from auth
        })
      });
      
      if (response.ok) {
        setIsFollowing(!isFollowing);
        // Update follower count
        if (creator) {
          setCreator({
            ...creator,
            followerCount: creator.followerCount + (isFollowing ? -1 : 1)
          });
        }
      }
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
              🎨
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
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {work.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
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
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header skeleton */}
          <div className="relative mb-8">
            <Skeleton className="h-48 w-full rounded-xl mb-6" />
            <div className="flex items-start gap-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">创作者不存在</h2>
          <p className="text-gray-500 mb-4">{error || '找不到该创作者'}</p>
          <Link href="/">
            <Button color="primary">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 创作者头部信息 */}
        <div className="relative mb-8">
          {/* 背景横幅 */}
          <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl mb-6 overflow-hidden">
            {creator.bannerUrl ? (
              <img 
                src={creator.bannerUrl} 
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/80">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-lg">创作者横幅</p>
                </div>
              </div>
            )}
          </div>

          {/* 创作者信息 */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar 
              src={creator.image} 
              size="xl"
              className="w-32 h-32 text-large border-4 border-background shadow-lg"
              showFallback
            />
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    {creator.name}
                    {creator.isCreator && (
                      <Chip color="primary" variant="flat">认证创作者</Chip>
                    )}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {formatNumber(creator.followerCount || 0)} 关注者
                    </span>
                    <span>•</span>
                    <span>{works.length} 个作品</span>
                    {creator.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {creator.location}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {creator.website && (
                    <a 
                      href={creator.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline text-sm"
                    >
                      <LinkIcon size={16} />
                      {creator.website}
                    </a>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    color={isFollowing ? "default" : "primary"}
                    variant={isFollowing ? "flat" : "solid"}
                    size="lg"
                    startContent={isFollowing ? <BellRing size={20} /> : <Bell size={20} />}
                    onPress={handleFollow}
                  >
                    {isFollowing ? "已关注" : "关注"}
                  </Button>
                  
                  <Button
                    variant="flat"
                    isIconOnly
                    onPress={onShareOpen}
                  >
                    <Share2 size={20} />
                  </Button>
                  
                  <Button
                    variant="flat"
                    isIconOnly
                    color="danger"
                  >
                    <Flag size={20} />
                  </Button>
                </div>
              </div>

              {/* 创作者简介 */}
              {creator.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                  {creator.bio}
                </p>
              )}

              {/* 统计数据 */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{formatNumber(stats.totalViews || 0)}</div>
                    <div className="text-sm text-gray-500">总观看量</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-success">{formatNumber(stats.totalLikes || 0)}</div>
                    <div className="text-sm text-gray-500">总点赞数</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-warning">{stats.averageRating || 0}</div>
                    <div className="text-sm text-gray-500">平均评分</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{formatNumber(stats.totalEarnings || 0)}</div>
                    <div className="text-sm text-gray-500">总收益</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider className="mb-8" />

        {/* 内容标签页 */}
        <div className="mb-6">
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={setActiveTab}
            size="lg"
            color="primary"
          >
            <Tab key="works" title={`作品 (${works.length})`} />
            <Tab key="about" title="关于" />
            <Tab key="followers" title={`关注者 (${formatNumber(creator.followerCount || 0)})`} />
          </Tabs>
        </div>

        {/* 标签页内容 */}
        {activeTab === "works" && (
          <div>
            {/* 作品筛选和视图控制 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">排序方式:</span>
                <Button variant="flat" size="sm">最新</Button>
                <Button variant="light" size="sm">最热门</Button>
                <Button variant="light" size="sm">评分最高</Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant={viewMode === "grid" ? "solid" : "flat"}
                  size="sm"
                  onPress={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </Button>
                <Button
                  isIconOnly
                  variant={viewMode === "list" ? "solid" : "flat"}
                  size="sm"
                  onPress={() => setViewMode("list")}
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {/* 作品网格 */}
            {worksLoading ? (
              <div className={`grid ${viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"} gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : works.length > 0 ? (
              <div className={`grid ${viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"} gap-6`}>
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">暂无作品</h3>
                <p className="text-gray-500">该创作者还没有发布任何作品</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-4xl">
            <Card>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">个人简介</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {creator.bio || "该创作者还没有添加个人简介..."}
                  </p>
                </div>
                
                <Divider />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">详细信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">
                        加入时间: {new Date(creator.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {creator.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm">位置: {creator.location}</span>
                      </div>
                    )}
                    
                    {creator.website && (
                      <div className="flex items-center gap-2">
                        <LinkIcon size={16} className="text-gray-400" />
                        <a 
                          href={creator.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {creator.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {stats && (
                  <>
                    <Divider />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">创作统计</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">总观看量</span>
                            <span className="font-semibold">{formatNumber(stats.totalViews || 0)}</span>
                          </div>
                          <Progress value={75} color="primary" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">平均评分</span>
                            <span className="font-semibold">{stats.averageRating || 0}/5</span>
                          </div>
                          <Progress value={(stats.averageRating || 0) * 20} color="warning" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === "followers" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.map((follower) => (
                <Card key={follower.id}>
                  <CardBody>
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={follower.image} 
                        size="md"
                        showFallback
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{follower.name}</h4>
                        <p className="text-sm text-gray-500">
                          {follower.isCreator ? "创作者" : "用户"}
                        </p>
                      </div>
                      <Button size="sm" variant="flat">
                        查看
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
            
            {followers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">暂无关注者</h3>
                <p className="text-gray-500">还没有人关注该创作者</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 分享模态框 */}
      <Modal isOpen={isShareOpen} onOpenChange={onShareOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>分享创作者</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Avatar src={creator.image} size="sm" showFallback />
                    <div>
                      <h4 className="font-semibold">{creator.name}</h4>
                      <p className="text-sm text-gray-500">{formatNumber(creator.followerCount || 0)} 关注者</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button color="primary" variant="flat">微信</Button>
                    <Button color="primary" variant="flat">微博</Button>
                    <Button color="primary" variant="flat">QQ</Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}