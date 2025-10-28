"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { toast } from "sonner";
import { request } from "@/lib/request";

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
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [authorFollowersCount, setAuthorFollowersCount] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  const [isShareOpen, setShareOpen] = useState(false);

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
      const { data } = await request.get(`/api/works/${workId}`);

      const { work, engagement, authorFollow } = data?.data || {};
      if (work) {
        setWork(work);
        setDuration(parseDuration(work.duration || '0:00'));
      }
      if (engagement) {
        const { reaction, likesCount, dislikesCount } = engagement;
        setIsLiked(reaction === 'like');
        setIsDisliked(reaction === 'dislike');
        if (typeof likesCount === 'number') setLikesCount(likesCount);
        if (typeof dislikesCount === 'number') setDislikesCount(dislikesCount);
      }
      if (authorFollow) {
        setIsFollowing(!!authorFollow.isFollowing);
        if (typeof authorFollow.followersCount === 'number') {
          setAuthorFollowersCount(authorFollow.followersCount);
        }
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
      const { data } = await request.get(`/api/works/${workId}/comments?limit=20&sort=newest`);
      setComments(data?.data?.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRelatedWorks = async () => {
    try {
      const { data } = await request.get(`/api/works/trending?limit=8&exclude=${workId}`);
      setRelatedWorks(data?.data || []);
    } catch (err) {
      console.error('Error fetching related works:', err);
    }
  };

  const parseDuration = (durationStr) => {
    const parts = durationStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
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
    try {
      const action = isLiked ? 'unlike' : 'like';
      const { data } = await request.post(`/api/works/${workId}/engagement`, { action })

      const { reaction, likesCount, dislikesCount } = data?.data || {};
      setIsLiked(reaction === 'like');
      setIsDisliked(reaction === 'dislike');
      if (typeof likesCount === 'number') setLikesCount(likesCount);
      if (typeof dislikesCount === 'number') setDislikesCount(dislikesCount);

    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleDislike = async () => {
    try {
      const action = isDisliked ? 'undislike' : 'dislike';
      const { data } = await request.post(`/api/works/${workId}/engagement`, { action })
      const { reaction, likesCount, dislikesCount } = data?.data || {};
      setIsLiked(reaction === 'like');
      setIsDisliked(reaction === 'dislike');
      if (typeof likesCount === 'number') setLikesCount(likesCount);
      if (typeof dislikesCount === 'number') setDislikesCount(dislikesCount);
    } catch (err) {
      console.error('Error updating dislike:', err);
    }
  };

  // 已移除作品关注逻辑（改为赞/踩相斥）

  const handleFollow = async () => {
    try {
      await request.post(`/api/users/${work.user.id}/follow`, { action: isFollowing ? 'unfollow' : 'follow' })
      const next = !isFollowing;
      setIsFollowing(next);
      setAuthorFollowersCount((prev) => {
        const updated = next ? prev + 1 : Math.max(0, prev - 1);
        return updated;
      });
      toast.success(next ? 'Followed the creator' : 'Unfollowed the creator');
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await request.post(`/api/works/${workId}/comments`, {
        content: newComment,
        rating: commentRating,
        userId: 'current-user-id'
      })
      setNewComment("");
      setCommentRating(5);
      fetchComments(); // Refresh comments
      toast.success('Comment posted');
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
              <Button variant="default">
                Browse Other Works
              </Button>
            </Link>

            <Link href="/">
              <Button variant="ghost">
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
                  <Badge variant="outline">{work.category}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant={isLiked ? "default" : "outline"} size="sm" onClick={handleLike}>
                    <ThumbsUp size={16} className="mr-2" />
                    {`Like ${likesCount}`}
                  </Button>

                  <Button variant={isDisliked ? "destructive" : "outline"} size="sm" onClick={handleDislike}>
                    <ThumbsDown size={16} className="mr-2" />
                    {`Dislike ${dislikesCount}`}
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>

                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Creator Information */}
              <div className="flex items-start gap-4">
                <Link href={`/creator/${work.user.id}`}>
                  <Avatar className="h-12 w-12 cursor-pointer">
                    <AvatarImage src={work.user.image} />
                    <AvatarFallback />
                  </Avatar>
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
                    {authorFollowersCount} followers
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={handleFollow}
                    >
                      {isFollowing ? (
                        <span className="inline-flex items-center"><BellRing size={16} className="mr-2" /> Following</span>
                      ) : (
                        <span className="inline-flex items-center"><Bell size={16} className="mr-2" /> Follow</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Work Description */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Description</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    <span className="inline-flex items-center">
                      {showDescription ? "Collapse" : "Expand"}
                      {showDescription ? (
                        <ChevronUp size={16} className="ml-2" />
                      ) : (
                        <ChevronDown size={16} className="ml-2" />
                      )}
                    </span>
                  </Button>
                </div>

                <p className={`text-sm text-gray-600 dark:text-gray-400 ${showDescription ? "" : "line-clamp-3"}`}>
                  {work.description || "The creator has not added a description yet..."}
                </p>

                {work.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(work.tags ? work.tags.split(',').map(tag => tag.trim()) : []).map((tag, index) => (
                      <Badge key={index} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle size={20} />
                    Comments ({comments.length})
                  </h3>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Sort by</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Newest</DropdownMenuItem>
                      <DropdownMenuItem>Oldest</DropdownMenuItem>
                      <DropdownMenuItem>Rating</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Add Comment */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          size="icon"
                          variant="ghost"
                          onClick={() => setCommentRating(star)}
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
                    rows={3}
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="default"
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Separator />

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
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.user.image} />
                          <AvatarFallback />
                        </Avatar>
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
                            <Button variant="ghost" size="sm">
                              <ThumbsUp size={12} className="mr-2" />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
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

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Work</DialogTitle>
            <DialogDescription>Copy the link or share via social apps.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input value={`${typeof window !== 'undefined' ? window.location.origin : ''}/content/${workId}`} readOnly />
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/content/${workId}`)}>Copy</Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">WeChat</Button>
              <Button variant="outline">Weibo</Button>
              <Button variant="outline">QQ</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShareOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}