"use client";
import React, { useState, useEffect } from "react";
import MuxPlayer from '@mux/mux-player-react'
// shadcn/ui replacements
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Play, Lock, Crown, Star, Zap } from "lucide-react";

const MEMBERSHIP_LEVELS = {
  Free: { name: "Free User", icon: null, color: "default" },
  "Creator+": { name: "Creator+", icon: Crown, color: "warning" },
  ArtCircle: { name: "ArtCircle", icon: Star, color: "secondary" },
  VIP: { name: "VIP", icon: Zap, color: "success" }
};

export default function VideoPlayer({
  videoUrl,
  playbackId,
  thumbnailUrl,
  title = "Video Content",
  description,
  isPremium = false,
  requiredLevel = "Free",
  userLevel = "Free",
  width = "100%",
  height = "400px",
  className = "",
  onPlay,
  onPause,
  onEnded,
  showControls = true,
  autoPlay = false,
  muted = false
}) {
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check user access
  useEffect(() => {
    const checkAccess = () => {
      if (!isPremium) {
        setHasAccess(true);
        return;
      }

      const levelHierarchy = ["Free", "Creator+", "ArtCircle", "VIP"];
      const userLevelIndex = levelHierarchy.indexOf(userLevel);
      const requiredLevelIndex = levelHierarchy.indexOf(requiredLevel);

      setHasAccess(userLevelIndex >= requiredLevelIndex);
    };

    checkAccess();
  }, [isPremium, userLevel, requiredLevel]);

  // Directly return the video URL (already a full link)
  // Removed ReactPlayer helper; use native <video> for non-Mux playback

  // Handle play event
  const handlePlay = () => {
    onPlay && onPlay();
  };

  const handlePause = () => {
    onPause && onPause();
  };

  const handleEnded = () => {
    onEnded && onEnded();
  };

  const handleError = (error) => {
    console.log('Video URL:', videoUrl);
    console.log('Error details:', error);
    setError('Video failed to load, please try again later');
  };

  const handleReady = () => {
    // ReactPlayer is ready
  };

  // Upgrade membership prompt
  const UpgradePrompt = () => {
    const requiredMembership = MEMBERSHIP_LEVELS[requiredLevel];
    const RequiredIcon = requiredMembership.icon;

    return (
      <div className="relative">
        {/* Thumbnail background */}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        {/* Mask layer */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white">{title}</h3>

            {description && (
              <p className="text-white/80 text-sm max-w-md">{description}</p>
            )}

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-white/80">Requires</span>
              <Badge
                className={`${requiredMembership.color === "warning" ? "bg-yellow-500 text-white" : ""}
                  ${requiredMembership.color === "secondary" ? "bg-secondary text-secondary-foreground" : ""}
                  ${requiredMembership.color === "success" ? "bg-green-600 text-white" : ""}`}
              >
                {RequiredIcon && <RequiredIcon className="mr-1 h-4 w-4" />}
                {requiredMembership.name}
              </Badge>
              <span className="text-white/80">and above</span>
            </div>

            <Button
              variant="default"
              onClick={() => setIsOpen(true)}
              className="font-semibold"
            >
              Upgrade to Watch
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // If there is no video source, display an error message
  if (!videoUrl && !playbackId) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div style={{ width, height }} className="flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Video file does not exist</p>
              <p className="text-sm text-gray-400">Please check if the video file has been uploaded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If there is no access, display the upgrade prompt
  if (!hasAccess) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div style={{ width, height }}>
            <UpgradePrompt />
          </div>
        </CardContent>

        {/* Upgrade membership modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade Membership</DialogTitle>
              <DialogDescription>
                Upgrade to {MEMBERSHIP_LEVELS[requiredLevel].name} to watch this content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-2">
              <p className="text-sm text-gray-600">Membership privileges:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Watch HD video content</li>
                <li>• Download high-quality materials</li>
                <li>• Participate in exclusive events</li>
                <li>• Get more points rewards</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => setIsOpen(false)}>
                Upgrade Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  // Show video player when there is access
  return (
    <Card className='rounded-none bg-black'>
      <CardContent className="p-0  ">
        <div style={{ width, height }} className="relative">

          {error ? (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div className="text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setError(null);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            (() => {
              const isMuxPlayback = Boolean(playbackId) || (videoUrl && videoUrl.includes('stream.mux.com'))
              if (isMuxPlayback) {
                const effectivePlaybackId = playbackId || (videoUrl?.match(/stream\.mux\.com\/([^.?]+)/)?.[1])
                return (
                  <MuxPlayer
                    style={{
                      width: '100%',
                      height: '100%',
                      // Ensure video covers container without side black bars
                      '--media-object-fit': 'cover',
                      '--media-object-position': 'center'
                    }}
                    playbackId={effectivePlaybackId}
                    metadata={{
                      video_title: title,
                    }}
                    streamType="on-demand"
                    autoPlay={autoPlay}
                    muted={muted}
                    playsInline
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                  />
                )
              }
              // Fallback to native HTML5 video player when not using Mux
              return (
                <video
                  src={videoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  controls={showControls}
                  autoPlay={autoPlay}
                  muted={muted}
                  preload="metadata"
                  playsInline
                  controlsList="nodownload"
                  crossOrigin="anonymous"
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  onError={handleError}
                />
              )
            })()
          )}
        </div>
      </CardContent>
    </Card>
  );
}