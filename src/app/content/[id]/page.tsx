"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ChevronDown, Frown } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import VideoTitleInfo from "@/components/VideoTitleInfo";
import VideoInfoSection from "@/components/VideoInfoSection";
import WorkCardList from "@/components/WorkCardList";
import { toast } from "sonner";
import { request } from "@/lib/request";
import { formatViews } from "@/lib/format";
import { SidebarPlaylistSection } from "@/components/sidebar-playlist-section";

export default function ContentDetailPage() {
  const params = useParams();
  const rawId = (params as any)?.id;
  const workId: string = Array.isArray(rawId) ? rawId[0] : (rawId || "");
  const router = useRouter();

  const [work, setWork] = useState(null);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction state
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [authorFollowersCount, setAuthorFollowersCount] = useState(0);

  const [isShareOpen, setShareOpen] = useState(false);
  const [isDescExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (workId) {
      fetchWorkDetails();
      fetchRelatedWorks();
      // Announce currently playing work to sidebar
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("player:now-playing", { detail: { workId } })
          );
        }
      } catch (_) {
        // ignore
      }
    }
  }, [workId]);

  const handleDownload = async () => {
    try {
      if (!workId) return;
      toast.info("Preparing download...");
      // Trigger browser download via our API route
      const url = `/api/mux/download?workId=${encodeURIComponent(workId)}`;
      // Use a temporary anchor to avoid interfering with SPA navigation state
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Best-effort increment downloads stat (ignore errors)
      try {
        await request.post("/api/works/stats", { workId, type: "download" });
      } catch (e) {
        // silently ignore
      }
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed. Please try again later.");
    }
  };

  const fetchWorkDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await request.get(`/api/works/${workId}`);

      const { work, engagement, authorFollow } = data?.data || {};
      if (work) {
        setWork(work);

        // Increment view count after successfully loading work details
        try {
          await request.post(`/api/works/${workId}/views`);
        } catch (viewError) {
          console.error("Error incrementing view count:", viewError);
          // Don't show error to user for view count increment failure
        }

        // Record watch history (upsert latest viewed timestamp)
        try {
          await request.post("/api/history", { workId });
        } catch (historyError) {
          // Do not block page on history errors
          console.error("Error recording watch history:", historyError);
        }
      }
      if (engagement) {
        const { reaction, likesCount, dislikesCount } = engagement;
        setIsLiked(reaction === "like");
        setIsDisliked(reaction === "dislike");
        if (typeof likesCount === "number") setLikesCount(likesCount);
        if (typeof dislikesCount === "number") setDislikesCount(dislikesCount);
      }
      if (authorFollow) {
        setIsFollowing(!!authorFollow.isFollowing);
        if (typeof authorFollow.followersCount === "number") {
          setAuthorFollowersCount(authorFollow.followersCount);
        }
      }
    } catch (err) {
      console.error("Error fetching work details:", err);
      setError(err.message || "Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedWorks = async () => {
    try {
      const { data } = await request.get(
        `/api/works/trending?limit=8&exclude=${workId}`
      );
      setRelatedWorks((data as any)?.data?.items || []);
    } catch (err) {
      console.error("Error fetching related works:", err);
    }
  };

  // formatViews moved to shared module

  const handleLike = async () => {
    try {
      const action = isLiked ? "unlike" : "like";
      const { data } = await request.post(`/api/works/${workId}/engagement`, {
        action,
      });

      const { reaction, likesCount, dislikesCount } = data?.data || {};
      setIsLiked(reaction === "like");
      setIsDisliked(reaction === "dislike");
      if (typeof likesCount === "number") setLikesCount(likesCount);
      if (typeof dislikesCount === "number") setDislikesCount(dislikesCount);
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const action = isDisliked ? "undislike" : "dislike";
      const { data } = await request.post(`/api/works/${workId}/engagement`, {
        action,
      });
      const { reaction, likesCount, dislikesCount } = data?.data || {};
      setIsLiked(reaction === "like");
      setIsDisliked(reaction === "dislike");
      if (typeof likesCount === "number") setLikesCount(likesCount);
      if (typeof dislikesCount === "number") setDislikesCount(dislikesCount);
    } catch (err) {
      console.error("Error updating dislike:", err);
    }
  };

  // 已移除作品关注逻辑（改为赞/踩相斥）

  const handleFollow = async () => {
    try {
      await request.post(`/api/users/${work.user.id}/follow`, {
        action: isFollowing ? "unfollow" : "follow",
      });
      const next = !isFollowing;
      setIsFollowing(next);
      setAuthorFollowersCount((prev) => {
        const updated = next ? prev + 1 : Math.max(0, prev - 1);
        return updated;
      });
      toast.success(next ? "Followed the creator" : "Unfollowed the creator");
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  // Autoplay-next: navigate to the next item in selected playlist
  const handleEnded = async () => {
    try {
      // Read selected playlist id from localStorage; fallback to first playlist
      let selectedPlaylistId: string | null = null;
      if (typeof window !== "undefined") {
        selectedPlaylistId = window.localStorage.getItem("selectedPlaylistId");
      }
      const { data } = await request.get("/api/playlists");
      if (!data?.success) return;
      const pls = (data?.data?.items as any[]) || [];
      const selected =
        (selectedPlaylistId
          ? pls.find((p) => p.id === selectedPlaylistId)
          : null) || pls[0];
      const items = selected?.items || [];
      if (!items.length) return;
      const idx = items.findIndex((i) => i.id === workId);
      let nextItem = null;
      if (idx >= 0) {
        nextItem = items[idx + 1] || items[0];
      } else {
        // If current work not in selected playlist, try related works as fallback
        nextItem = relatedWorks?.[0] || null;
      }
      if (nextItem?.id) {
        router.push(`/content/${nextItem.id}`);
      }
    } catch (e) {
      // silently ignore navigation errors
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-content-bg">
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
      <div className="h-full bg-content-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4 flex items-center justify-center text-muted-foreground">
            {error?.includes("not found") || error?.includes("deleted") ? (
              <Frown className="w-12 h-12" />
            ) : (
              <AlertTriangle className="w-12 h-12" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {error?.includes("not found") || error?.includes("deleted")
              ? "Work Not Found"
              : "Failed to Load"}
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "Could not find the requested work"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/content">
              <Button variant="default">Browse Other Works</Button>
            </Link>

            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-content-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <VideoPlayer
              videoUrl={work.fileUrl}
              thumbnailUrl={work.thumbnailUrl}
              title={work.title}
              isPremium={work.premium}
              requiredLevel="VIP"
              userLevel="Free" // TODO: replace with actual user membership level
              className="mb-4"
              autoPlay={true}
              onPlay={() => {
                try {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("player:now-playing", {
                        detail: { workId },
                      })
                    );
                  }
                } catch (_) {}
              }}
              onEnded={handleEnded}
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
                onDownload={handleDownload}
              />

              {/* Video Stats and Description */}
              <VideoInfoSection
                views={work.views ?? work.downloads}
                uploadDate={work.uploadTime ?? work.createdAt}
                description={work.description}
                tags={
                  work.tags ? work.tags.split(",").map((tag) => tag.trim()) : []
                }
              />

              {/* Discovered on — show four works */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Discovered on</h3>
                <WorkCardList
                  works={(relatedWorks || []).slice(0, 4)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Artist profile */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Artist profile
              </div>
              <div className="text-3xl font-bold tracking-tight">
                {work?.user?.name || "Unknown Artist"}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatViews(authorFollowersCount)} subscribers
              </div>
            </div>

            {/* Description card with collapse */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Description of this Credit info
              </h3>
              <div className="rounded-lg bg-muted/40 p-3">
                <p
                  className={`text-sm text-muted-foreground ${isDescExpanded ? "" : "line-clamp-3"}`}
                >
                  {work?.description || "No description available."}
                </p>
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-2 inline-flex items-center gap-2 text-sm"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isDescExpanded ? "rotate-180" : ""}`}
                  />
                  {isDescExpanded ? "Collapse" : "Expand for more"}
                </button>
              </div>
            </div>

            {/* Playlist moved here from Sidebar */}
            <div className="space-y-3">
              <SidebarPlaylistSection />
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Work</DialogTitle>
            <DialogDescription>
              Copy the link or share via social apps.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/content/${workId}`}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${typeof window !== "undefined" ? window.location.origin : ""}/content/${workId}`
                    )
                  }
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">WeChat</Button>
              <Button variant="outline">Weibo</Button>
              <Button variant="outline">QQ</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShareOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
