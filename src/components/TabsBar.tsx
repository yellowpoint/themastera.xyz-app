'use client'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

type TabItem = { key: string; label: string }

export default function TabsBar({
  tabs,
  activeKey,
  onChange,
  className,
  labelClassName,
}: {
  tabs: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  className?: string
  labelClassName?: string
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicatorLeft, setIndicatorLeft] = useState(0)

  const orderedKeys = useMemo(() => tabs.map((t) => t.key), [tabs])

  useEffect(() => {
    const container = containerRef.current
    const current = itemsRef.current[activeKey]
    if (!container || !current) return
    const cRect = container.getBoundingClientRect()
    const iRect = current.getBoundingClientRect()
    const width = 16
    const left = iRect.left - cRect.left + iRect.width / 2 - width / 2
    setIndicatorLeft(left)
  }, [activeKey, orderedKeys])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-8 ${className || ''}`}
    >
      {tabs.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <button
            ref={(el) => {
              itemsRef.current[key] = el
            }}
            className={cn(
              'transition-colors duration-300 text-sm',
              activeKey === key ? 'text-highlight!' : 'text-muted-foreground',
              labelClassName || ''
            )}
            type="button"
            onClick={() => onChange(key)}
          >
            {label}
          </button>
        </div>
      ))}
      <div
        className="absolute -bottom-[6px] h-1 w-4 rounded bg-primary transition-all duration-300"
        style={{ left: `${indicatorLeft}px` }}
      />
    </div>
  )
}
