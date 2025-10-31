'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')
  const router = useRouter()
  const params = useParams()

  // Get email from route parameters
  const email = decodeURIComponent(params.email)

  useEffect(() => {
    if (email) {
      // Check if the email has been verified
      checkEmailVerificationStatus(email)
    } else {
      setStatus('error')
      setMessage('Missing verification parameters')
    }
  }, [email])

  const checkEmailVerificationStatus = async (email) => {
    try {
      const response = await fetch('/api/auth/check-verification-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.verified) {
          setStatus('success')
          setMessage('Your email has been successfully verified! You can now use all features.')
          // Redirect to the login page after 3 seconds
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Email not verified yet, please check your inbox and click the verification link.')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to check verification status')
      }
    } catch (error) {
      console.error('Error checking email verification status:', error)
      setStatus('error')
      setMessage('Network error, please try again later')
    }
  }

  const resendVerification = async () => {
    try {
      if (!email) {
        setMessage('Unable to get email address, please register again')
        return
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('Verification email has been resent, please check your inbox')
      } else {
        const data = await response.json()
        setMessage(data.error || 'Resend failed, please try again later')
      }
    } catch (error) {
      setMessage('Network error, please try again later')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center p-8">
          {status === 'verifying' && (
            <>
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-muted-foreground mx-auto" />
              <h1 className="text-2xl font-bold mb-4">Verifying Email...</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Verifying your email address, please wait...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-4">Verification Successful!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to the login page in 3 seconds...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={resendVerification}
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
    </div>
  )
}