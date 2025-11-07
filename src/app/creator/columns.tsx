"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { formatDuration, formatDate, formatViews } from "@/lib/format";
import { api } from "@/lib/request";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

export type WorkRow = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number;
  status?: string;
  views?: number;
  createdAt?: string;
  user?: { name?: string } | null;
};

export function useCreatorColumns() {
  const router = useRouter();
  const handleDeleteWork = async (workId: string) => {
    try {
      const res = await api.delete(`/api/works/${workId}`);
      const result = res.data;
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || "Failed to delete work";
        throw new Error(msg);
      }
      toast.success("Work deleted successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("work-deleted", { detail: { id: workId } })
        );
      }
    } catch (error: any) {
      console.error("Error deleting work:", error);
      toast.error("Failed to delete work");
    }
  };

  const columns: ColumnDef<WorkRow>[] = [
    {
      id: "video",
      header: () => <span>Video</span>,
      cell: ({ row }) => {
        const work = row.original;
        return (
          <div className="flex gap-2 items-start min-w-30 h-[72px]">
            <div className="relative flex-shrink-0 h-full">
              <div className="w-[100px] h-full bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={work.thumbnailUrl || "/placeholder-video.jpg"}
                  alt={work.title}
                  className={`w-full h-full object-cover ${
                    work.status === "draft" ? "opacity-60" : ""
                  }`}
                />
              </div>
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                {formatDuration(work.durationSeconds)}
              </div>
            </div>
            <div className="flex-1 min-w-20 h-full flex flex-col justify-between py-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-normal text-[#1D2129] line-clamp-2 mb-1 ">
                    {work.title}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{work.title}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-[#86909C] truncate line-clamp-2">
                    {work.description || "No description"}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    {work.description || "No description"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      id: "visibility",
      header: () => <span>Visibility</span>,
      cell: ({ row }) => (
        <span className="text-sm text-[#1D2129] capitalize">
          {row.original.status || "Draft"}
        </span>
      ),
      size: 50,
    },
    {
      id: "views",
      accessorFn: (row) => row.views ?? 0,
      enableSorting: true,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Views
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-[#1D2129] block text-center">
          {formatViews(row.original.views || 0)}
        </span>
      ),
      size: 50,
    },
    {
      id: "date",
      header: () => <span>Date</span>,
      cell: ({ row }) => (
        <span className="text-sm text-[#1D2129]">
          {formatDate(row.original.createdAt)}
        </span>
      ),
      size: 80,
    },
    {
      id: "action",
      header: () => <span>Action</span>,
      cell: ({ row }) => {
        const work = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/creator/edit/${work.id}`)}
              className="text-sm text-[#1D2129] hover:underline whitespace-nowrap"
            >
              Edit
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  // className="text-[#4E5969] hover:text-[#1D2129]"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/creator/edit/${work.id}`)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/content/${work.id}`)}
                >
                  View
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete work</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the work and remove its data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={() => handleDeleteWork(work.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 80,
    },
  ];

  return columns;
}
