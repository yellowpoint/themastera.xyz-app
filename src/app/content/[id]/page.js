"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  User,
  Bell,
  BellRing,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import VideoTitleInfo from "@/components/VideoTitleInfo";
import VideoInfoSection from "@/components/VideoInfoSection";
import { toast } from "sonner";
import { request } from "@/lib/request";

export default function ContentDetailPage() {
  const params = useParams();
  const workId = params.id;

  const [work, setWork] = useState(null);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const [isShareOpen, setShareOpen] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('videos');

  useEffect(() => {
    if (workId) {
      fetchWorkDetails();
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
        
        // Increment view count after successfully loading work details
        try {
          await request.post(`/api/works/${workId}/views`);
        } catch (viewError) {
          console.error('Error incrementing view count:', viewError);
          // Don't show error to user for view count increment failure
        }
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

  const formatDate = (dateInput) => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return dateInput || '';
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    } catch (_) {
      return dateInput || '';
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



  if (loading) {
    return (
      <div className="min-h-screen bg-content-bg">
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
      <div className="min-h-screen bg-content-bg flex items-center justify-center">
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
    <div className="min-h-screen bg-content-bg">
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
            <div className="space-y-4 mt-4">
              {/* Video Title and Creator Info using new component */}
              <VideoTitleInfo
                title={work.title}
                isPremium={work.premium}
                creatorId={work.user.id}
                creatorName={work.user.name}
                creatorAvatar={work.user.image}
                subscribersCount={authorFollowersCount}
                isFollowing={isFollowing}
                onFollow={handleFollow}
                isLiked={isLiked}
                isDisliked={isDisliked}
                likesCount={likesCount}
                dislikesCount={dislikesCount}
                onLike={handleLike}
                onDislike={handleDislike}
                onDownload={() => toast.info("Download feature coming soon")}
              />

              {/* Video Stats and Description */}
              <VideoInfoSection
                views={work.views ?? work.downloads}
                uploadDate={work.uploadTime ?? work.createdAt}
                description={work.description}
                tags={work.tags ? work.tags.split(',').map(tag => tag.trim()) : []}
              />
            </div>
          </div>

          {/* Sidebar - Media Tabs + Queue + Library */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              {['videos', 'musics', 'podcasts'].map(tab => (
                <Button key={tab} variant={activeMediaTab === tab ? 'default' : 'ghost'} size="sm" onClick={() => setActiveMediaTab(tab)} className="capitalize">
                  {tab}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Now playing</h3>
                <div className="flex gap-3 p-2 rounded-lg bg-accent/20">
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                    {work.thumbnailUrl && (
                      <img src={work.thumbnailUrl} alt={work.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-1">{work.title}</div>
                    <div className="text-xs text-muted-foreground">{work.user.name}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Next in queue</h3>
                <div className="space-y-2">
                  {relatedWorks.slice(0, 2).map(item => (
                    <Link key={item.id} href={`/content/${item.id}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer">
                        <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                          {item.thumbnailUrl && (
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-1">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.user.name}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-semibold mb-2">Your library</h3>
                <p className="text-xs text-muted-foreground mb-3">Create your playlist</p>
                <Button className="w-full">Create your playlist</Button>
              </div>
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