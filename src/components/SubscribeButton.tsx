'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellRing } from 'lucide-react'
import { request } from '@/lib/request'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

/**
 * Reusable Subscribe button for following/unfollowing a user.
 * - Uses shared request util
 * - Minimal, English UI, lucide icons
 */
type SubscribeButtonProps = {
  userId: string
  isFollowing?: boolean
  onChanged?: (action: 'follow' | 'unfollow') => void
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: string
  disabled?: boolean
}

export default function SubscribeButton({
  userId,
  isFollowing = false,
  onChanged,
  className = '',
  size = 'default',
  variant,
  disabled = false,
}: SubscribeButtonProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [following, setFollowing] = useState<boolean>(!!isFollowing)
  const [pending, setPending] = useState<boolean>(false)

  useEffect(() => {
    setFollowing(!!isFollowing)
  }, [isFollowing])

  const handleClick = async () => {
    if (pending || disabled) return
    if (!userId) return

    // Prevent self-subscribe
    if (currentUser?.id && currentUser.id === userId) {
      toast.error('You cannot subscribe to yourself')
      return
    }

    // Require login before subscribing
    if (!currentUser?.id) {
      toast.error('Please sign in to subscribe')
      router.push('/login')
      return
    }
    const nextAction = following ? 'unfollow' : 'follow'
    setPending(true)
    try {
      const res = await request.post(`/api/users/${userId}/follow`, {
        action: nextAction,
      })

      if (res.data?.success) {
        setFollowing(nextAction === 'follow')
        if (typeof onChanged === 'function') {
          onChanged(nextAction)
        }
      } else {
      }
    } catch (_) {
      // Errors are handled internally by shared request util
    } finally {
      setPending(false)
    }
  }

  const computedVariant = variant ?? (following ? 'secondary' : 'default')

  return (
    <Button
      className={className}
      size={size}
      variant={
        computedVariant as
          | 'default'
          | 'secondary'
          | 'link'
          | 'destructive'
          | 'outline'
          | 'ghost'
      }
      onClick={handleClick}
      disabled={pending || disabled}
      aria-label={following ? 'Unsubscribe' : 'Subscribe'}
    >
      {following ? (
        <span className="inline-flex items-center gap-2">
          <BellRing className="w-4 h-4" />
          Unsubscribe
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Subscribe
        </span>
      )}
    </Button>
  )
}
