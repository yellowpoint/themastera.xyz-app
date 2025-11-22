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

  return (
    <div className="space-y-3">
      <Link href={href} className="block group">
        <div className="relative w-full rounded-lg overflow-hidden bg-[rgba(1,1,9,0.5)] backdrop-blur-[10px]">
          <div className="relative w-full pb-[60%]">
            {imgs.length >= 3 ? (
              <>
                <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[90%] h-[40%]">
                  <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:-translate-y-[6%] group-hover:scale-[1.01] border border-[#86909C]  rounded-xl overflow-hidden ">
                    <img
                      src={imgs[2]}
                      alt={title}
                      className="w-full h-full object-cover "
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </div>
                <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] ">
                  <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:-translate-y-[2%] group-hover:scale-[1.02] border border-[#86909C] rounded-xl overflow-hidden">
                    <img
                      src={imgs[1]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>
                </div>
                <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[48%] h-[70%] ">
                  <div className="w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:-translate-y-[4%] group-hover:scale-[1.03] rounded-xl overflow-hidden">
                    <img
                      src={imgs[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
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
            <div className="absolute bottom-[10px] left-[10px] right-[10px] flex items-center justify-between px-2 text-white">
              <div className="min-w-0">
                <div className="text-xl truncate">{title}</div>
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
        </div>
      </Link>
    </div>
  )
}
