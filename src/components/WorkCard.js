"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatViews(views) {
  const v = Number.isFinite(views) ? views : 0;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toString();
}

export default function WorkCard({ work }) {
  const brokenThumbsRef = useRef(new Set());
  const resolveThumb = (url) => {
    if (!url) return "/thumbnail-placeholder.svg";
    return brokenThumbsRef.current.has(url) ? "/thumbnail-placeholder.svg" : url;
  };
  const handleImgError = (url, e) => {
    brokenThumbsRef.current.add(url);
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/thumbnail-placeholder.svg";
  };

  const viewsCount = typeof work?.views === "number" ? work.views : (typeof work?.downloads === "number" ? work.downloads : 0);
  const durationLabel = work?.duration ? work.duration : (work?.durationSeconds ? formatTime(work.durationSeconds) : "0:00");

  return (
    <Link href={`/content/${work?.id}`} className="group cursor-pointer block">
      <div className="relative mb-3">
        <div className="aspect-video bg-muted rounded-xl overflow-hidden">
          <img
            src={resolveThumb(work?.thumbnailUrl)}
            alt={work?.title || "Untitled"}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => handleImgError(work?.thumbnailUrl, e)}
          />
          <div className="absolute top-2 left-2 bg-[#1D2129CC] text-white text-xs px-2 py-1 rounded-sm">
            {formatViews(viewsCount)} views
          </div>
          <div className="absolute top-2 right-2 bg-[#1D2129CC] text-white text-xs px-2 py-1 rounded-sm">
            {durationLabel}
          </div>
        </div>

        <div className="flex items-start gap-3 mt-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={work?.user?.image} />
            <AvatarFallback>{work?.user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {work?.title}
              </h3>
              <button className="text-muted-foreground hover:text-foreground flex-shrink-0" aria-label="More">
                <MoreVertical size={18} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {work?.user?.name || "Unknown Creator"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}