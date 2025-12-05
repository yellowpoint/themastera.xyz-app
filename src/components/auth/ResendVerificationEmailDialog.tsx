'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { request } from '@/lib/request'
import { useState } from 'react'
import { toast } from 'sonner'

interface ResendVerificationEmailDialogProps {
  email: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ResendVerificationEmailDialog({
  email,
  open,
  onOpenChange,
  onSuccess,
}: ResendVerificationEmailDialogProps) {
  const [isResending, setIsResending] = useState(false)

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address first')
      return
    }

    setIsResending(true)
    try {
      const { ok, error: reqError } = await request.post(
        '/api/auth/resend-verification',
        {
          email: email,
        }
      )

      if (ok) {
        toast.success('Verification email sent! Please check your inbox.')
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast.error(reqError || 'Failed to send verification email')
      }
    } catch (err) {
      toast.error('An error occurred while sending verification email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Verification Email</DialogTitle>
          <DialogDescription>
            We will send a verification link to{' '}
            <span className="font-medium text-foreground">{email}</span>. Please
            check your inbox (and spam folder) to verify your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isResending}
          >
            Cancel
          </Button>
          <Button onClick={handleResendVerification} loading={isResending}>
            Send Verification Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
