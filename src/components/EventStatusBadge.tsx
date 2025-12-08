import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type EventStatus = 'Upcoming' | 'On viewing' | 'Archive'

interface EventStatusBadgeProps {
  status: EventStatus
  className?: string
  size?: 'sm' | 'md'
}

export default function EventStatusBadge({
  status,
  className,
  size = 'sm',
}: EventStatusBadgeProps) {
  let colorClass = ''

  switch (status) {
    case 'On viewing':
      colorClass = 'border-[#D7FF01] text-[#D7FF01]'
      break
    case 'Upcoming':
      colorClass = 'border-[#FF9A2E] text-[#FF9A2E]'
      break
    case 'Archive':
      colorClass = 'border-[#86909C] text-[#86909C]'
      break
    default:
      colorClass = 'border-border text-muted-foreground bg-muted'
  }

  const sizeClass =
    size === 'sm'
      ? 'px-1.5 py-0 text-[10px] rounded-sm'
      : 'px-3 py-1 text-xs rounded-md'

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-normal uppercase tracking-wide border',
        colorClass,
        sizeClass,
        className
      )}
    >
      {status}
    </Badge>
  )
}
