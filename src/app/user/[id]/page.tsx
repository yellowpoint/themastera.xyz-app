"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, Grid2x2, ArrowLeft } from "lucide-react";
import UserProfileSidebar from "@/components/UserProfileSidebar";
import WorkCardList from "@/components/WorkCardList";
import { request } from "@/lib/request";
import type { Work } from "@/contracts/domain/work";

export default function UserDetailPage() {
  const params = useParams();
  const userId = (params as Record<string, string>)?.id?.toString?.() || "";

  const [user, setUser] = useState<any>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "popular" | "oldest">("latest");

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const { data } = await request.get(`/api/users/${userId}`);
        const u = data?.data || null;
        if (!ignore) {
          setUser(u);
          const list = Array.isArray(u?.works)
            ? u.works.map((w: any) => ({
                ...w,
                // attach basic user info for card avatar
                user: u
                  ? { id: u.id, name: u.name, image: u.image }
                  : undefined,
              }))
            : [];
          setWorks(list as Work[]);
        }
      } catch (err) {
        const msg = (err as any)?.message || "Failed to load user";
        if (!ignore) setError(msg);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (userId) fetchUser();
    return () => {
      ignore = true;
    };
  }, [userId]);

  const sortedWorks = useMemo(() => {
    const list: Work[] = Array.isArray(works) ? [...works] : [];
    switch (sort) {
      case "popular":
        return list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime()
        );
      default:
        return list.sort(
          (a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
        );
    }
  }, [works, sort]);

  const handleSubscribeChanged = (action: "follow" | "unfollow") => {
    setUser((prev) => {
      if (!prev) return prev;
      const followed = action === "follow";
      const delta = followed ? 1 : -1;
      const nextFollowers = Math.max(0, (prev.followersCount || 0) + delta);
      return {
        ...prev,
        isFollowing: followed,
        followersCount: nextFollowers,
      };
    });
  };

  return (
    <div className="h-full">
      {/* Main split layout */}
      <div className="container mx-auto px-4 py-6 flex gap-6 h-full">
        {/* Left: Profile Sidebar */}
        <UserProfileSidebar
          user={user}
          onSubscribeChanged={handleSubscribeChanged}
        />

        {/* Right: Works and filters */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={sort === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSort("popular")}
              >
                Popular
              </Button>
              <Button
                variant={sort === "latest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSort("latest")}
              >
                Latest
              </Button>
              <Button
                variant={sort === "oldest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSort("oldest")}
              >
                Oldest
              </Button>
              <Button variant="outline" size="icon-sm" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Works grid */}
          <WorkCardList
            works={sortedWorks}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
