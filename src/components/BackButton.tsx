'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type BackButtonProps = {
  href?: string
  label?: string
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: string
}

export default function BackButton({
  href,
  label = 'Back',
  className,
  size = 'sm',
  variant = 'secondary',
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) router.push(href)
    else router.back()
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant as any}
      className={`bg-overlay hover:bg-overlay-hover ${className || ''}`}
    >
      <ChevronLeft className="size-4" />
      {label}
    </Button>
  )
}
