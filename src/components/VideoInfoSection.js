"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatViews, formatDate } from "@/lib/format";

/**
 * VideoInfoSection Component
 * Displays video stats (views, date) and expandable description
 * Based on Figma design: Frame 3480666
 */
export default function VideoInfoSection({
  views = 0,
  uploadDate,
  description = "",
  tags = [],
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex flex-col gap-2  ${className}`}>
      {/* Stats Row: Views and Date */}
      <div className="px-6">
        <p className=" text-[#FF00FF]">
          {formatViews(views)} views  {formatDate(uploadDate, 'MM-DD-YYYY')}
        </p>
      </div>

      {/* Description Section */}
      <div className="px-6">
        <div className="flex items-end gap-6 bg-white/5 rounded-lg px-6 py-3">
          {/* Description Text */}
          <div className="flex-1">
            <div className={`text-sm text-[#F7F8FA] ${isExpanded ? "" : "line-clamp-3"}`}>
              <p className="text-base mb-2">Description of this video</p>
              <p className="whitespace-pre-wrap">
                {description || "The creator has not added a description yet..."}
              </p>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-normal border border-white/20 text-[#F7F8FA] hover:bg-white/10 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 text-sm font-normal text-[#F7F8FA] hover:opacity-80 transition-opacity whitespace-nowrap pb-1"
          >
            <span>{isExpanded ? "Collapse" : "Expend for more"}</span>
            {isExpanded ? (
              <ChevronUp size={24} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
