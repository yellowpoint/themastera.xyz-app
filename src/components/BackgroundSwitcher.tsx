'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { Ban, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type BackgroundItem = { src: string | null; label: string }

export default function BackgroundSwitcher({
  enabled,
  images,
  storageKey = 'app:bgIndex',
}: {
  enabled: boolean
  images?: BackgroundItem[]
  storageKey?: string
}) {
  const bgImages = useMemo<BackgroundItem[]>(
    () =>
      images ?? [
        { src: '/bg/1.jpg', label: 'Electric Surge' },
        { src: '/bg/2.jpg', label: 'RGB Glow' },
        { src: '/bg/3.jpg', label: 'cyperpunk' },
        { src: '/bg/4.jpg', label: 'Glass Reflection' },
        { src: '/bg/5.jpg', label: 'Fire Trails' },
        { src: '/bg/6.jpg', label: 'Psychedelic Flow' },
        { src: '/bg/7.jpg', label: 'Digital Stream' },
        { src: null, label: 'None' },
      ],
    [images]
  )

  const [bgIndex, setBgIndex] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const i = Number(saved)
        if (!Number.isNaN(i))
          setBgIndex(
            ((i % bgImages.length) + bgImages.length) % bgImages.length
          )
      }
    } catch {}
  }, [bgImages.length, storageKey])

  const onPrev = () => {
    const next = (bgIndex - 1 + bgImages.length) % bgImages.length
    setBgIndex(next)
    try {
      localStorage.setItem(storageKey, String(next))
    } catch {}
  }

  const onNext = () => {
    const next = (bgIndex + 1) % bgImages.length
    setBgIndex(next)
    try {
      localStorage.setItem(storageKey, String(next))
    } catch {}
  }

  const currentBgSrc = bgImages[bgIndex]?.src || null

  return (
    <>
      {enabled && currentBgSrc ? (
        <>
          <img
            src={currentBgSrc}
            alt=""
            aria-hidden="true"
            className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
          />
          <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/90 via-black/30 to-transparent " />
          <div className="fixed inset-0 z-0 pointer-events-none bg-black/30 backdrop-blur-[4px]" />
        </>
      ) : (
        <div className="fixed inset-0 z-0 bg-background" />
      )}

      {enabled ? (
        <>
          <AnimatePresence>
            {panelOpen ? (
              <motion.div
                onClick={() => setPanelOpen(false)}
                className="fixed inset-0 z-30 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : null}
          </AnimatePresence>
          <div className="fixed bottom-6 right-2 z-40">
            {!panelOpen ? (
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="flex flex-col items-center p-2 gap-1 bg-[rgba(43,49,60,0.4)] rounded-[8px] backdrop-blur-sm"
              >
                <div className="w-[64px] h-[40px] rounded overflow-hidden">
                  {currentBgSrc ? (
                    <img
                      src={currentBgSrc}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <Ban className="size-4 text-white/70" />
                    </div>
                  )}
                </div>
                <span className="text-[#C9CDD4] text-xs leading-5">
                  Background
                </span>
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                  className="origin-bottom-right"
                >
                  <Card className="w-[230px] rounded-2xl bg-[rgba(43,49,60,0.6)] backdrop-blur-md p-2 gap-0">
                    <div className="relative rounded-xl overflow-hidden h-[120px] w-full bg-[#2B313C]">
                      {currentBgSrc ? (
                        <img
                          src={currentBgSrc}
                          alt="Background"
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Ban className="size-8 text-white/70" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1">
                        {bgImages.map((_, i) => (
                          <div
                            key={i}
                            className={`size-1.5 rounded-full ${i === bgIndex ? 'bg-white/90' : 'bg-white/40'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-muted-foreground text-sm">
                          Background
                        </div>
                        <div className="text-white/90 text-base font-medium">
                          {bgImages[bgIndex]?.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-[#2B313C]/60"
                          onClick={onPrev}
                        >
                          <ChevronLeft className="size-4 text-white/90" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-[#2B313C]/60"
                          onClick={onNext}
                        >
                          <ChevronRight className="size-4 text-white/90" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </>
      ) : null}
    </>
  )
}
