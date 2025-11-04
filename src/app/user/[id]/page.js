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
          const list = Array.isArray(u?.works) ? u.works.map(w => ({
            ...w,
            // attach basic user info for card avatar
            user: u ? { id: u.id, name: u.name, image: u.image } : undefined,
          })) : [];
          setWorks(list);
        }
      } catch (err) {
        if (!ignore) setError(err?.message || "Failed to load user");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (userId) fetchUser();
    return () => { ignore = true; };
  }, [userId]);

  const sortedWorks = useMemo(() => {
    const list = Array.isArray(works) ? [...works] : [];
    switch (sort) {
      case "popular":
        return list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case "oldest":
        return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [works, sort]);

  return (
    <div className="min-h-screen">
      {/* Top header area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">{user?.name || "User"}</h1>
            <p className="text-sm text-muted-foreground">Browse this creator's works.</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      {/* Main split layout */}
      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Left: Profile Sidebar */}
        <UserProfileSidebar className="border border-dashed rounded-md" />

        {/* Right: Works and filters */}
        <div className="flex-1 min-w-0">
          {/* Tabs and controls */}
          <div className="flex items-center justify-between mb-4">
            <Tabs value="videos" className="w-auto">
              <TabsList>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="musics">Musics</TabsTrigger>
                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
              </TabsList>
            </Tabs>
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
              <Button variant="outline" size="icon" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured row (optional preview card) */}
          {sortedWorks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-6">
              {/* Left thumbnail placeholder to mimic design */}
              <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                <img
                  src={sortedWorks[0]?.thumbnailUrl || "/thumbnail-placeholder.svg"}
                  alt={sortedWorks[0]?.title || "Featured"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {sortedWorks[0]?.title || "Featured work title can span two lines"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  We transform complex data into clear, actionable growth decisions—bridging media, retail, and customer insights.
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Grid2x2 className="h-4 w-4" />
                  <span>{sortedWorks[0]?.downloads || 0} views</span>
                </div>
              </div>
            </div>
          )}

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