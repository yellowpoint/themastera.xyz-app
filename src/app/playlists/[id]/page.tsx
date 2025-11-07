"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api as request } from "@/lib/request";
import AuthRequired from "@/components/auth-required";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ArrowLeft, PlaySquare } from "lucide-react";
import { toast } from "sonner";

type Item = {
  id: string;
  title?: string | null;
  author?: string | null;
  thumbnail?: string | null;
  href?: string;
};

type PlaylistDetail = {
  id: string;
  name: string;
  items: Item[];
};

export default function PlaylistDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [playlist, setPlaylist] = React.useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [deletingWorkId, setDeletingWorkId] = React.useState<string | null>(
    null
  );

  const playlistId = params?.id;

  const fetchDetail = React.useCallback(async () => {
    if (!playlistId) return;
    setLoading(true);
    try {
      const { data } = await request.get(`/api/playlists/${playlistId}`);
      setPlaylist(data.data);
    } catch (err) {
      // handled by request
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  React.useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const removeEntry = async (workId: string) => {
    if (!playlistId) return;
    setDeletingWorkId(workId);
    try {
      await request.delete(`/api/playlists/${playlistId}/entries`, {
        body: JSON.stringify({ workId }),
      });
      toast.success("Removed from playlist");
      setPlaylist((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((i) => i.id !== workId) }
          : prev
      );
    } catch (err) {
      // handled by request
    } finally {
      setDeletingWorkId(null);
    }
  };

  return (
    <AuthRequired protectedPrefixes={["/playlists"]}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/playlists")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">
              {playlist?.name || "Playlist"}
            </h1>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !playlist || playlist.items.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                No videos in this playlist
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playlist.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail || "/thumbnail-placeholder.svg"}
                          alt={item.title || "Thumbnail"}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div>
                          <Link
                            href={item.href || "#"}
                            className="font-medium hover:underline flex items-center gap-2"
                          >
                            <PlaySquare className="h-4 w-4" />
                            {item.title || "Untitled"}
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.author || "-"}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingWorkId === item.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove video?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the video from the playlist.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeEntry(item.id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AuthRequired>
  );
}
