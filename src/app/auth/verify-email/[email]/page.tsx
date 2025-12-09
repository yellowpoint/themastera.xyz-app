'use client'
import { ResendVerificationEmailDialog } from '@/components/auth/ResendVerificationEmailDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { request } from '@/lib/request'
import { CheckCircle, XCircle } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  )
  const [message, setMessage] = useState<string>('')
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const email = decodeURIComponent((params as any).email || '').toLowerCase()
  const error = searchParams.get('error')

  useEffect(() => {
    if (!email) {
      setStatus('error')
      setMessage('Missing verification parameters')
      return
    }

    // If there is a token_expired error in the URL, show error immediately
    if (error === 'token_expired') {
      setStatus('error')
      setMessage(
        'Your verification link has expired. Please request a new one.'
      )
      return
    }

    // Check if the email has been verified
    checkEmailVerificationStatus(email)
  }, [email, error])

  const checkEmailVerificationStatus = async (email: string) => {
    try {
      const { data } = await request.post<{ verified: boolean }>(
        '/api/auth/check-verification-status',
        { email }
      )

      if (
        (data as any) && (data as any).verified !== undefined
          ? true
          : (data?.success ?? false)
      ) {
        const payload: any = (data as any).data ?? data
        if (payload.verified) {
          setStatus('success')
          setMessage(
            'Your email has been successfully verified! You can now use all features.'
          )
          // Redirect to the login page after 3 seconds
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(
            'Email not verified yet, please check your inbox and click the verification link.'
          )
        }
      } else {
        setStatus('error')
        setMessage(
          (data as any)?.error || 'Failed to check verification status'
        )
      }
    } catch (error) {
      console.error('Error checking email verification status:', error)
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Network error, please try again later'
      )
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center p-8">
          {status === 'verifying' && (
            <>
              <div className="mb-4 mx-auto">
                <Spinner className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Verifying Email...</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Verifying your email address, please wait...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                Verification Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to the login page in 3 seconds...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={() => setIsResendDialogOpen(true)}
                  className="w-full"
                >
                  Resend Verification Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  Return to Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ResendVerificationEmailDialog
        email={email}
        open={isResendDialogOpen}
        onOpenChange={setIsResendDialogOpen}
      />
    </div>
  )
}
