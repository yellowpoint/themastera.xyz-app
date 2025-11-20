'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type Props = {
  title: string
  href: string
  coverSrc?: string | null
  updatedLabel?: string | null
  showMenu?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function PlaylistCard({
  title,
  href,
  coverSrc,
  updatedLabel,
  showMenu,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="space-y-3">
      <Link href={href} className="block">
        <div className="relative rounded-2xl overflow-hidden">
          {coverSrc ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-40" />
              <div className="relative">
                <img
                  src={coverSrc}
                  alt={title}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
              </div>
            </>
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-[#F6F9FC1A] flex items-center justify-center">
              <div className="text-white/80 text-sm">
                This playlist is empty
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl bg-black/40 px-3 py-2 text-white">
            <div className="min-w-0">
              <div className="text-sm truncate">{title}</div>
              {updatedLabel ? (
                <div className="text-xs text-white/80 truncate">
                  {updatedLabel}
                </div>
              ) : null}
            </div>
            {showMenu ? (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-white/10"
                      aria-label="More"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card">
                    {onEdit ? (
                      <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                    ) : null}
                    {onDelete ? (
                      <DropdownMenuItem onClick={onDelete}>
                        Delete
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  )
}
