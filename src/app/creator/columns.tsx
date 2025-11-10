'use client'

import { DeleteWorkDialog } from '@/components/creator/DeleteWorkDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Work } from '@/contracts/domain/work'
import { formatDate, formatDuration, formatViews } from '@/lib/format'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function useCreatorColumns() {
  const router = useRouter()

  const columns: ColumnDef<Work>[] = [
    {
      id: 'video',
      header: () => <span>Video</span>,
      cell: ({ row }) => {
        const work = row.original
        return (
          <div className="flex gap-2 items-start min-w-30 h-[72px]">
            <div className="relative flex-shrink-0 h-full">
              <div className="w-[100px] h-full bg-gray-200  ">
                <img
                  src={work.thumbnailUrl || '/placeholder-video.jpg'}
                  alt={work.title}
                  className={`w-full h-full object-cover rounded-lg ${
                    work.status === 'draft' ? 'opacity-60' : ''
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
                    {work.description || 'No description'}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    {work.description || 'No description'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )
      },
    },
    {
      id: 'status',
      header: () => <span>Status</span>,
      cell: ({ row }) => (
        <span className="text-sm text-[#1D2129] capitalize">
          {row.original.status || 'Draft'}
        </span>
      ),
      size: 50,
    },
    {
      id: 'views',
      accessorFn: (row) => row.views ?? 0,
      enableSorting: true,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
      id: 'date',
      header: () => <span>Date</span>,
      cell: ({ row }) => (
        <span className="text-sm text-[#1D2129]">
          {formatDate(row.original.createdAt)}
        </span>
      ),
      size: 80,
    },
    {
      id: 'action',
      header: () => <span>Action</span>,
      cell: ({ row }) => {
        const work = row.original
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
                <Button variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() =>
                    router.push(`/creator/upload?copyFrom=${work.id}`)
                  }
                >
                  Copy
                </DropdownMenuItem>
                <DeleteWorkDialog workId={work.id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 80,
    },
  ]

  return columns
}
