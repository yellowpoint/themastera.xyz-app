"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Avatar,
  Chip,
  Input,
  Textarea,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
  Progress,
  Tabs,
  Tab
} from "@heroui/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Heart,
  Share2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star,
  Eye,
  Clock,
  User,
  Bell,
  BellRing,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContentDetailPage() {
  const params = useParams();
  const workId = params.id;

  const [work, setWork] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 播放器状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoRef, setVideoRef] = useState(null);

  // 交互状态
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  const { isOpen: isShareOpen, onOpen: onShareOpen, onOpenChange: onShareOpenChange } = useDisclosure();

  useEffect(() => {
    if (workId) {
      fetchWorkDetails();
      fetchComments();
      fetchRelatedWorks();
    }
  }, [workId]);

  const fetchWorkDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/works/${workId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('作品不存在或已被删除');
        } else if (response.status >= 500) {
          throw new Error('服务器错误，请稍后重试');
        } else {
          throw new Error('获取作品详情失败');
        }
      }
      
      const data = await response.json();
      
      if (data.success) {
        setWork(data.data);
        setDuration(parseDuration(data.data.duration || '0:00'));
      } else {
        throw new Error(data.error || '获取作品详情失败');
      }
    } catch (err) {
      console.error('Error fetching work details:', err);
      setError(err.message || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      
      const response = await fetch(`/api/works/${workId}/comments?limit=20&sort=newest`);
      
      if (!response.ok) {
        throw new Error('获取评论失败');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data.comments || []);
      } else {
        throw new Error(data.error || '获取评论失败');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRelatedWorks = async () => {
    try {
      const response = await fetch(`/api/works/trending?limit=8&exclude=${workId}`);
      
      if (!response.ok) {
        throw new Error('获取相关作品失败');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRelatedWorks(data.data || []);
      } else {
        throw new Error(data.error || '获取相关作品失败');
      }
    } catch (err) {
      console.error('Error fetching related works:', err);
    }
  };

  const parseDuration = (durationStr) => {
    const parts = durationStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef) {
      videoRef.volume = newVolume / 100;
      setVolume(newVolume);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef) {
      setCurrentTime(videoRef.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef) {
      setDuration(videoRef.duration);
    }
  };

  const handleSeek = (newTime) => {
    if (videoRef) {
      videoRef.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleLike = async () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);
    // TODO: API call to like/unlike
  };

  const handleDislike = async () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);
    // TODO: API call to dislike/undislike
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${work.user.id}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isFollowing ? 'unfollow' : 'follow' })
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/works/${workId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          rating: commentRating,
          userId: 'current-user-id' // TODO: Get from auth
        })
      });

      if (response.ok) {
        setNewComment("");
        setCommentRating(5);
        fetchComments(); // Refresh comments
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-32 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">
            {error?.includes('不存在') || error?.includes('删除') ? '😕' : '⚠️'}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {error?.includes('不存在') || error?.includes('删除') ? '作品不存在' : '加载失败'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error || '找不到该作品'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/content">
              <Button color="primary" variant="solid">
                浏览其他作品
              </Button>
            </Link>
            
            <Link href="/">
              <Button color="default" variant="light">
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主内容区域 */}
          <div className="lg:col-span-2">
            {/* 播放器 */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
              {work.fileUrl ? (
                <video 
                  ref={setVideoRef}
                  src={work.fileUrl} 
                  poster={work.thumbnailUrl}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : work.thumbnailUrl ? (
                <img 
                  src={work.thumbnailUrl} 
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-lg">预览图片</p>
                  </div>
                </div>
              )}

              {/* 播放控制层 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                {/* 中央播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    isIconOnly
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 w-16 h-16"
                    onPress={handlePlayPause}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                </div>

                {/* 底部控制栏 */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handlePlayPause}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleMute}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>

                    <div className="flex-1">
                      <Progress 
                        value={(currentTime / duration) * 100} 
                        className="h-1 cursor-pointer"
                        color="primary"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          const newTime = percent * duration;
                          handleSeek(newTime);
                        }}
                      />
                    </div>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                    >
                      <Maximize size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 作品信息 */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{work.title}</h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {formatViews(work.downloads)} 次观看
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {work.uploadTime}
                  </span>
                  <Chip size="sm" color="primary" variant="flat">
                    {work.category}
                  </Chip>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "solid" : "flat"}
                    color={isLiked ? "success" : "default"}
                    startContent={<ThumbsUp size={16} />}
                    size="sm"
                    onPress={handleLike}
                  >
                    {work.likes + (isLiked ? 1 : 0)}
                  </Button>

                  <Button
                    variant={isDisliked ? "solid" : "flat"}
                    color={isDisliked ? "danger" : "default"}
                    startContent={<ThumbsDown size={16} />}
                    size="sm"
                    onPress={handleDislike}
                  >
                    不喜欢
                  </Button>

                  <Button
                    variant="flat"
                    startContent={<Share2 size={16} />}
                    size="sm"
                    onPress={onShareOpen}
                  >
                    分享
                  </Button>

                  <Button
                    variant="flat"
                    startContent={<Download size={16} />}
                    size="sm"
                    color="primary"
                  >
                    下载
                  </Button>
                </div>
              </div>

              <Divider />

              {/* 创作者信息 */}
              <div className="flex items-start gap-4">
                <Link href={`/creator/${work.user.id}`}>
                  <Avatar
                    src={work.user.image}
                    size="lg"
                    className="cursor-pointer"
                    showFallback
                  />
                </Link>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/creator/${work.user.id}`}>
                      <h3 className="font-semibold hover:text-primary cursor-pointer">
                        {work.user.name}
                      </h3>
                    </Link>
                    {work.user.isCreator && (
                      <Chip size="sm" color="primary" variant="flat">创作者</Chip>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {work.user.followers || 0} 位关注者
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      color={isFollowing ? "default" : "primary"}
                      variant={isFollowing ? "flat" : "solid"}
                      size="sm"
                      startContent={isFollowing ? <BellRing size={16} /> : <Bell size={16} />}
                      onPress={handleFollow}
                    >
                      {isFollowing ? "已关注" : "关注"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 作品描述 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">作品描述</h4>
                  <Button
                    variant="light"
                    size="sm"
                    endContent={showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    onPress={() => setShowDescription(!showDescription)}
                  >
                    {showDescription ? "收起" : "展开"}
                  </Button>
                </div>

                <p className={`text-sm text-gray-600 dark:text-gray-400 ${showDescription ? "" : "line-clamp-3"
                  }`}>
                  {work.description || "创作者暂未添加描述..."}
                </p>

                {work.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(work.tags ? work.tags.split(',').map(tag => tag.trim()) : []).map((tag, index) => (
                      <Chip key={index} size="sm" variant="flat" color="primary">
                        #{tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>

              <Divider />

              {/* 评论区 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle size={20} />
                    评论 ({comments.length})
                  </h3>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="flat" size="sm">
                        排序方式
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="newest">最新</DropdownItem>
                      <DropdownItem key="oldest">最早</DropdownItem>
                      <DropdownItem key="rating">评分</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* 添加评论 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">评分:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => setCommentRating(star)}
                        >
                          <Star
                            size={16}
                            className={star <= commentRating ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="写下你的评论..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    minRows={3}
                  />

                  <div className="flex justify-end">
                    <Button
                      color="primary"
                      onPress={handleCommentSubmit}
                      isDisabled={!newComment.trim()}
                    >
                      发表评论
                    </Button>
                  </div>
                </div>

                <Divider />

                {/* 评论列表 */}
                <div className="space-y-4">
                  {commentsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    ))
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar
                          src={comment.user.image}
                          size="sm"
                          showFallback
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.user.name}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < comment.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <Button variant="light" size="sm" startContent={<ThumbsUp size={12} />}>
                              {comment.likes}
                            </Button>
                            <Button variant="light" size="sm">
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 - 相关推荐 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">相关推荐</h3>

            <div className="space-y-3">
              {relatedWorks.map((relatedWork) => (
                <Link key={relatedWork.id} href={`/content/${relatedWork.id}`}>
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <div className="w-32 h-20 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      {relatedWork.thumbnailUrl ? (
                        <img
                          src={relatedWork.thumbnailUrl}
                          alt={relatedWork.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          🎨
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {relatedWork.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        {relatedWork.user.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatViews(relatedWork.downloads)} 观看</span>
                        <span>•</span>
                        <span>{relatedWork.uploadTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 分享模态框 */}
      <Modal isOpen={isShareOpen} onOpenChange={onShareOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>分享作品</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="分享链接"
                    value={`${window.location.origin}/content/${workId}`}
                    readOnly
                    endContent={
                      <Button size="sm" variant="flat">
                        复制
                      </Button>
                    }
                  />

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