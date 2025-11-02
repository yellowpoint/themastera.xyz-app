"use client";

import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { request } from "@/lib/request";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type PlaylistItem = {
  id: string;
  title: string;
  author: string;
  thumbnail?: string | null;
  href?: string;
};

type Playlist = {
  id: string;
  name: string;
  items: PlaylistItem[];
};

export function SidebarPlaylistSection() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [visibleNextCount, setVisibleNextCount] = useState<number>(5);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const fetchPlaylists = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/playlists");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load");
      const data: Playlist[] = json.data || [];
      setPlaylists(data);
      setSelectedId((prev) => prev || data[0]?.id || null);
    } catch (e: any) {
      setError(e?.message || "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Load previously selected playlist from localStorage
  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem("selectedPlaylistId")
          : null;
      if (saved) setSelectedId(saved);
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  // Persist selected playlist id
  useEffect(() => {
    try {
      if (selectedId && typeof window !== "undefined") {
        window.localStorage.setItem("selectedPlaylistId", selectedId);
      }
    } catch (_) {
      // ignore storage errors
    }
  }, [selectedId]);

  // Refresh playlists when WorkCard emits an update
  useEffect(() => {
    const handler = () => {
      fetchPlaylists();
    };
    window.addEventListener("playlist:updated", handler as EventListener);
    return () => {
      window.removeEventListener("playlist:updated", handler as EventListener);
    };
  }, [fetchPlaylists]);

  // Listen to global player events to know current playing work
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const id = ce?.detail?.workId || ce?.detail?.id;
      if (typeof id === "string") {
        setCurrentPlayingId(id);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("player:now-playing", handler as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "player:now-playing",
          handler as EventListener
        );
      }
    };
  }, []);

  const selected = useMemo(
    () => playlists.find((p) => p.id === selectedId) || null,
    [playlists, selectedId]
  );

  // Compute Now Playing and Next in Queue based on currentPlayingId
  const { nowPlaying, nextQueue } = useMemo(() => {
    const items = selected?.items || [];
    if (!items.length) return { nowPlaying: [], nextQueue: [] };

    const idx = currentPlayingId
      ? items.findIndex((i) => i.id === currentPlayingId)
      : -1;
    if (idx === -1) {
      // Nothing playing from this playlist: show empty Now Playing, all items in queue
      return { nowPlaying: [], nextQueue: items };
    }
    const now = [items[idx]];
    const after = items.slice(idx + 1);
    const before = items.slice(0, idx);
    return { nowPlaying: now, nextQueue: [...after, ...before] };
  }, [selected?.items, currentPlayingId]);

  // Reset visible count when playlist or current playing changes
  useEffect(() => {
    setVisibleNextCount(5);
  }, [selectedId, currentPlayingId]);

  const handleDeleteItem = useCallback(
    async (workId: string) => {
      if (!selectedId) return;
      try {
        await request.delete(`/api/playlists/${selectedId}/entries`, {
          body: { workId },
        });
        // Optimistic update: remove item locally
        setPlaylists((prev) =>
          prev.map((pl) =>
            pl.id === selectedId
              ? { ...pl, items: pl.items.filter((i) => i.id !== workId) }
              : pl
          )
        );
        toast.success("Removed from playlist");
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("playlist:updated", {
              detail: { playlistId: selectedId, workId },
            })
          );
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to remove item");
      }
    },
    [selectedId]
  );
  const onCreate = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Create failed");
      const created: Playlist = json.data;
      const updated = [created, ...playlists];
      setPlaylists(updated);
      setSelectedId(created.id);
      setCreateOpen(false);
      setNewName("");
    } catch (e: any) {
      setError(e?.message || "Failed to create playlist");
    }
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Playlist</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search in your playlist"
              className="pl-8 h-9 bg-muted/20"
            />
          </div>
          {playlists.length > 0 ? (
            <Select
              value={selectedId || undefined}
              onValueChange={(val) => setSelectedId(val)}
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {playlists.map((pl) => (
                  <SelectItem key={pl.id} value={pl.id}>
                    {pl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-5" />
          </Button>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">
            Loading playlists...
          </div>
        ) : playlists.length === 0 ? (
          <div className="rounded-lg border p-3">
            <div className="text-sm font-semibold mb-1">Your library</div>
            <div className="text-xs text-muted-foreground mb-3">
              Create your playlist
            </div>
            <Button className="w-full" onClick={() => setCreateOpen(true)}>
              Create Playlist
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="text-base font-medium text-muted-foreground mb-2">
                Now playing
              </div>
              <div className="space-y-3">
                {nowPlaying.length > 0 ? (
                  nowPlaying.map((item) => (
                    <PlaylistRow
                      key={item.id}
                      item={item}
                      onDelete={() => handleDeleteItem(item.id)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No item playing
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-base font-medium text-muted-foreground mb-2">
                Next in Queue
              </div>
              <div className="space-y-3">
                {nextQueue.length > 0 ? (
                  nextQueue
                    .slice(0, visibleNextCount)
                    .map((item) => (
                      <PlaylistRow
                        key={item.id}
                        item={item}
                        onDelete={() => handleDeleteItem(item.id)}
                      />
                    ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No items in queue
                  </div>
                )}
              </div>
            </div>
            {nextQueue.length > visibleNextCount ? (
              <button
                className="flex items-center gap-2 text-sm text-foreground py-1"
                onClick={() => setVisibleNextCount((c) => c + 5)}
              >
                <ChevronDown className="size-4" />
                <span>Show more</span>
              </button>
            ) : null}
          </div>
        )}

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Playlist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function PlaylistRow({
  item,
  onDelete,
}: {
  item: PlaylistItem;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const href = item?.href || `/content/${item.id}`;

  const handleRowClick = () => {
    if (href) router.push(href);
  };

  return (
    <div
      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/30 cursor-pointer"
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleRowClick();
      }}
    >
      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
        <img
          className="w-full h-full object-contain"
          src={item?.thumbnail || "/thumbnail-placeholder.svg"}
          alt={item.title}
        />
      </div>
      <div className="flex-1 leading-tight">
        <div className="text-lg">{item.title}</div>
        <div className="text-sm text-muted-foreground">{item.author}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-red-700"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        aria-label="Remove"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
