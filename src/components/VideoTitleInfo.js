"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Download, Bell, BellRing } from "lucide-react";
import Link from "next/link";

/**
 * VideoTitleInfo Component
 * Displays video title, creator info, subscribe button, and interaction buttons
 * Based on Figma design: Frame 3480659
 */
export default function VideoTitleInfo({
  // Video info
  title = "Video Title",
  isPremium = false,

  // Creator info
  creatorId,
  creatorName = "Creator Name",
  creatorAvatar,
  subscribersCount = 0,

  // Follow state
  isFollowing = false,
  onFollow,

  // Like/Dislike state
  isLiked = false,
  isDisliked = false,
  likesCount = 0,
  dislikesCount = 0,
  onLike,
  onDislike,

  // Download
  onDownload,

  className = "",
}) {
  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Video Title */}
      <div className="px-6">
        <h1 className="text-3xl">
          {title}
        </h1>
      </div>

      {/* Creator Info and Action Buttons */}
      <div className="flex items-center justify-between gap-8 px-6">
        {/* Left Section: Creator Info + Subscribe Button */}
        <div className="flex items-center gap-2">
          {/* Creator Avatar and Info */}
          <div className="flex items-start gap-1">
            {/* Avatar */}
            <Link href={creatorId ? `/creator/${creatorId}` : "#"}>
              <div>
                <Avatar className="h-12 w-12 cursor-pointer">
                  <AvatarImage src={creatorAvatar} />
                  <AvatarFallback className="bg-primary/20 text-white">
                    {creatorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>

            {/* Creator Name and Subscribers */}
            <div className="flex flex-col justify-center px-3 py-1 flex-none">
              <Link href={creatorId ? `/creator/${creatorId}` : "#"}>
                <h3 className="">
                  {creatorName}
                </h3>
              </Link>
              <p className="text-sm">
                {formatCount(subscribersCount)} subscribers
              </p>
            </div>
          </div>

          {/* Subscribe Button */}
          <Button
            onClick={onFollow}
          >
            {isFollowing ? (
              <span className="inline-flex items-center gap-2">
                <BellRing />
                Subscribed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Bell />
                Subscribe
              </span>
            )}
          </Button>
        </div>

        {/* Right Section: Like/Dislike + Download + Pro Badge */}
        <div className="flex items-center gap-4 relative">
          {/* Like and Dislike Buttons Group */}
          <Button
            variant='secondary'
          >
            {/* Like Button */}
            <button
              onClick={onLike}
              className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity"
            >
              <ThumbsUp
                className={isLiked ? "fill-white" : ""}
              />
              <span>
                {likesCount > 0 ? formatCount(likesCount) : 0}
              </span>
            </button>

            {/* Divider */}
            <div
              className="w-0 h-8 border-l-2 border-dashed opacity-20"
              style={{ borderColor: "#F2F3F5" }}
            />

            {/* Dislike Button */}
            <button
              onClick={onDislike}
              className="flex items-center text-white hover:opacity-80 transition-opacity"
            >
              <ThumbsDown
                className={isDisliked ? "fill-white" : ""}
                strokeWidth={2}
              />
            </button>
          </Button>

          {/* Download Button */}
          <Button
            onClick={onDownload}
            variant='secondary'
          >
            <span className="inline-flex items-center gap-2 w-full">
              <Download />
              Download
            </span>
          </Button>

          {/* Pro Badge (positioned absolutely if premium) */}
          {isPremium && (
            <Badge
              className="absolute -right-2 -top-2 bg-primary text-white px-2.5 py-0 rounded text-sm font-normal leading-snug"
            >
              Pro
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
