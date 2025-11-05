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

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.id?.toString?.() || "";

  const [user, setUser] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("latest"); // latest | popular | oldest

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
            ? u.works.map((w) => ({
                ...w,
                // attach basic user info for card avatar
                user: u
                  ? { id: u.id, name: u.name, image: u.image }
                  : undefined,
              }))
            : [];
          setWorks(list);
        }
      } catch (err) {
        if (!ignore) setError(err?.message || "Failed to load user");
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
    const list = Array.isArray(works) ? [...works] : [];
    switch (sort) {
      case "popular":
        return list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  }, [works, sort]);

  const handleSubscribeChanged = (action) => {
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
            items={sortedWorks}
            loading={loading}
            error={error}
            skeletonCount={12}
            loadMoreLabel="Load More"
          />
        </div>
      </div>
    </div>
  );
}
