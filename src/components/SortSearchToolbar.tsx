'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

type Props = {
  sortAZ: boolean
  onSortChange: (value: boolean) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  className?: string
  searchPlaceholder?: string
  showCreateButton?: boolean
  onCreateClick?: () => void
  createLabel?: string
  size?: 'compact' | 'normal'
}

export default function SortSearchToolbar({
  sortAZ,
  onSortChange,
  searchQuery,
  onSearchQueryChange,
  className,
  searchPlaceholder = 'Search playlist name',
  showCreateButton = false,
  onCreateClick,
  createLabel = 'Create',
  size = 'normal',
}: Props) {
  const btnSizeClass = size === 'compact' ? 'h-6 text-xs' : 'h-7 text-sm'
  const inputSizeClass =
    size === 'compact' ? 'h-6 text-xs pl-8' : 'h-7 text-sm pl-8'
  const iconSizeClass = size === 'compact' ? 'size-3' : 'h-4 w-4'
  const searchWidthClass =
    size === 'compact' ? 'w-full md:w-80 h-6 text-xs' : 'w-full md:w-80'
  return (
    <div className={cn('flex items-center gap-3 mb-4', className)}>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onSortChange(false)}
        className={cn(
          'rounded-lg px-3',
          btnSizeClass,
          !sortAZ
            ? 'bg-primary text-primary-foreground'
            : 'bg-overlay text-white hover:bg-overlay-hover'
        )}
      >
        Recent added
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onSortChange(true)}
        className={cn(
          'rounded-lg px-3',
          btnSizeClass,
          sortAZ
            ? 'bg-primary text-primary-foreground'
            : 'bg-overlay text-white hover:bg-overlay-hover'
        )}
      >
        A-Z
      </Button>
      <div className={cn('relative', searchWidthClass)}>
        <Search
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground',
            iconSizeClass
          )}
        />
        <Input
          placeholder={searchPlaceholder}
          className={cn(inputSizeClass, 'bg-overlay text-white border-0!')}
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
      {showCreateButton ? (
        <Button
          onClick={onCreateClick}
          variant="secondary"
          className={cn('bg-overlay hover:bg-overlay-hover', btnSizeClass)}
        >
          <Plus className="size-3" />
          {createLabel}
        </Button>
      ) : null}
    </div>
  )
}
