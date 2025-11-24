'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

type CarouselItem = {
  id: string
  title?: string
  name?: string
  description?: string | null
  thumbnailUrl?: string | null
  coverUrl?: string | null
  user?: { name?: string | null } | null
}

type Props = {
  items: CarouselItem[]
  autoRotateMs?: number
  className?: string
}

export default function HeroImageCarousel({
  items,
  autoRotateMs = 5000,
  className,
}: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const carouselItems = React.useMemo(() => items.slice(0, 4), [items])

  React.useEffect(() => {
    if (items.length === 0) return
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, autoRotateMs)
    return () => clearInterval(id)
  }, [items, autoRotateMs])

  const current = items[currentIndex]
  const currentImg =
    current?.thumbnailUrl || current?.coverUrl || '/thumbnail-placeholder.svg'
  const currentTitle = current?.title || current?.name || ''
  const currentDesc = current?.description || current?.user?.name || ''

  return (
    <div
      className={`relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer ${className || ''}`}
      onClick={() => {
        const id = current?.id
        if (id) {
          router.push(`/section?section=${id}`)
        }
      }}
    >
      <img
        src={currentImg}
        alt={currentTitle}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between pointer-events-auto">
        <div className="flex items-end gap-6 w-full">
          <div
            className="flex gap-3 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {carouselItems.map((item, index) => {
              const isCurrent =
                index === currentIndex % Math.max(carouselItems.length, 1)
              return (
                <div
                  key={item.id}
                  className={`w-[100px] h-[74px] rounded-lg overflow-hidden cursor-pointer transition-all relative ${isCurrent ? 'opacity-100 ring-2 ring-white' : 'opacity-50 hover:opacity-90'}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={
                      item.thumbnailUrl ||
                      item.coverUrl ||
                      '/thumbnail-placeholder.svg'
                    }
                    alt={item.title || item.name || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            })}
          </div>
          <div
            className="flex-1 min-w-0 flex flex-col items-start justify-center gap-2 bg-overlay rounded-xl px-4 h-[74px] cursor-auto backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <h1 className="text-white flex-1 truncate">{currentTitle}</h1>
            </div>
            <div className="flex items-center text-white text-sm w-full line-clamp-2">
              {currentDesc}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
