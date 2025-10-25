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
import VideoPlayer from "@/components/VideoPlayer";

export default function ContentDetailPage() {
  const params = useParams();
  const workId = params.id;

  const [work, setWork] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoRef, setVideoRef] = useState(null);

  // Interaction state
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
          throw new Error('Work not found or has been deleted');
        } else if (response.status >= 500) {
          throw new Error('Server error, please try again later');
        } else {
          throw new Error('Failed to fetch work details');
        }
      }

      const data = await response.json();

      if (data.success) {
        setWork(data.data);
        setDuration(parseDuration(data.data.duration || '0:00'));
      } else {
        throw new Error(data.error || 'Failed to fetch work details');
      }
    } catch (err) {
      console.error('Error fetching work details:', err);
      setError(err.message || 'Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);

      const response = await fetch(`/api/works/${workId}/comments?limit=20&sort=newest`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();

      if (data.success) {
        setComments(data.data.comments || []);
      } else {
        throw new Error(data.error || 'Failed to fetch comments');
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
        throw new Error('Failed to fetch related works');
      }

      const data = await response.json();

      if (data.success) {
        setRelatedWorks(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch related works');
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
            {error?.includes('not found') || error?.includes('deleted') ? '😕' : '⚠️'}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {error?.includes('not found') || error?.includes('deleted') ? 'Work Not Found' : 'Failed to Load'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error || 'Could not find the requested work'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/content">
              <Button color="primary" variant="solid">
                Browse Other Works
              </Button>
            </Link>

            <Link href="/">
              <Button color="default" variant="light">
                Back to Home
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
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <VideoPlayer
              videoUrl={work.fileUrl}
              thumbnailUrl={work.thumbnailUrl}
              title={work.title}
              isPremium={work.premium}
              userMembership="VIP" // TODO: Get from user status
              className="mb-4"
            />

            {/* Work Information */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{work.title}</h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {formatViews(work.downloads)} views
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
                    Dislike
                  </Button>

                  <Button
                    variant="flat"
                    startContent={<Share2 size={16} />}
                    size="sm"
                    onPress={onShareOpen}
                  >
                    Share
                  </Button>

                  <Button
                    variant="flat"
                    startContent={<Download size={16} />}
                    size="sm"
                    color="primary"
                  >
                    Download
                  </Button>
                </div>
              </div>

              <Divider />

              {/* Creator Information */}
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
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {work.user.followers || 0} followers
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      color={isFollowing ? "default" : "primary"}
                      variant={isFollowing ? "flat" : "solid"}
                      size="sm"
                      startContent={isFollowing ? <BellRing size={16} /> : <Bell size={16} />}
                      onPress={handleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Work Description */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Description</h4>
                  <Button
                    variant="light"
                    size="sm"
                    endContent={showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    onPress={() => setShowDescription(!showDescription)}
                  >
                    {showDescription ? "Collapse" : "Expand"}
                  </Button>
                </div>

                <p className={`text-sm text-gray-600 dark:text-gray-400 ${showDescription ? "" : "line-clamp-3"}`}>
                  {work.description || "The creator has not added a description yet..."}
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

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle size={20} />
                    Comments ({comments.length})
                  </h3>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="flat" size="sm">
                        Sort by
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="newest">Newest</DropdownItem>
                      <DropdownItem key="oldest">Oldest</DropdownItem>
                      <DropdownItem key="rating">Rating</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Add Comment */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rating:</span>
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
                    placeholder="Write your comment..."
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
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Divider />

                {/* Comment List */}
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
                              Reply
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

          {/* Sidebar - Related Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Related</h3>

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
                        <span>{formatViews(relatedWork.downloads)} views</span>
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

      {/* Share Modal */}
      <Modal isOpen={isShareOpen} onOpenChange={onShareOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Share Work</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Share Link"
                    value={`${window.location.origin}/content/${workId}`}
                    readOnly
                    endContent={
                      <Button size="sm" variant="flat">
                        Copy
                      </Button>
                    }
                  />

                  <div className="flex gap-2">
                    <Button color="primary" variant="flat">WeChat</Button>
                    <Button color="primary" variant="flat">Weibo</Button>
                    <Button color="primary" variant="flat">QQ</Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}