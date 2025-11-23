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
  coverSrcs?: Array<string | null | undefined>
  updatedLabel?: string | null
  showMenu?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function PlaylistCard({
  title,
  href,
  coverSrc,
  coverSrcs,
  updatedLabel,
  showMenu,
  onEdit,
  onDelete,
}: Props) {
  const imgs = (coverSrcs || []).filter(Boolean).map((s) => s as string)
  if (imgs.length === 1) imgs.push(imgs[0], imgs[0])
  if (imgs.length === 2) imgs.push(imgs[0])
  const CARD_W = 248
  const CARD_H = 200
  const sizes = [
    { w: 240, h: 176 },
    { w: 220, h: 155 },
    { w: 200, h: 146 },
  ].map(({ w, h }) => ({
    wPct: `${(w / CARD_W) * 100}%`,
    hPct: `${(h / CARD_H) * 100}%`,
  }))

  return (
    <div className="space-y-3">
      <Link href={href} className="block group">
        <div className="relative w-full rounded-lg overflow-hidden bg-[rgba(1,1,9,0.5)] backdrop-blur-[10px]">
          <div
            className="relative w-full"
            style={{
              paddingBottom: `calc(${sizes[0].hPct}`,
            }}
          >
            {imgs.length >= 3 ? (
              <>
                <div
                  className="absolute left-1/2 top-1 -translate-x-1/2 z-3"
                  style={{ width: sizes[0].wPct, height: sizes[0].hPct }}
                >
                  <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:scale-[1.02] rounded-2xl overflow-hidden">
                    <img
                      src={imgs[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </div>
                <div
                  className="absolute left-1/2 top-[15%] -translate-x-1/2 z-2"
                  style={{ width: sizes[1].wPct, height: sizes[1].hPct }}
                >
                  <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:-translate-y-[2%] group-hover:scale-[1.01] rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                    <img
                      src={imgs[1]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                </div>
                <div
                  className="absolute left-1/2 top-[25%] -translate-x-1/2 z-1"
                  style={{ width: sizes[2].wPct, height: sizes[2].hPct }}
                >
                  <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:-translate-y-[4%] group-hover:scale-[1.01] rounded-2xl overflow-hidden border border-white/25 shadow-lg">
                    <img
                      src={imgs[2]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </div>
              </>
            ) : coverSrc ? (
              <div className="absolute inset-0">
                <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:scale-105">
                  <img
                    src={coverSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#F6F9FC1A] flex items-center justify-center">
                <div className="text-white/80 text-sm">
                  This playlist is empty
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-white">
            <div className="min-w-0">
              <div className="text-xl truncate">{title}</div>
              {updatedLabel ? (
                <div className="text-xs text-muted-foreground truncate mt-1">
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onEdit()
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                    ) : null}
                    {onDelete ? (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onDelete()
                        }}
                      >
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
