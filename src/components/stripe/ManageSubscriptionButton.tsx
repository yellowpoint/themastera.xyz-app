'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

interface ManageSubscriptionButtonProps {
  label?: string
  className?: string
}

export function ManageSubscriptionButton({
  label = 'Manage Subscription',
  className,
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      window.location.href = data.url
    } catch (error) {
      toast.error('Failed to open billing portal')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handlePortal}
      disabled={loading}
      className={className}
    >
      {loading ? 'Loading...' : label}
    </Button>
  )
}
