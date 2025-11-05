"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Crown } from "lucide-react";
import { toast } from "sonner";
import SubscribeButton from "@/components/SubscribeButton";

export default function UserProfileSidebar({ user, onSubscribeChanged }) {
  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    toast.success("Mastera ID copied to clipboard");
  };

  return (
    <div
      className={`flex-none w-[300px] bg-white overflow-y-auto border-r border-dashed border-gray-300`}
    >
      <div className="p-6 space-y-3">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-6">
          <Avatar className="size-32 rounded-xl overflow-hidden">
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-1 w-full">
            <h2 className="text-2xl font-normal">{user?.name || "Unnamed"}</h2>
            <Badge className="rounded h-6 px-2 gap-1 bg-black text-yellow-300 flex items-center">
              <Crown className="w-4 h-4" />
              <span className="text-xs tracking-wide">
                {(user?.level || "Top Mentor").toUpperCase()}
              </span>
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-full">
              <span className="truncate">Mastera ID: {user?.id || "-"}</span>
              <button
                className="p-1 hover:bg-gray-100 rounded flex-none"
                onClick={handleCopyId}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 pb-6">
          <div className="flex flex-col items-center gap-3">
            <span className="text-base font-normal text-foreground">
              {user?.followingCount ?? 0}
            </span>
            <span className="text-base text-muted-foreground">Following</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-base font-normal text-foreground">
              {user?.followersCount ?? 0}
            </span>
            <span className="text-base text-muted-foreground">Followers</span>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="flex justify-center pb-6">
          <SubscribeButton
            userId={user?.id}
            isFollowing={user?.isFollowing}
            onChanged={onSubscribeChanged}
          />
        </div>

        <Separator className="opacity-20" />

        {/* Description */}
        <div className="pt-2">
          <p className="text-sm font-light text-muted-foreground leading-relaxed">
            {user?.description || "No description provided yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
